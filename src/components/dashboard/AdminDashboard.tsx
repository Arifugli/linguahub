import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Shield,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Settings,
  FileText
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" />, current: true },
  { name: 'Пользователи', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { name: 'Модерация', href: '/admin/moderation', icon: <Shield className="h-4 w-4" /> },
  { name: 'Жалобы', href: '/admin/reports', icon: <AlertTriangle className="h-4 w-4" /> },
  { name: 'Аналитика', href: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Финансы', href: '/admin/finance', icon: <DollarSign className="h-4 w-4" /> },
  { name: 'Настройки', href: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
];

export function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout title="Панель администратора" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Админ-панель 🛡️
            </h2>
            <p className="text-muted-foreground">
              Управление платформой LinguaHub
            </p>
          </div>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Экспорт отчета
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Зарегистрировано</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных репетиторов</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Преподают на платформе</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Жалоб на рассмотрении</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Требуют внимания</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Оборот платформы</CardTitle>
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
              <CardTitle>Требуют модерации</CardTitle>
              <CardDescription>Новые регистрации и изменения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Shield className="h-12 w-12 mb-4 opacity-50" />
                <p>Нет элементов для модерации</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика платформы</CardTitle>
              <CardDescription>Ключевые метрики</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                <p>Данные появятся после начала работы</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
