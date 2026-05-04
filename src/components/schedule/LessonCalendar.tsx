import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Clock, User, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  student_id: string | null;
  student_name?: string;
}

interface LessonCalendarProps {
  lessons: Lesson[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onCreateLesson: () => void;
}

export function LessonCalendar({ 
  lessons, 
  selectedDate, 
  onDateSelect, 
  onCreateLesson 
}: LessonCalendarProps) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const lessonsForDate = lessons.filter(lesson => 
    isSameDay(new Date(lesson.scheduled_at), selectedDate)
  );

  const datesWithLessons = lessons.map(lesson => new Date(lesson.scheduled_at));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано';
      case 'in_progress':
        return 'Идёт';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Calendar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Календарь занятий</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prev => {
                const d = new Date(prev);
                d.setMonth(d.getMonth() - 1);
                return d;
              })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-32 text-center">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prev => {
                const d = new Date(prev);
                d.setMonth(d.getMonth() + 1);
                return d;
              })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ru}
            className="rounded-md border w-full"
            modifiers={{
              hasLesson: datesWithLessons
            }}
            modifiersClassNames={{
              hasLesson: 'bg-primary/20 font-bold'
            }}
          />
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary/20" />
              <span>Есть занятия</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected day lessons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {format(selectedDate, 'd MMMM, EEEE', { locale: ru })}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {lessonsForDate.length} {lessonsForDate.length === 1 ? 'занятие' : 'занятий'}
            </p>
          </div>
          <Button size="sm" onClick={onCreateLesson}>
            + Добавить
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {lessonsForDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Нет занятий на этот день</p>
              <Button variant="link" onClick={onCreateLesson} className="mt-2">
                Создать занятие
              </Button>
            </div>
          ) : (
            lessonsForDate
              .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/classroom/${lesson.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{lesson.title}</h4>
                    <Badge variant="outline" className={getStatusColor(lesson.status)}>
                      {getStatusLabel(lesson.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(lesson.scheduled_at), 'HH:mm')} - {lesson.duration_minutes} мин
                      </span>
                    </div>
                    {lesson.student_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{lesson.student_name}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/classroom/${lesson.id}`);
                      }}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Начать
                    </Button>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
