import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { PdfUpload } from './PdfUpload';
import { NewChatButton } from './NewChatButton';
import { useAppSelector } from '../hooks/useAppDispatch';

export const ChatLayout: React.FC = () => {
  const { currentSession } = useAppSelector((state) => state.chat);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-primary animate-glow">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PDF Chat AI
            </h1>
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your PDF documents and have intelligent conversations about their content
          </p>
          <div className="mt-4">
            <NewChatButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-180px)]">
          {/* PDF Upload Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 h-full border border-border/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-primary" />
                Document Upload
              </h2>
              <PdfUpload />
              
              {/* Session Info */}
              {currentSession && (
                <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/30">
                  <h3 className="font-medium mb-2">Current Session</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Chat ID: {currentSession.id.slice(-8)}</p>
                    <p>Messages: {currentSession.messages.length}</p>
                    <p>
                      Status: {' '}
                      <span className={currentSession.pdfUploaded ? 'text-green-400' : 'text-yellow-400'}>
                        {currentSession.pdfUploaded ? 'Ready' : 'Waiting for PDF'}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl h-full border border-border/50 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border/50">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-secondary animate-pulse" />
                    Chat Interface
                  </h2>
                </div>
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Secure & Private • Real-time Processing</p>
        </div>
      </div>
    </div>
  );
};