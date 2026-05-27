import { useContext } from 'react';
import GroupOrderContext from './GroupOrderContext';

export function useGroupOrder() {
  const ctx = useContext(GroupOrderContext);
  if (!ctx) {
    throw new Error('useGroupOrder must be used inside <GroupOrderProvider>');
  }
  return ctx;
}