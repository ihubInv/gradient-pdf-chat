import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { addMessage } from '../store/chatSlice';
import { useSendMessageMutation } from '../store/chatApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';

export const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSession, isLoading } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !currentSession) {
      return;
    }

    if (!currentSession.pdfUploaded) {
      toast({
        title: "No PDF uploaded",
        description: "Please upload a PDF file before starting the conversation.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = {
      id: `msg_${Date.now()}_user`,
      content: inputMessage.trim(),
      sender: 'user' as const,
      timestamp: Date.now(),
    };

    dispatch(addMessage(userMessage));
    setInputMessage('');

    try {
      const response = await sendMessage({
        chatId: currentSession.id,
        message: inputMessage.trim(),
      }).unwrap();

      const botMessage = {
        id: `msg_${Date.now()}_bot`,
        content: response.response,
        sender: 'bot' as const,
        timestamp: Date.now(),
      };

      dispatch(addMessage(botMessage));
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <Bot className="mx-auto mb-4 h-16 w-16 text-muted-foreground animate-float" />
          <h3 className="text-xl font-semibold mb-2">No active chat</h3>
          <p className="text-muted-foreground">Create a new chat to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-cosmic">
        {currentSession.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <Bot className="mx-auto mb-4 h-12 w-12 text-primary animate-glow" />
              <h3 className="text-lg font-semibold mb-2">Ready to chat!</h3>
              <p className="text-muted-foreground">
                {currentSession.pdfUploaded 
                  ? `Ask me anything about ${currentSession.pdfName}`
                  : "Upload a PDF to start the conversation"
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-gradient-primary' 
                    : 'bg-gradient-secondary'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'chat-bubble-user'
                      : 'chat-bubble-bot'
                  } animate-fade-in`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              currentSession.pdfUploaded 
                ? "Ask a question about your PDF..." 
                : "Upload a PDF first..."
            }
            disabled={!currentSession.pdfUploaded || isSending}
            className="flex-1 glass border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || !currentSession.pdfUploaded || isSending}
            className="btn-cosmic px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};