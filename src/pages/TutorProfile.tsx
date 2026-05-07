import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Video, Globe, BadgeCheck, Clock, Calendar, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';

// In real app this would fetch from Supabase
const TUTOR = {
  id: '1', name: 'Sarah Mitchell', country: 'США', flag: '🇺🇸',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  languages: ['Английский'], specialties: ['IELTS','Бизнес-английский','Разговорный','Академическое письмо'],
  rating: 5.0, reviews: 312, price: 18, trialPrice: 9, lessons: 4820, online: true, pro: true,
  about: 'CELTA сертифицированный преподаватель с 7 годами опыта преподавания английского языка. Работала с учениками из более чем 30 стран мира. Специализируюсь на подготовке к IELTS, деловом английском и разговорной практике. Мои ученики в среднем улучшают свой уровень на 1-2 ступени за 6 месяцев.',
  education: 'Университет Манчестера, Лингвистика, MA',
  certificates: ['CELTA (Cambridge)', 'IELTS Examiner', 'DELTA (в процессе)'],
  experience: '7 лет',
  languages_spoken: ['Английский (носитель)', 'Испанский (B2)', 'Французский (A2)'],
  availability: ['Понедельник—Пятница: 09:00—20:00', 'Суббота: 10:00—16:00'],
  responseTime: '< 1 часа',
  reviews_list: [
    { name: 'Аяша Р.', avatar: 'А', date: 'Март 2026', rating: 5, text: 'Фантастический преподаватель! За 6 месяцев я прошла путь от B1 до C1 и успешно сдала IELTS 7.5. Очень рекомендую.' },
    { name: 'Давид К.', avatar: 'Д', date: 'Февраль 2026', rating: 5, text: 'Сара очень профессиональна и терпелива. Объясняет грамматику понятно и с примерами из реальной жизни.' },
    { name: 'Мария В.', avatar: 'М', date: 'Январь 2026', rating: 5, text: 'Лучший преподаватель, с которым я занималась. Занятия интересные и продуктивные. Уже записалась на следующий месяц!' },
  ],
};

export default function TutorProfile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Назад к поиску
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left — Profile card */}
            <div className="space-y-5">
              <Card className="rounded-2xl border-border overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto w-28 h-28 mb-4">
                    <img src={TUTOR.avatar} alt={TUTOR.name} className="w-full h-full rounded-2xl object-cover ring-2 ring-border" />
                    {TUTOR.online && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card" />}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h1 className="text-xl font-bold">{TUTOR.name}</h1>
                    {TUTOR.pro && <BadgeCheck className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                    <Globe className="h-3.5 w-3.5" />{TUTOR.country} {TUTOR.flag}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                    </div>
                    <span className="font-bold">{TUTOR.rating}</span>
                    <span className="text-sm text-muted-foreground">({TUTOR.reviews})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-5 text-center">
                    <div className="p-3 bg-muted/40 rounded-xl">
                      <div className="text-lg font-bold">{TUTOR.lessons.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">уроков</div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl">
                      <div className="text-lg font-bold">{TUTOR.experience}</div>
                      <div className="text-xs text-muted-foreground">опыт</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">Пробный урок</div>
                  <div className="text-2xl font-bold text-success mb-1">${TUTOR.trialPrice}</div>
                  <div className="text-xs text-muted-foreground mb-4">Обычная цена: ${TUTOR.price}/урок</div>
                  <Button className="w-full gradient-primary text-white border-0 rounded-xl font-semibold hover:opacity-90 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />Записаться на урок
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    <MessageSquare className="h-4 w-4 mr-2" />Написать сообщение
                  </Button>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Расписание</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {TUTOR.availability.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{slot}</span>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">
                    Ответ в течение: <span className="font-semibold text-success">{TUTOR.responseTime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-2 space-y-5">
              {/* About */}
              <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3"><CardTitle className="text-base font-bold">О преподавателе</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{TUTOR.about}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {TUTOR.specialties.map(s => (
                      <Badge key={s} variant="secondary" className="rounded-lg">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education & Certs */}
              <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Образование и сертификаты</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm"><span className="font-medium">Образование:</span> <span className="text-muted-foreground">{TUTOR.education}</span></div>
                  <div>
                    <div className="text-sm font-medium mb-2">Сертификаты:</div>
                    <div className="space-y-1.5">
                      {TUTOR.certificates.map(c => (
                        <div key={c} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Владею языками:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {TUTOR.languages_spoken.map(l => (
                        <span key={l} className="pill bg-muted text-muted-foreground text-xs">{l}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    Отзывы <span className="text-muted-foreground font-normal text-sm">({TUTOR.reviews})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {TUTOR.reviews_list.map((r, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                        {r.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= r.rating ? 'fill-warning text-warning' : 'fill-muted text-muted'}`} />)}
                        </div>
                        <p className="text-sm text-muted-foreground">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
