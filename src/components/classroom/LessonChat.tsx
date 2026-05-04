import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface LessonChatProps {
  lessonId: string;
}

export const LessonChat: React.FC<LessonChatProps> = ({ lessonId }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`lesson-chat-${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lesson_messages',
          filter: `lesson_id=eq.${lessonId}`
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          // Fetch user info for the new message
          const { data: userData } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('user_id', newMsg.user_id)
            .single();
          
          setMessages(prev => [...prev, { ...newMsg, user: userData || undefined }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('lesson_messages')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (data) {
      // Fetch profiles for all users
      const userIds = [...new Set(data.map(msg => msg.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, avatar_url')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      setMessages(data.map(msg => ({
        ...msg,
        user: profileMap.get(msg.user_id) || undefined
      })));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('lesson_messages')
      .insert({
        lesson_id: lessonId,
        user_id: user.id,
        message: newMessage.trim()
      });

    if (!error) {
      setNewMessage('');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border">
      <div className="p-2 border-b">
        <span className="text-sm font-medium">Чат урока</span>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map(msg => {
            const isOwn = msg.user_id === user?.id;
            const userName = msg.user 
              ? `${msg.user.first_name || ''} ${msg.user.last_name || ''}`.trim() || 'Участник'
              : 'Участник';

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={msg.user?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${isOwn ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(msg.created_at), 'HH:mm', { locale: ru })}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[200px] ${
                      isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-2 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            disabled={isLoading}
            className="text-sm"
          />
          <Button 
            size="icon" 
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
