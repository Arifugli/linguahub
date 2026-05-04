import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Whiteboard } from './Whiteboard';
import { VideoPanel } from './VideoPanel';
import { LessonChat } from './LessonChat';
import { 
  PanelLeftClose, 
  PanelRightClose,
  Users,
  MessageSquare,
  Settings,
  Clock,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface VirtualClassroomProps {
  lessonId: string;
  onLeave?: () => void;
}

interface Lesson {
  id: string;
  title: string;
  tutor_id: string;
  student_id: string | null;
  status: string;
  whiteboard_data: any[];
  scheduled_at: string;
  duration_minutes: number;
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({ 
  lessonId,
  onLeave 
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchLesson();
    initializeMedia();

    // Subscribe to lesson updates
    const channel = supabase
      .channel(`lesson-${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lessons',
          filter: `id=eq.${lessonId}`
        },
        (payload) => {
          setLesson(payload.new as Lesson);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      cleanupMedia();
    };
  }, [lessonId]);

  // Timer for lesson duration
  useEffect(() => {
    if (lesson?.status === 'in_progress') {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lesson?.status]);

  const fetchLesson = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить урок',
        variant: 'destructive'
      });
      return;
    }

    // Parse whiteboard_data properly
    const lessonData: Lesson = {
      ...data,
      whiteboard_data: Array.isArray(data.whiteboard_data) 
        ? data.whiteboard_data 
        : []
    };
    
    setLesson(lessonData);
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setIsConnected(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Предупреждение',
        description: 'Не удалось получить доступ к камере или микрофону',
        variant: 'destructive'
      });
    }
  };

  const cleanupMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  };

  const handleWhiteboardChange = useCallback(async (data: any[]) => {
    if (!lesson) return;

    await supabase
      .from('lessons')
      .update({ whiteboard_data: data })
      .eq('id', lessonId);
  }, [lessonId, lesson]);

  const handleStartLesson = async () => {
    await supabase
      .from('lessons')
      .update({ status: 'in_progress' })
      .eq('id', lessonId);
    
    toast({
      title: 'Урок начался',
      description: 'Приятного занятия!'
    });
  };

  const handleEndLesson = async () => {
    await supabase
      .from('lessons')
      .update({ status: 'completed' })
      .eq('id', lessonId);
    
    cleanupMedia();
    
    toast({
      title: 'Урок завершён',
      description: `Продолжительность: ${formatTime(elapsedTime)}`
    });
    
    onLeave?.();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  const isTutor = user?.id === lesson.tutor_id;

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-background border-b">
        <div className="flex items-center gap-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-semibold">{lesson.title}</h1>
            <p className="text-xs text-muted-foreground">
              {lesson.status === 'in_progress' ? 'Урок идёт' : 
               lesson.status === 'scheduled' ? 'Ожидание начала' : 
               lesson.status === 'completed' ? 'Урок завершён' : 'Отменён'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVideo(!showVideo)}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>

          {lesson.status === 'scheduled' && isTutor && (
            <Button onClick={handleStartLesson}>
              Начать урок
            </Button>
          )}

          {lesson.status === 'in_progress' && (
            <Button variant="destructive" onClick={handleEndLesson}>
              Завершить урок
            </Button>
          )}

          {lesson.status !== 'in_progress' && lesson.status !== 'scheduled' && (
            <Button variant="outline" onClick={onLeave}>
              Выйти
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Video Panel */}
          {showVideo && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <div className="h-full p-2">
                  <VideoPanel
                    localStream={localStream}
                    remoteStream={remoteStream}
                    localUser={{
                      name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Вы',
                      avatar: profile?.avatar_url || undefined
                    }}
                    onEndCall={handleEndLesson}
                    isConnected={isConnected}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Whiteboard */}
          <ResizablePanel defaultSize={showChat && showVideo ? 55 : showChat || showVideo ? 75 : 100}>
            <div className="h-full p-2">
              <Whiteboard
                initialData={lesson.whiteboard_data}
                onDataChange={handleWhiteboardChange}
                readOnly={lesson.status === 'completed'}
              />
            </div>
          </ResizablePanel>

          {/* Chat Panel */}
          {showChat && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full p-2">
                  <LessonChat lessonId={lessonId} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
