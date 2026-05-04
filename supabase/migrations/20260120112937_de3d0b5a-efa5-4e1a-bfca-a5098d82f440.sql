-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  room_id TEXT UNIQUE,
  whiteboard_data JSONB DEFAULT '[]'::jsonb,
  recording_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Tutors can manage their own lessons
CREATE POLICY "Tutors can view their lessons"
  ON public.lessons FOR SELECT
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can create lessons"
  ON public.lessons FOR INSERT
  WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update their lessons"
  ON public.lessons FOR UPDATE
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete their lessons"
  ON public.lessons FOR DELETE
  USING (auth.uid() = tutor_id);

-- Students can view and update lessons they're assigned to
CREATE POLICY "Students can view their lessons"
  ON public.lessons FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update lesson status"
  ON public.lessons FOR UPDATE
  USING (auth.uid() = student_id);

-- Create lesson_messages table for chat
CREATE TABLE public.lesson_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lesson_messages ENABLE ROW LEVEL SECURITY;

-- Participants can view messages
CREATE POLICY "Participants can view messages"
  ON public.lesson_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons 
      WHERE id = lesson_id 
      AND (tutor_id = auth.uid() OR student_id = auth.uid())
    )
  );

-- Participants can send messages
CREATE POLICY "Participants can send messages"
  ON public.lesson_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.lessons 
      WHERE id = lesson_id 
      AND (tutor_id = auth.uid() OR student_id = auth.uid())
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;

-- Update trigger
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();