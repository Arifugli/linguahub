import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus, Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { LessonCalendar } from '@/components/schedule/LessonCalendar';
import { CreateLessonDialog } from '@/components/schedule/CreateLessonDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navigation = [
  { name: 'Обзор', href: '/dashboard', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'Расписание', href: '/schedule', icon: <Calendar className="h-4 w-4" />, current: true },
  { name: 'Мои ученики', href: '/students', icon: <Users className="h-4 w-4" /> },
];

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  student_id: string | null;
  student_name?: string;
}

export default function Schedule() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchLessons = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const start = startOfMonth(addMonths(new Date(), -1));
      const end = endOfMonth(addMonths(new Date(), 2));

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('tutor_id', user.id)
        .gte('scheduled_at', start.toISOString())
        .lte('scheduled_at', end.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Fetch student names for lessons with students
      const lessonsWithStudents = await Promise.all(
        (data || []).map(async (lesson) => {
          if (lesson.student_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('user_id', lesson.student_id)
              .maybeSingle();

            return {
              ...lesson,
              student_name: profile 
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                : undefined,
            };
          }
          return lesson;
        })
      );

      setLessons(lessonsWithStudents);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Ошибка загрузки занятий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [user]);

  const upcomingLessons = lessons
    .filter(l => l.status === 'scheduled' && new Date(l.scheduled_at) > new Date())
    .slice(0, 5);

  const todayLessons = lessons.filter(l => {
    const lessonDate = new Date(l.scheduled_at);
    const today = new Date();
    return (
      lessonDate.getDate() === today.getDate() &&
      lessonDate.getMonth() === today.getMonth() &&
      lessonDate.getFullYear() === today.getFullYear()
    );
  });

  const thisMonthLessons = lessons.filter(l => {
    const lessonDate = new Date(l.scheduled_at);
    const today = new Date();
    return (
      lessonDate.getMonth() === today.getMonth() &&
      lessonDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <DashboardLayout title="Расписание занятий" navigation={navigation}>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Управление расписанием</h2>
            <p className="text-muted-foreground">
              Планируйте и отслеживайте ваши занятия
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать занятие
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLessons.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayLessons.length === 1 ? 'занятие' : 'занятий'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">На этой неделе</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => {
                  const date = new Date(l.scheduled_at);
                  const now = new Date();
                  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return date >= now && date <= weekAhead;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">запланировано</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В этом месяце</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthLessons.length}</div>
              <p className="text-xs text-muted-foreground">всего занятий</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Проведено</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => l.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">завершённых</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Календарь</TabsTrigger>
            <TabsTrigger value="upcoming">Ближайшие</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <LessonCalendar
                lessons={lessons}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onCreateLesson={() => setCreateDialogOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Ближайшие занятия</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingLessons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Нет запланированных занятий</p>
                    <Button 
                      variant="link" 
                      onClick={() => setCreateDialogOpen(true)}
                      className="mt-2"
                    >
                      Создать первое занятие
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/classroom/${lesson.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(lesson.scheduled_at), 'd MMMM, HH:mm', { locale: ru })}
                              {' · '}
                              {lesson.duration_minutes} мин
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {lesson.student_name && (
                            <Badge variant="secondary">{lesson.student_name}</Badge>
                          )}
                          <Button size="sm">Открыть</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create lesson dialog */}
        <CreateLessonDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          selectedDate={selectedDate}
          onLessonCreated={fetchLessons}
        />
      </div>
    </DashboardLayout>
  );
}
