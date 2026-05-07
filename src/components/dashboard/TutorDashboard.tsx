import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Users, BookOpen, DollarSign, TrendingUp, Star, ArrowRight, Video, Plus, BarChart3, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Расписание', href: '/schedule', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Профиль', href: '/profile', icon: <Users className="h-4 w-4" /> },
];

export function TutorDashboard() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    supabase.from('lessons').select('*').eq('tutor_id', user.id)
      .gte('scheduled_at', start).lte('scheduled_at', end)
      .order('scheduled_at', { ascending: true })
      .then(({ data }) => { setLessons(data || []); setLoading(false); });
  }, [user]);

  const today = lessons.filter(l => {
    const d = new Date(l.scheduled_at); const n = new Date();
    return d.toDateString() === n.toDateString();
  });
  const upcoming = lessons.filter(l => l.status === 'scheduled' && new Date(l.scheduled_at) > new Date());
  const completed = lessons.filter(l => l.status === 'completed');

  const handleJoin = (lessonId: string) => navigate(`/classroom/${lessonId}`);

  return (
    <DashboardLayout title="Кабинет репетитора" navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.welcome')}, {profile?.first_name || 'Репетитор'}! 👋</h2>
            <p className="text-sm text-muted-foreground mt-1">Сегодня {today.length} занятий</p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button variant="outline" className="rounded-xl gap-2 font-semibold" asChild>
              <Link to="/schedule"><Plus className="h-4 w-4" />Создать урок</Link>
            </Button>
            {upcoming.length > 0 && (
              <Button className="gradient-primary text-white border-0 rounded-xl gap-2 font-semibold hover:opacity-90"
                onClick={() => handleJoin(upcoming[0].id)}>
                <Video className="h-4 w-4" />{t('dashboard.startLesson')}
              </Button>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('dashboard.activeStudents'), value: '0', delta: 'Привлеките учеников', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
            { label: t('dashboard.monthIncome'), value: '$0', delta: 'Начните проводить уроки', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: t('dashboard.monthLessons'), value: String(lessons.length), delta: `${completed.length} завершено`, icon: Calendar, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            { label: t('dashboard.rating'), value: '—', delta: 'Нет отзывов пока', icon: Star, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
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
            {/* Today's lessons */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Уроки на сегодня</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 rounded-lg h-7" asChild>
                    <Link to="/schedule">Расписание <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                ) : today.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">{t('dashboard.noLessons')}</p>
                    <Button variant="link" className="mt-1 text-primary text-sm" asChild>
                      <Link to="/schedule">Создать занятие</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {today.map(l => {
                      const isSoon = new Date(l.scheduled_at) <= new Date(Date.now() + 30 * 60000) && l.status === 'scheduled';
                      return (
                        <div key={l.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                            {format(new Date(l.scheduled_at), 'HH')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">{l.title}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(l.scheduled_at), 'HH:mm')} · {l.duration_minutes} мин</div>
                          </div>
                          {isSoon ? (
                            <Button size="sm" className="gradient-accent text-white border-0 rounded-lg h-7 text-xs font-semibold hover:opacity-90 shrink-0"
                              onClick={() => handleJoin(l.id)}>Войти</Button>
                          ) : (
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${l.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                              {l.status === 'completed' ? '✓ Завершён' : 'Запланирован'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Быстрые действия</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Создать урок', icon: '📅', href: '/schedule' },
                    { label: 'Редактировать профиль', icon: '👤', href: '/profile' },
                    { label: 'Посмотреть маркетплейс', icon: '🔍', href: '/tutors' },
                    { label: 'Моё расписание', icon: '📋', href: '/schedule' },
                  ].map(a => (
                    <Link key={a.label} to={a.href}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl border border-border bg-background text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                      <span className="text-base">{a.icon}</span>{a.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming */}
          <div className="space-y-5">
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Ближайшие уроки</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {upcoming.slice(0, 4).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Нет запланированных уроков</p>
                ) : upcoming.slice(0, 4).map(l => (
                  <div key={l.id} className="flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={() => handleJoin(l.id)}>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {format(new Date(l.scheduled_at), 'd')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(l.scheduled_at), 'HH:mm, d MMM', { locale: ru })}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold mt-1" asChild>
                  <Link to="/schedule">Управлять расписанием <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile completion */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Заполните профиль</CardTitle></CardHeader>
              <CardContent className="space-y-2.5">
                {[
                  { label: 'Добавить фото', done: !!profile?.avatar_url },
                  { label: 'Указать языки', done: false },
                  { label: 'Установить цену', done: false },
                  { label: 'Написать о себе', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                      {item.done ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.label}</span>
                  </div>
                ))}
                <Button size="sm" className="w-full mt-2 rounded-xl gradient-primary text-white border-0 font-semibold hover:opacity-90" asChild>
                  <Link to="/profile">Редактировать профиль</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
