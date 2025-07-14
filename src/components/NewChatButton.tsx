import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createNewSession, setUploadStatus } from '../store/chatSlice';
import { useCreateNewChatMutation } from '../store/chatApi';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

export const NewChatButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [createNewChat, { isLoading }] = useCreateNewChatMutation();

  const handleNewChat = async () => {
    try {
      const response = await createNewChat().unwrap();
      
      if (response.success) {
        dispatch(createNewSession(response.chatId));
        dispatch(setUploadStatus('idle'));
        toast({
          title: "New chat created",
          description: "Ready for a fresh conversation!",
        });
      } else {
        throw new Error('Failed to create new chat');
      }
    } catch (error) {
      toast({
        title: "Failed to create chat",
        description: "There was an error creating a new chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleNewChat}
      disabled={isLoading}
      className="btn-cosmic relative group overflow-hidden min-w-[140px]"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-2">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        <span className="font-semibold">New Chat</span>
        <Sparkles className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl animate-glow" />
      </div>
    </Button>
  );
};