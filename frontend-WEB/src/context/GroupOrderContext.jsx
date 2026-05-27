import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const GROUP_ORDER_ACTIONS = {
  START_SESSION: 'START_SESSION',
  SET_PARTICIPANTS: 'SET_PARTICIPANTS',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  SET_PAYMENT_STATUS: 'SET_PAYMENT_STATUS',
  RESET: 'RESET',
};

const initialState = {
  sessionId: null,
  sessionLink: null,
  restaurantId: null,
  participants: [],
  cartItems: [],
  paymentStatuses: {},
};

function groupOrderReducer(state, action) {
  switch (action.type) {
    case GROUP_ORDER_ACTIONS.START_SESSION:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        sessionLink: action.payload.sessionLink,
        restaurantId: action.payload.restaurantId,
      };
    case GROUP_ORDER_ACTIONS.SET_PARTICIPANTS:
      return { ...state, participants: action.payload };
    case GROUP_ORDER_ACTIONS.ADD_ITEM: {
      const existing = state.cartItems.find(
        (item) =>
          item.name === action.payload.name &&
          item.participantId === action.payload.participantId,
      );
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === existing.id ? { ...item, qty: item.qty + 1 } : item,
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, qty: action.payload.qty || 1 }],
      };
    }
    case GROUP_ORDER_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload.itemId),
      };
    case GROUP_ORDER_ACTIONS.UPDATE_QTY:
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.id === action.payload.itemId ? { ...item, qty: action.payload.qty } : item,
          )
          .filter((item) => item.qty > 0),
      };
    case GROUP_ORDER_ACTIONS.SET_PAYMENT_STATUS:
      return {
        ...state,
        paymentStatuses: {
          ...state.paymentStatuses,
          [action.payload.participantId]: action.payload.status,
        },
      };
    case GROUP_ORDER_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

const GroupOrderContext = createContext(null);

export function GroupOrderProvider({ currentUserId, children }) {
  const [state, dispatch] = useReducer(groupOrderReducer, initialState);

  const startSession = useCallback(({ sessionId, sessionLink, restaurantId }) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.START_SESSION, payload: { sessionId, sessionLink, restaurantId } });
  }, []);

  const setParticipants = useCallback((participants) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.SET_PARTICIPANTS, payload: participants });
  }, []);

  const addItem = useCallback((item) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.ADD_ITEM, payload: item });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.REMOVE_ITEM, payload: { itemId } });
  }, []);

  const updateQty = useCallback((itemId, qty) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.UPDATE_QTY, payload: { itemId, qty } });
  }, []);

  const setPaymentStatus = useCallback((participantId, status) => {
    dispatch({ type: GROUP_ORDER_ACTIONS.SET_PAYMENT_STATUS, payload: { participantId, status } });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: GROUP_ORDER_ACTIONS.RESET });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      currentUserId,
      startSession,
      setParticipants,
      addItem,
      removeItem,
      updateQty,
      setPaymentStatus,
      reset,
    }),
    [state, currentUserId, startSession, setParticipants, addItem, removeItem, updateQty, setPaymentStatus, reset],
  );

  return <GroupOrderContext.Provider value={value}>{children}</GroupOrderContext.Provider>;
}

GroupOrderProvider.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function useGroupOrder() {
  const ctx = useContext(GroupOrderContext);
  if (!ctx) {
    throw new Error('useGroupOrder must be used inside <GroupOrderProvider>');
  }
  return ctx;
}