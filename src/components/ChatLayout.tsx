import React from 'react';
import { ChatInterface } from './ChatInterface';
import { ChatSidebar } from './ChatSidebar';
import { useAppSelector } from '../hooks/useAppDispatch';

export const ChatLayout: React.FC = () => {
  const { currentSession } = useAppSelector((state) => state.chat);

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 glass">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-secondary animate-pulse" />
                Chat Interface
              </h2>
              {currentSession && (
                <p className="text-sm text-muted-foreground mt-1">
                  Chat ID: {currentSession.id.slice(-8)} • {currentSession.messages.length} messages
                </p>
              )}
            </div>
            {currentSession && (
              <div className="text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  currentSession.pdfUploaded 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {currentSession.pdfUploaded ? 'PDF Ready' : 'No PDF'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface />
        </div>

        {/* Footer */}
        <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/50">
          <p>Powered by AI • Secure & Private • Real-time Processing</p>
        </div>
      </div>
    </div>
  );
};