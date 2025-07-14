import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ChatLayout } from '../components/ChatLayout';
import { createNewSession } from '../store/chatSlice';

const Index = () => {
  useEffect(() => {
    // Create a default chat session when app loads
    const defaultChatId = `chat_${Date.now()}`;
    store.dispatch(createNewSession(defaultChatId));
  }, []);

  return (
    <Provider store={store}>
      <ChatLayout />
    </Provider>
  );
};

export default Index;
