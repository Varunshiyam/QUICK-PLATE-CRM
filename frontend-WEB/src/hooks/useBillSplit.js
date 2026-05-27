import { useState, useMemo } from 'react';

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

function useBillSplit(cartItems, participants) {
  const [splitMode, setSplitMode] = useState('equal');

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + DELIVERY_FEE + tax;

    let shares = {};

    if (splitMode === 'equal') {
      const each = participants.length > 0 ? Math.round(total / participants.length) : 0;
      participants.forEach((p) => {
        shares[p.id] = each;
      });
    } else {
      const itemTotals = {};
      participants.forEach((p) => {
        itemTotals[p.id] = 0;
      });
      cartItems.forEach((item) => {
        itemTotals[item.participantId] =
          (itemTotals[item.participantId] || 0) + item.price * item.qty;
      });
      const overhead = DELIVERY_FEE + tax;
      participants.forEach((p) => {
        const items = itemTotals[p.id] || 0;
        const extra =
          subtotal > 0
            ? Math.round((items / subtotal) * overhead)
            : Math.round(overhead / participants.length);
        shares[p.id] = items + extra;
      });
    }

    return { subtotal, tax, delivery: DELIVERY_FEE, total, shares };
  }, [cartItems, participants, splitMode]);

  return { splitMode, setSplitMode, summary };
}

export default useBillSplit;