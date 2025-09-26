import React, { useState, createContext, useContext } from 'react';
import MessagingModal from './MessagingModal';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [targetUserId, setTargetUserId] = useState(null);

  const openMessaging = (id = null, name = 'Support Chat', userId = null) => {
    console.log('🔍 DEBUG: openMessaging called with:', { id, name, userId });
    setRecipientId(id);
    setRecipientName(name);
    setTargetUserId(userId);
    setIsOpen(true);
  };

  const closeMessaging = () => {
    setIsOpen(false);
    setRecipientId(null);
    setRecipientName('');
    setTargetUserId(null);
  };

  return (
    <MessagingContext.Provider value={{ openMessaging, closeMessaging }}>
      {children}
      <MessagingModal 
        isOpen={isOpen}
        onClose={closeMessaging}
        recipientId={recipientId}
        recipientName={recipientName}
        targetUserId={targetUserId}
      />
    </MessagingContext.Provider>
  );
};