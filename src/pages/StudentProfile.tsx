import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, ClipboardList, Search, User, Camera, Globe, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { LANGUAGES } from '@/i18n';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
  { name: 'Профиль', href: '/profile', icon: <User className="h-4 w-4" />, current: true },
  { name: 'Найти репетитора', href: '/tutors', icon: <Search className="h-4 w-4" /> },
];

const TIMEZONES = ['UTC+5 (Ташкент)','UTC+3 (Москва)','UTC+0 (Лондон)','UTC+1 (Берлин)','UTC-5 (Нью-Йорк)','UTC+8 (Пекин)','UTC+9 (Токио)'];
const LEVELS = ['A1 — Начинающий','A2 — Элементарный','B1 — Средний','B2 — Выше среднего','C1 — Продвинутый','C2 — Профессиональный'];
const LEARNING_GOALS = ['Разговорная практика','Подготовка к экзамену (IELTS/TOEFL)','Бизнес-английский','Путешествия','Переезд за границу','Академические цели'];

export default function StudentProfile() {
  const { t, i18n } = useTranslation();
  const { profile, user, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    timezone: profile?.timezone || 'UTC+5 (Ташкент)',
    interface_language: profile?.interface_language || 'ru',
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles')
        .update({ first_name: form.first_name, last_name: form.last_name, phone: form.phone, timezone: form.timezone, interface_language: form.interface_language, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) throw error;
      if (form.interface_language !== i18n.language) i18n.changeLanguage(form.interface_language);
      await refreshProfile();
      toast.success('Профиль обновлён!');
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}` || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <DashboardLayout title={t('profile.title')} navigation={navigation}>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
          {!editing ? (
            <Button onClick={() => setEditing(true)} variant="outline" className="rounded-xl gap-2">
              <User className="h-4 w-4" />{t('profile.editProfile')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setEditing(false)}>{t('profile.cancel')}</Button>
              <Button className="gradient-primary text-white border-0 rounded-xl font-semibold hover:opacity-90" onClick={handleSave} disabled={saving}>
                {saving ? 'Сохранение...' : t('profile.save')}
              </Button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Card className="rounded-2xl border-border">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 rounded-2xl">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="rounded-2xl gradient-primary text-white text-2xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white hover:opacity-80">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div>
              <div className="text-lg font-bold">{profile?.first_name} {profile?.last_name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Globe className="h-3 w-3" />{profile?.timezone || 'UTC+5'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Личные данные</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t('auth.firstName')}</Label>
                <Input value={editing ? form.first_name : (profile?.first_name || '')}
                  onChange={e => setForm(f => ({...f, first_name: e.target.value}))}
                  disabled={!editing} className="rounded-xl" placeholder="Имя" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t('auth.lastName')}</Label>
                <Input value={editing ? form.last_name : (profile?.last_name || '')}
                  onChange={e => setForm(f => ({...f, last_name: e.target.value}))}
                  disabled={!editing} className="rounded-xl" placeholder="Фамилия" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Email</Label>
              <Input value={user?.email || ''} disabled className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Телефон</Label>
              <Input value={editing ? form.phone : (profile?.phone || '')}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                disabled={!editing} className="rounded-xl" placeholder="+998 90 000 00 00" />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Настройки</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">{t('profile.timezone')}</Label>
              <Select value={editing ? form.timezone : (profile?.timezone || '')}
                onValueChange={v => setForm(f => ({...f, timezone: v}))} disabled={!editing}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">{t('profile.language')}</Label>
              <Select value={editing ? form.interface_language : (profile?.interface_language || 'ru')}
                onValueChange={v => setForm(f => ({...f, interface_language: v}))} disabled={!editing}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {LANGUAGES.map(l => <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
