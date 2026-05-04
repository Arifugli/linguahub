import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  BookOpen,
  BarChart3,
  DollarSign,
  UserPlus,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Преподаватели', href: '/teachers', icon: <Users className="h-4 w-4" /> },
  { name: 'Ученики', href: '/school-students', icon: <UserPlus className="h-4 w-4" /> },
  { name: 'Курсы', href: '/school-courses', icon: <BookOpen className="h-4 w-4" /> },
  { name: 'Аналитика', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Финансы', href: '/finance', icon: <DollarSign className="h-4 w-4" /> },
];

export function SchoolDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout title="Панель управления школой" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Добро пожаловать! 👋
            </h2>
            <p className="text-muted-foreground">
              Управляйте своей языковой школой
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Добавить преподавателя
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Преподавателей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">В вашей школе</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных учеников</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Обучаются сейчас</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Курсов</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Активных программ</p>
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
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Настройка школы</CardTitle>
              <CardDescription>Заполните информацию о вашей школе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Добавьте логотип школы</span>
                </div>
                <Button size="sm" variant="outline">Добавить</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Создайте каталог курсов</span>
                </div>
                <Button size="sm" variant="outline">Создать</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Пригласите преподавателей</span>
                </div>
                <Button size="sm" variant="outline">Пригласить</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
              <CardDescription>Обзор активности школы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                <p>Статистика появится после начала работы</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
