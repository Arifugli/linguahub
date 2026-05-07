import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Home, Calendar, ClipboardList, BookOpen, Search, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
  { name: 'Домашние задания', href: '/homework', icon: <ClipboardList className="h-4 w-4" />, current: true },
  { name: 'Найти репетитора', href: '/tutors', icon: <Search className="h-4 w-4" /> },
];

// Demo homework since we don't have a homework table yet
const DEMO_HOMEWORK = [
  { id: '1', title: 'Написать эссе: My Dream City', subject: 'Письмо', due: new Date(Date.now() + 2 * 86400000), status: 'pending', tutor: 'Sarah Mitchell', instructions: 'Напишите эссе 200-250 слов о городе вашей мечты. Используйте описательные прилагательные и структуру: введение, основная часть (2 абзаца), заключение.' },
  { id: '2', title: 'Speaking Part 2 — запись голоса', subject: 'Говорение', due: new Date(Date.now() - 86400000), status: 'overdue', tutor: 'Sarah Mitchell', instructions: 'Запишите 2-минутный монолог на тему "Место, которое вы хотели бы посетить". Используйте структуру IDEA-EXPLAIN-EXAMPLE-SUMMARY.' },
  { id: '3', title: 'Грамматика: Present Perfect vs Past Simple', subject: 'Грамматика', due: new Date(Date.now() + 5 * 86400000), status: 'pending', tutor: 'Sarah Mitchell', instructions: 'Выполните упражнения 1-10 на странице 45 учебника. Переведите 5 предложений с русского на английский.' },
  { id: '4', title: 'Чтение: статья BBC News + пересказ', subject: 'Чтение', due: new Date(Date.now() - 3 * 86400000), status: 'submitted', tutor: 'Sarah Mitchell', instructions: 'Прочитайте прикреплённую статью и подготовьте пересказ на 1-2 минуты.' },
];

export default function Homework() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selected, setSelected] = useState<typeof DEMO_HOMEWORK[0] | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusConfig = {
    pending: { label: 'Ожидает', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', icon: <Clock className="h-4 w-4" /> },
    overdue: { label: 'Просрочено', cls: 'bg-destructive/10 text-destructive', icon: <AlertCircle className="h-4 w-4" /> },
    submitted: { label: 'Сдано', cls: 'bg-success/10 text-success', icon: <CheckCircle2 className="h-4 w-4" /> },
    graded: { label: 'Оценено', cls: 'bg-primary/10 text-primary', icon: <CheckCircle2 className="h-4 w-4" /> },
  };

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Введите ответ'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API
    toast.success('Домашнее задание отправлено!');
    setSelected(null);
    setAnswer('');
    setSubmitting(false);
  };

  const pending = DEMO_HOMEWORK.filter(h => h.status === 'pending' || h.status === 'overdue');
  const done = DEMO_HOMEWORK.filter(h => h.status === 'submitted' || h.status === 'graded');

  return (
    <DashboardLayout title="Домашние задания" navigation={navigation}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{t('homework.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{pending.length} ожидают выполнения</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Ожидают', value: DEMO_HOMEWORK.filter(h => h.status === 'pending').length, color: 'text-amber-600' },
            { label: 'Просрочено', value: DEMO_HOMEWORK.filter(h => h.status === 'overdue').length, color: 'text-destructive' },
            { label: 'Выполнено', value: DEMO_HOMEWORK.filter(h => h.status === 'submitted' || h.status === 'graded').length, color: 'text-success' },
          ].map(s => (
            <Card key={s.label} className="rounded-2xl border-border">
              <CardContent className="p-5 text-center">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending */}
        <div>
          <h3 className="text-base font-bold mb-3">К выполнению</h3>
          <div className="space-y-3">
            {pending.map(hw => {
              const s = statusConfig[hw.status as keyof typeof statusConfig];
              return (
                <Card key={hw.id} className={`rounded-2xl border-border cursor-pointer hover:shadow-card transition-all hover:-translate-y-0.5 ${hw.status === 'overdue' ? 'border-destructive/30' : ''}`}
                  onClick={() => setSelected(hw)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${hw.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{hw.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{hw.subject} · {hw.tutor}</div>
                      <div className={`text-xs mt-1 font-medium ${hw.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {hw.status === 'overdue' ? '⚠ Просрочено: ' : 'Срок: '}
                        {format(hw.due, 'd MMMM', { locale: ru })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${s.cls}`}>
                        {s.icon}{s.label}
                      </span>
                      <Button size="sm" className="rounded-xl gradient-primary text-white border-0 font-semibold hover:opacity-90 h-8 text-xs">
                        Сдать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Done */}
        <div>
          <h3 className="text-base font-bold mb-3">Выполненные</h3>
          <div className="space-y-3">
            {done.map(hw => {
              const s = statusConfig[hw.status as keyof typeof statusConfig];
              return (
                <Card key={hw.id} className="rounded-2xl border-border opacity-70">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-success/10 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold line-through text-muted-foreground">{hw.title}</div>
                      <div className="text-xs text-muted-foreground">{hw.subject} · {hw.tutor}</div>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${s.cls}`}>
                      {s.icon}{s.label}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 rounded-xl">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Задание</div>
              <p className="text-sm">{selected?.instructions}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Ваш ответ</div>
              <Textarea placeholder="Напишите ваш ответ здесь..." value={answer} onChange={e => setAnswer(e.target.value)}
                className="min-h-32 rounded-xl resize-none" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelected(null)}>Отмена</Button>
              <Button className="flex-1 gradient-primary text-white border-0 rounded-xl font-semibold hover:opacity-90"
                onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Отправка...' : 'Сдать задание'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
