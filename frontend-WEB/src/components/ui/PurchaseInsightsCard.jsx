import useAppStore from '../../store/useAppStore';

export default function PurchaseInsightsCard() {
  const cart = useAppStore((state) => state.cart);
  const getCartTotal = useAppStore((state) => state.getCartTotal);

  const total = getCartTotal();

  let probability = 30;

  probability += Math.min(cart.length * 10, 30);
  probability += Math.min(total / 20, 25);

  probability = Math.min(Math.round(probability), 95);

  let riskLevel = 'High';
  let recommendation = 'Explore similar items';

  if (probability >= 80) {
    riskLevel = 'Low';
    recommendation = 'Continue to checkout';
  } else if (probability >= 50) {
    riskLevel = 'Medium';
    recommendation = 'Limited-time offer may help';
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        marginTop: '16px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        Purchase Insights
      </h3>

      <p>
        Completion Probability: <strong>{probability}%</strong>
      </p>

      <p>
        Risk Level: <strong>{riskLevel}</strong>
      </p>

      <p>
        Suggested Action: <strong>{recommendation}</strong>
      </p>
    </div>
  );
}