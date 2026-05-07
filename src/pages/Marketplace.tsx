import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Search, Star, Video, SlidersHorizontal, BadgeCheck, Heart, Globe } from 'lucide-react';

const LANGUAGES_LIST = ['Английский','Испанский','Французский','Немецкий','Китайский','Японский','Итальянский','Португальский','Арабский','Корейский'];
const LEVELS = ['A1','A2','B1','B2','C1','C2'];
const PRICE_RANGES = [
  { label: 'до $15', max: 15 },
  { label: '$15–$25', min: 15, max: 25 },
  { label: '$25–$40', min: 25, max: 40 },
  { label: '$40+', min: 40 },
];

// Demo tutors (will be replaced with Supabase data once profiles exist)
const DEMO_TUTORS = [
  { id: '1', name: 'Sarah Mitchell', country: 'США', flag: '🇺🇸', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', languages: ['Английский'], specialties: ['IELTS','Бизнес','Разговорный'], rating: 5.0, reviews: 312, price: 18, trialPrice: 9, lessons: 4820, online: true, pro: true, about: 'CELTA сертифицированный преподаватель с 7 годами опыта. Специализируюсь на подготовке к IELTS и деловом английском.' },
  { id: '2', name: 'Carlos Vargas', country: 'Мексика', flag: '🇲🇽', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', languages: ['Испанский'], specialties: ['Разговорный','DELE'], rating: 4.9, reviews: 187, price: 14, trialPrice: 7, lessons: 2310, online: true, pro: false, about: 'Носитель языка из Мехико. Помогу вам заговорить по-испански свободно за 3 месяца.' },
  { id: '3', name: 'Marie Dupont', country: 'Франция', flag: '🇫🇷', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', languages: ['Французский'], specialties: ['DELF','DALF'], rating: 4.8, reviews: 94, price: 22, trialPrice: 11, lessons: 1540, online: false, pro: true, about: 'Преподаю французский язык онлайн уже 5 лет. Подготовлю к DELF и DALF любого уровня.' },
  { id: '4', name: 'Takeshi Yamada', country: 'Япония', flag: '🇯🇵', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', languages: ['Японский'], specialties: ['JLPT','Аниме'], rating: 4.9, reviews: 73, price: 20, trialPrice: 10, lessons: 890, online: true, pro: false, about: 'Носитель языка. Обучаю японскому от нуля до N2. Знаю как сделать обучение интересным.' },
  { id: '5', name: 'Anna Berliner', country: 'Германия', flag: '🇩🇪', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', languages: ['Немецкий'], specialties: ['TestDaF','Грамматика'], rating: 5.0, reviews: 221, price: 19, trialPrice: 9, lessons: 3120, online: true, pro: true, about: 'Сертифицированный преподаватель немецкого. Работаю со студентами с A1 до C2.' },
  { id: '6', name: 'Li Wei', country: 'Китай', flag: '🇨🇳', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', languages: ['Китайский'], specialties: ['HSK','Мандаринский'], rating: 4.7, reviews: 56, price: 16, trialPrice: 8, lessons: 720, online: false, pro: false, about: 'Преподаю китайский язык онлайн. Специализируюсь на подготовке к экзамену HSK.' },
];

export default function Marketplace() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filtered = DEMO_TUTORS.filter(tutor => {
    if (search && !tutor.name.toLowerCase().includes(search.toLowerCase()) &&
        !tutor.languages.some(l => l.toLowerCase().includes(search.toLowerCase()))) return false;
    if (selectedLang !== 'all' && !tutor.languages.includes(selectedLang)) return false;
    if (onlineOnly && !tutor.online) return false;
    return true;
  });

  const toggleLike = (id: string) => {
    setLiked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero search bar */}
        <div className="bg-card border-b border-border py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">{t('marketplace.title')}</h1>
            <p className="text-muted-foreground mb-6">{DEMO_TUTORS.length}+ {t('marketplace.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('hero.searchPlaceholder')} value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-11 rounded-xl" />
              </div>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger className="h-11 rounded-xl w-full sm:w-48">
                  <SelectValue placeholder={t('marketplace.allLanguages')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">{t('marketplace.allLanguages')}</SelectItem>
                  {LANGUAGES_LIST.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant={onlineOnly ? 'default' : 'outline'} className="h-11 rounded-xl gap-2"
                onClick={() => setOnlineOnly(!onlineOnly)}>
                <div className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-white' : 'bg-success'}`} />
                {t('common.online')}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(tutor => (
              <Card key={tutor.id} className="tutor-card overflow-visible group">
                <CardContent className="p-0">
                  {/* Top badges */}
                  <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                    {tutor.pro && (
                      <Badge className="gradient-primary text-white text-[10px] border-0 gap-1">
                        <BadgeCheck className="h-2.5 w-2.5" />Pro
                      </Badge>
                    )}
                    <button onClick={() => toggleLike(tutor.id)}
                      className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 transition-transform">
                      <Heart className={`h-3.5 w-3.5 ${liked.has(tutor.id) ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="p-5 pb-3 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-3">
                      <img src={tutor.avatar} alt={tutor.name}
                        className="w-full h-full rounded-2xl object-cover ring-2 ring-border" />
                      {tutor.online && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <h3 className="text-base font-bold text-center">{tutor.name} {tutor.flag}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Globe className="h-3 w-3" />{tutor.country}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-5 pb-2 flex flex-wrap justify-center gap-1">
                    {tutor.languages.map(l => (
                      <span key={l} className="pill bg-primary/10 text-primary text-[11px]">{l}</span>
                    ))}
                    {tutor.specialties.slice(0, 2).map(s => (
                      <span key={s} className="pill bg-accent/10 text-accent text-[11px]">{s}</span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="px-5 pb-2 flex items-center justify-center gap-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`h-3 w-3 ${i <= Math.floor(tutor.rating) ? 'fill-warning text-warning' : 'fill-muted text-muted'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold">{tutor.rating}</span>
                    <span className="text-xs text-muted-foreground">({tutor.reviews})</span>
                  </div>

                  {/* Lessons */}
                  <div className="px-5 pb-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Video className="h-3 w-3" />
                    {tutor.lessons.toLocaleString()} {t('marketplace.lessons')}
                  </div>

                  {/* About */}
                  <div className="px-5 pb-3">
                    <p className="text-xs text-muted-foreground text-center line-clamp-2">{tutor.about}</p>
                  </div>

                  {/* Price & CTA */}
                  <div className="px-5 pb-5 pt-3 border-t border-border">
                    {tutor.trialPrice && (
                      <div className="text-center text-xs text-muted-foreground mb-2">
                        Пробный урок — <span className="font-bold text-success">${tutor.trialPrice}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold">${tutor.price}</span>
                        <span className="text-xs text-muted-foreground"> {t('common.perLesson')}</span>
                      </div>
                      <Button size="sm" className="gradient-primary text-white border-0 rounded-xl font-semibold hover:opacity-90" asChild>
                        <Link to={`/tutors/${tutor.id}`}>{t('marketplace.book')}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Репетиторы не найдены. Попробуйте изменить фильтры.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
