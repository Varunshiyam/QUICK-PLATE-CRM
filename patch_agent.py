import os

payment_file = "src/pages/PaymentSuccess/PaymentSuccess.jsx"
tracking_file = "src/pages/Tracking/Tracking.jsx"

with open(payment_file, "r") as f:
    payment_content = f.read()

old_payment = """           // Based on the prompt reference: "if (response.data.paymentStatus === 'PAID')"
           if (response.data?.paymentStatus === 'PAID') {
             isPaid = true;
           }
        }

        if (isPaid) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          success?.();
          setStatus('SUCCESS');
          
          setTimeout(() => {
            clearCart();
            navigate(`/tracking/${orderId}`, { replace: true });
          }, 3500);
        }"""

new_payment = """           // Based on the prompt reference: "if (response.data.paymentStatus === 'PAID')"
           if (response.data?.paymentStatus === 'PAID') {
             isPaid = true;
           }

           // Explicitly check for ASSIGNED and fetch agent details
           if (response.data?.orderStatus === 'ASSIGNED') {
             try {
                const agentRes = await axios.get(`${API_BASE_URL}/services/apexrest/order/agent/${orderId}`);
                if (agentRes.data) {
                  window.sessionStorage.setItem(`agent_${orderId}`, JSON.stringify(agentRes.data));
                }
             } catch(e) {
                // If the agentName is passed directly in the status object:
                if (response.data?.agentName) {
                  window.sessionStorage.setItem(`agent_${orderId}`, JSON.stringify({ name: response.data.agentName }));
                } else {
                  console.warn("Could not fetch assigned agent details");
                }
             }
           }
        }

        if (isPaid) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          success?.();
          setStatus('SUCCESS');
          
          setTimeout(() => {
            clearCart();
            navigate(`/tracking/${orderId}`, { replace: true });
          }, 3500);
        }"""

payment_content = payment_content.replace(old_payment, new_payment)
with open(payment_file, "w") as f:
    f.write(payment_content)


with open(tracking_file, "r") as f:
    tracking_content = f.read()

old_tracking = """        if (backendStatus) {
          setOrder(prev => ({
            ...(prev || {}),
            id: orderId,
            status: backendStatus,
            agent: prev?.agent || MOCK_ORDER.agent,
            estimatedTime: prev?.estimatedTime || MOCK_ORDER.estimatedTime,
            statusText: prev?.statusText || MOCK_ORDER.statusText,
            statusDesc: prev?.statusDesc || MOCK_ORDER.statusDesc
          }));"""

new_tracking = """        if (backendStatus) {
          // Fetch exact backend agent if available
          let fetchedAgentName = null;
          try {
             // 1. Try to get it from Payment Success sessionStorage
             const cachedAgent = window.sessionStorage.getItem(`agent_${orderId}`);
             if (cachedAgent) {
                 const parsed = JSON.parse(cachedAgent);
                 fetchedAgentName = parsed.name || parsed.agentName;
             }
             // 2. Fallback to API directly on tracking page if missing
             if (!fetchedAgentName && backendStatus === 'ASSIGNED') {
                 const agentRes = await axios.get(`${API_BASE_URL}/services/apexrest/order/agent/${orderId}`);
                 fetchedAgentName = agentRes.data?.name || agentRes.data?.agentName;
             }
          } catch(e) { }

          // Use the real backend agent name (No mockups for name)
          const finalAgent = {
            ...(prev?.agent || MOCK_ORDER.agent),
            name: fetchedAgentName || prev?.agent?.name || "Assigning..."
          };

          setOrder(prev => ({
            ...(prev || {}),
            id: orderId,
            status: backendStatus,
            agent: finalAgent,
            estimatedTime: prev?.estimatedTime || MOCK_ORDER.estimatedTime,
            statusText: prev?.statusText || MOCK_ORDER.statusText,
            statusDesc: prev?.statusDesc || MOCK_ORDER.statusDesc
          }));"""

tracking_content = tracking_content.replace(old_tracking, new_tracking)

with open(tracking_file, "w") as f:
    f.write(tracking_content)

