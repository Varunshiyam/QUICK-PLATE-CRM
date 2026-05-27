import { useState } from 'react';
import { GroupOrderButton, InviteModal, BillSplitPreview } from '../../components/GroupOrder';
import { GroupOrderProvider } from '../../context/GroupOrderContext';


const MOCK_PARTICIPANTS = [
  { id: 'you', name: 'You', initials: 'YO', avatarColor: '#FAC775' },
  { id: 'arjun', name: 'Arjun', initials: 'AR', avatarColor: '#B5D4F4' },
  { id: 'priya', name: 'Priya', initials: 'PR', avatarColor: '#9FE1CB' },
];

const MOCK_CART = [
  { id: 'i1', name: 'Margherita', price: 349, qty: 1, participantId: 'you' },
  { id: 'i2', name: 'Pepperoni Pizza', price: 429, qty: 1, participantId: 'arjun' },
  { id: 'i3', name: 'Pasta Arrabiata', price: 279, qty: 1, participantId: 'priya' },
];

export default function GroupOrderPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 1000);
  };

  return (
    <GroupOrderProvider currentUserId="you">
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>🍕 Bella Napoli</h2>

        <GroupOrderButton
          restaurantId="bella-napoli"
          onStart={handleStart}
          loading={loading}
        />

        {showModal && (
          <div style={{ marginTop: '1rem' }}>
            <InviteModal
              sessionLink="https://quickplate.app/group/x9f2k"
              participants={MOCK_PARTICIPANTS}
              onClose={() => setShowModal(false)}
              onProceedToCart={() => setShowModal(false)}
            />
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <BillSplitPreview
            cartItems={MOCK_CART}
            participants={MOCK_PARTICIPANTS}
            paymentStatuses={{ you: 'pending', arjun: 'waiting', priya: 'pending' }}
            currentUserId="you"
            onPay={(amount) => alert(`Paying ₹${amount}`)}
          />
        </div>
      </div>
    </GroupOrderProvider>
  );
}