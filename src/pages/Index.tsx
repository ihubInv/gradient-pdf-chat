import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ChatLayout } from '../components/ChatLayout';

const Index = () => {
  return (
    <Provider store={store}>
      <ChatLayout />
    </Provider>
  );
};

export default Index;
