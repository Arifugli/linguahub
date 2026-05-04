import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Users, 
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Расписание', href: '/schedule', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Мои ученики', href: '/students', icon: <Users className="h-4 w-4" /> },
  { name: 'Курсы', href: '/courses', icon: <BookOpen className="h-4 w-4" /> },
  { name: 'Доходы', href: '/earnings', icon: <DollarSign className="h-4 w-4" /> },
];

export function TutorDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout title="Личный кабинет репетитора" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Добро пожаловать, {profile?.first_name || 'Репетитор'}! 👋
            </h2>
            <p className="text-muted-foreground">
              Управляйте своим расписанием и учениками
            </p>
          </div>
          <Button asChild>
            <Link to="/schedule">Настроить расписание</Link>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных учеников</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Привлеките первых учеников</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Занятий в этом месяце</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Проведено уроков</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доход</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽0</div>
              <p className="text-xs text-muted-foreground">За текущий месяц</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Нет отзывов</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ближайшие занятия</CardTitle>
              <CardDescription>Ваши запланированные уроки</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4 opacity-50" />
                <p>Нет запланированных занятий</p>
                <Button variant="link" className="mt-2" asChild>
                  <Link to="/schedule">Настроить расписание</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Заполните профиль</CardTitle>
              <CardDescription>Привлеките больше учеников</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Добавьте фото профиля</span>
                </div>
                <Button size="sm" variant="outline">Добавить</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Укажите языки и уровни</span>
                </div>
                <Button size="sm" variant="outline">Указать</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Установите цену занятия</span>
                </div>
                <Button size="sm" variant="outline">Установить</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
