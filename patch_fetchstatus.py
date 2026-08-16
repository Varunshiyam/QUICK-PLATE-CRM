import re

with open("src/pages/Tracking/Tracking.jsx", "r") as f:
    content = f.read()

# I will find the fetchStatus block and replace it
# The block starts at `const fetchStatus = async () => {`
# And ends at the matching bracket before `// First fetch immediately` or `fetchStatus();`

# Since we don't know the exact string, let's use a robust regex or just string replacement
old_fetch_status_start = "const fetchStatus = async () => {"
old_fetch_status_end = "};\n\n    // First fetch immediately"

start_idx = content.find(old_fetch_status_start)
end_idx = content.find(old_fetch_status_end)

if start_idx != -1 and end_idx != -1:
    old_block = content[start_idx:end_idx + 2] # include `};`
    
    new_block = """const fetchStatus = async () => {
      try {
        let data = null;

        if (isMockMode) {
          data = {
            orderId,
            orderStatus: 'ASSIGNED',
            agent: { name: 'Carlos M.' }
          };
        } else {
          const res = await axios.get(
            `${API_BASE_URL}/services/apexrest/order/status/${orderId}`
          );
          data = res.data;
        }

        if (data) {
          setOrder(prev => ({
            ...(prev || {}),
            id: data.orderId,
            status: data.orderStatus,
            agent: {
              ...(prev?.agent || MOCK_ORDER.agent),
              name: data.agent?.name || prev?.agent?.name || MOCK_ORDER.agent.name
            },
            estimatedTime: prev?.estimatedTime || MOCK_ORDER.estimatedTime,
            statusText: prev?.statusText || MOCK_ORDER.statusText,
            statusDesc: prev?.statusDesc || MOCK_ORDER.statusDesc
          }));

          if (
            ['ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']
              .includes(data.orderStatus)
          ) {
            clearInterval(pollingRef.current);
          }
        }

        setLoading(false);

      } catch (err) {
        console.error('Tracking error:', err);
      }
    };"""
    
    content = content[:start_idx] + new_block + content[end_idx + 2:]
    
    with open("src/pages/Tracking/Tracking.jsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Could not find fetchStatus block bounds", start_idx, end_idx)

