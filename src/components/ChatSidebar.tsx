import React from 'react';
import { MessageSquare, Plus, Trash2, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { setCurrentSession, deleteSession } from '../store/chatSlice';
import { useCreateNewChatMutation } from '../store/chatApi';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

export const ChatSidebar: React.FC = () => {
  const { currentSession, sessions } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [createNewChat, { isLoading }] = useCreateNewChatMutation();

  const handleNewChat = async () => {
    try {
      const response = await createNewChat().unwrap();
      
      if (response.success) {
        const newSession = {
          id: response.chatId,
          messages: [],
          pdfUploaded: false,
          createdAt: Date.now(),
        };
        dispatch(setCurrentSession(newSession));
        toast({
          title: "New chat created",
          description: "Ready for a fresh conversation!",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to create chat",
        description: "There was an error creating a new chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectChat = (session: any) => {
    dispatch(setCurrentSession(session));
  };

  const handleDeleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteSession(sessionId));
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed.",
    });
  };

  const formatChatTitle = (session: any) => {
    if (session.pdfName) {
      return session.pdfName.replace('.pdf', '');
    }
    if (session.messages.length > 0) {
      return session.messages[0].content.slice(0, 30) + '...';
    }
    return `Chat ${session.id.slice(-8)}`;
  };

  return (
    <div className="w-80 h-full glass border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PDF Chat AI
          </h1>
        </div>
        
        <Button
          onClick={handleNewChat}
          disabled={isLoading}
          className="w-full btn-cosmic flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectChat(session)}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                  currentSession?.id === session.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    session.pdfUploaded ? 'bg-green-500/20' : 'bg-muted'
                  }`}>
                    {session.pdfUploaded ? (
                      <FileText className="w-4 h-4 text-green-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {formatChatTitle(session)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.messages.length} messages
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteChat(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};