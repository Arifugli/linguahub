import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  ClipboardList,
  Search,
  Trophy,
  Clock,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Мои занятия', href: '/lessons', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Домашние задания', href: '/homework', icon: <ClipboardList className="h-4 w-4" /> },
  { name: 'Материалы', href: '/materials', icon: <BookOpen className="h-4 w-4" /> },
  { name: 'Найти репетитора', href: '/tutors', icon: <Search className="h-4 w-4" /> },
];

export function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout title="Личный кабинет ученика" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Привет, {profile?.first_name || 'Ученик'}! 👋
            </h2>
            <p className="text-muted-foreground">
              Готовы продолжить обучение?
            </p>
          </div>
          <Button asChild>
            <a href="/tutors">Найти репетитора</a>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Занятий пройдено</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Начните обучение сегодня!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Часов обучения</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Всего за все время</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Домашних заданий</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ожидают выполнения</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A1</div>
              <Progress value={10} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ближайшие занятия</CardTitle>
              <CardDescription>Ваше расписание на эту неделю</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4 opacity-50" />
                <p>У вас пока нет запланированных занятий</p>
                <Button variant="link" className="mt-2" asChild>
                  <a href="/tutors">Найти репетитора</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Рекомендуемые репетиторы</CardTitle>
              <CardDescription>Подобраны специально для вас</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <p>Заполните профиль, чтобы получить рекомендации</p>
                <Button variant="link" className="mt-2" asChild>
                  <a href="/profile">Заполнить профиль</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
