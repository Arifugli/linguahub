import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VirtualClassroom } from '@/components/classroom/VirtualClassroom';

const Classroom = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  if (!lessonId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Урок не найден</p>
      </div>
    );
  }

  return (
    <VirtualClassroom 
      lessonId={lessonId} 
      onLeave={() => navigate('/dashboard')}
    />
  );
};

export default Classroom;
