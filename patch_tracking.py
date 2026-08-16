import re

with open("src/pages/Tracking/Tracking.jsx", "r") as f:
    content = f.read()

# Replace inner part of fetchStatus
old_polling = r"""          // Handle simulation vs backend logic
          if (
            backendStatus === 'ASSIGNED' ||
            backendStatus === 'DELIVERED' ||
            backendStatus === 'CANCELLED'
          ) {
            clearInterval(pollingRef.current);
          }"""

new_polling = """          // Handle simulation vs backend logic
          if (
            backendStatus === 'ASSIGNED' ||
            backendStatus === 'PICKED_UP' ||
            backendStatus === 'OUT_FOR_DELIVERY' ||
            backendStatus === 'DELIVERED' ||
            backendStatus === 'CANCELLED'
          ) {
            clearInterval(pollingRef.current);
          }"""
content = content.replace(old_polling, new_polling)

old_effect = r"""  // Robust simulation logic handles interval & refreshes via localStorage
  useEffect(() => {
    if (!order) return;
    
    // Only simulate if backend tells us it's ASSIGNED
    if (order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'CANCELLED') {
      return;
    }
    
    // Check if real delivered.
    if (order.status === 'DELIVERED') {
      const redirectTimer = setTimeout(() => {
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }

    const storageKey = `TrackingSimStart_${orderId}`;
    let startTime = parseInt(localStorage.getItem(storageKey), 10);
    
    if (!startTime && order.status === 'ASSIGNED') {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime.toString());
    }

    if (startTime) {
      const runSimulationTick = () => {
        const elapsed = Date.now() - startTime;
        let nextStatus = '';
        let timerValue = 0;
        let sDesc = '';
        let sText = '';

        if (elapsed < 8000) {
          nextStatus = 'ASSIGNED';
          timerValue = Math.ceil((8000 - elapsed) / 1000);
          sDesc = 'Agent has been assigned and is heading to the store.';
        } else if (elapsed < 16000) {
          nextStatus = 'PICKED_UP';
          timerValue = Math.ceil((16000 - elapsed) / 1000);
          sDesc = 'Agent has picked up your order.';
        } else if (elapsed < 24000) {
          nextStatus = 'OUT_FOR_DELIVERY';
          timerValue = Math.ceil((24000 - elapsed) / 1000);
          sDesc = 'Agent is on the way to your location!';
        } else {
          nextStatus = 'DELIVERED';
          timerValue = 0;
          sText = 'Delivered';
          sDesc = 'Your order has been delivered! Enjoy your meal.';
        }

        setCountdown(timerValue);
        setOrder(prev => {
          if (!prev) return prev;
          if (prev.status !== nextStatus || prev.statusDesc !== sDesc) {
            return {
              ...prev,
              status: nextStatus,
              statusDesc: sDesc || prev.statusDesc,
              statusText: sText || prev.statusText
            };
          }
          return prev;
        });

        if (nextStatus === 'DELIVERED') {
          clearInterval(simulationIntervalRef.current);
          localStorage.removeItem(storageKey);
          // Redirect logic (it will trigger the true delivery branch above on next render)
        }
      };

      runSimulationTick(); // initial run
      simulationIntervalRef.current = setInterval(runSimulationTick, 1000);

      return () => clearInterval(simulationIntervalRef.current);
    }
  }, [order?.status, orderId, navigate]);"""

new_effect = """  // Frontend simulation logic handling page refreshes
  useEffect(() => {
    if (!order) return;
    
    // Check if it's DELIVERED
    if (order.status === 'DELIVERED') {
      const redirectTimer = setTimeout(() => {
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }

    // Only simulate if the backend status has reached ASSIGNED
    if (['CONFIRMED', 'PREPARING', 'CANCELLED'].includes(order.status)) {
      return; 
    }

    const storageKey = `TrackingSimStart_${orderId}`;
    let startTime = parseInt(localStorage.getItem(storageKey), 10);
    
    // First time we hit ASSIGNED, record start time
    if (!startTime && order.status === 'ASSIGNED') {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime.toString());
    }

    if (startTime) {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);

      const updateSimulation = () => {
        const elapsed = Date.now() - startTime;
        let nextStatus = '';
        let timerValue = 0;
        let sDesc = '';
        let sText = '';

        if (elapsed < 8000) {
          nextStatus = 'ASSIGNED';
          timerValue = Math.ceil((8000 - elapsed) / 1000);
          sDesc = 'Agent has been assigned and is heading to the store.';
        } else if (elapsed < 16000) {
          nextStatus = 'PICKED_UP';
          timerValue = Math.ceil((16000 - elapsed) / 1000);
          sDesc = 'Agent has picked up your order.';
        } else if (elapsed < 24000) {
          nextStatus = 'OUT_FOR_DELIVERY';
          timerValue = Math.ceil((24000 - elapsed) / 1000);
          sDesc = 'Agent is on the way to your location!';
        } else {
          nextStatus = 'DELIVERED';
          timerValue = 0;
          sText = 'Delivered';
          sDesc = 'Your order has been delivered! Enjoy your meal.';
        }

        setCountdown(timerValue);
        
        setOrder(prev => {
          if (!prev) return prev;
          if (prev.status !== nextStatus || prev.statusDesc !== sDesc || prev.statusText !== sText) {
            return {
              ...prev,
              status: nextStatus,
              statusDesc: sDesc || prev.statusDesc,
              statusText: sText || prev.statusText
            };
          }
          return prev;
        });

        if (nextStatus === 'DELIVERED') {
          clearInterval(simulationIntervalRef.current);
          localStorage.removeItem(storageKey);
        }
      };

      updateSimulation(); // run instantly
      simulationIntervalRef.current = setInterval(updateSimulation, 1000);

      return () => clearInterval(simulationIntervalRef.current);
    }
  }, [order?.status, orderId, navigate]);"""

content = content.replace(old_effect, new_effect)

with open("src/pages/Tracking/Tracking.jsx", "w") as f:
    f.write(content)

