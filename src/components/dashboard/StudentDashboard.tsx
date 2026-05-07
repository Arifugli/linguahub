import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Home, Calendar, BookOpen, ClipboardList, Search, Trophy, Clock, TrendingUp, Star, ArrowRight, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Домашние задания', href: '/homework', icon: <ClipboardList className="h-4 w-4" /> },
  { name: 'Найти репетитора', href: '/tutors', icon: <Search className="h-4 w-4" /> },
];

const skills = [
  { name: 'Speaking', value: 72, color: 'bg-blue-500' },
  { name: 'Listening', value: 85, color: 'bg-violet-500' },
  { name: 'Reading', value: 91, color: 'bg-emerald-500' },
  { name: 'Writing', value: 58, color: 'bg-orange-500' },
  { name: 'Grammar', value: 66, color: 'bg-rose-500' },
];

const demoHomework = [
  { title: 'Написать эссе: My Dream City', subject: '✍️ Письмо', due: 'через 2 дня', overdue: false },
  { title: 'Аудирование — Урок 12', subject: '🎧 Аудио', due: 'Вчера', overdue: true },
];

export function StudentDashboard() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('lessons').select('*').eq('student_id', user.id)
      .order('scheduled_at', { ascending: true }).limit(5)
      .then(({ data }) => { setLessons(data || []); setLoading(false); });
  }, [user]);

  const upcoming = lessons.filter(l => l.status === 'scheduled' && new Date(l.scheduled_at) > new Date());
  const completed = lessons.filter(l => l.status === 'completed');

  return (
    <DashboardLayout title={t('dashboard.overview')} navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.welcome')}, {profile?.first_name || t('dashboard.findTutor')}! 👋</h2>
            <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long' })}</p>
          </div>
          <Button className="gradient-primary text-white border-0 rounded-xl gap-2 font-semibold hover:opacity-90 self-start" asChild>
            <Link to="/tutors"><Search className="h-4 w-4" />{t('dashboard.findTutor')}</Link>
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('dashboard.lessonsCompleted'), value: completed.length || '0', delta: 'Начните обучение!', icon: Trophy, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            { label: t('dashboard.hoursLearned'), value: `${Math.round((completed.length * 60)/60)}ч`, delta: 'Всего времени', icon: Clock, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
            { label: t('dashboard.homework_pending'), value: demoHomework.length, delta: '1 просрочено', icon: ClipboardList, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
            { label: t('dashboard.progress'), value: 'B1', delta: '42% до B2', icon: TrendingUp, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
          ].map(item => (
            <Card key={item.label} className="border-border rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs mt-1.5 text-muted-foreground">{item.delta}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${item.color}`}><item.icon className="h-4 w-4" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Lessons */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">{t('dashboard.upcomingLessons')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 rounded-lg h-7" asChild>
                    <Link to="/tutors">Найти репетитора <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                ) : upcoming.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">{t('dashboard.noLessons')}</p>
                    <Button variant="link" className="mt-1 text-primary text-sm" asChild>
                      <Link to="/tutors">{t('dashboard.findTutor')}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {upcoming.map(l => (
                      <div key={l.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer"
                        onClick={() => window.location.href=`/classroom/${l.id}`}>
                        <div className="w-12 text-center py-1.5 rounded-lg gradient-primary text-white text-xs font-bold shrink-0">
                          <div>{format(new Date(l.scheduled_at), 'HH:mm')}</div>
                          <div className="font-normal opacity-75">{format(new Date(l.scheduled_at), 'd MMM', { locale: ru })}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{l.title}</div>
                          <div className="text-xs text-muted-foreground">{l.duration_minutes} мин</div>
                        </div>
                        <Button size="sm" className="gradient-primary text-white border-0 rounded-lg h-7 text-xs font-semibold hover:opacity-90 shrink-0">
                          {t('dashboard.startLesson')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">{t('dashboard.progress')} по навыкам</CardTitle></CardHeader>
              <CardContent className="space-y-3.5">
                {skills.map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{s.name}</span>
                      <span className="font-bold">{s.value}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Homework */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">{t('homework.title')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 rounded-lg h-7" asChild>
                    <Link to="/homework">Все <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {demoHomework.map((hw, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border ${hw.overdue ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/30'}`}>
                    <div className="flex items-start gap-2">
                      {hw.overdue ? <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> : <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground mb-0.5">{hw.subject}</div>
                        <div className="text-sm font-medium leading-snug">{hw.title}</div>
                        <div className={`text-xs mt-1 font-medium ${hw.overdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {hw.overdue ? '⚠ ' : ''}{t('homework.due')}: {hw.due}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="mt-2.5 w-full h-7 text-xs rounded-lg gradient-primary text-white border-0 font-semibold hover:opacity-90" asChild>
                      <Link to="/homework">{t('homework.submit')}</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Level */}
            <Card className="border-border rounded-2xl overflow-hidden">
              <div className="gradient-primary p-5">
                <div className="text-white/70 text-xs font-semibold mb-1">Текущий уровень</div>
                <div className="text-white text-3xl font-bold mb-1">B1</div>
                <div className="text-white/80 text-sm">Intermediate</div>
              </div>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-2">До B2 осталось</div>
                <Progress value={42} className="h-1.5 mb-2" />
                <div className="text-xs font-semibold">42% пути пройдено</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
