import { Button } from "@/components/ui/button";
import { Search, Star, Users, Video } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 gradient-hero overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8 animate-fade-in">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="text-sm font-medium text-secondary-foreground">
              Более 10 000 репетиторов со всего мира
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up font-serif">
            Изучайте языки с{" "}
            <span className="text-gradient">лучшими репетиторами</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Найдите идеального преподавателя, бронируйте занятия онлайн и достигайте своих целей в изучении языков
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-2xl shadow-card">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Какой язык хотите изучать?"
                  className="w-full h-12 pl-12 pr-4 bg-transparent rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="hero" size="lg" className="sm:px-8">
                Найти репетитора
              </Button>
            </div>
          </div>

          {/* Popular Languages */}
          <div className="flex flex-wrap justify-center gap-2 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="text-sm text-muted-foreground">Популярные:</span>
            {["Английский", "Испанский", "Французский", "Немецкий", "Китайский", "Японский"].map((lang) => (
              <button
                key={lang}
                className="px-3 py-1 text-sm font-medium text-secondary-foreground bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Репетиторов</p>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Video className="h-6 w-6 text-primary mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground">50K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Уроков в день</p>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-warning fill-warning mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-foreground">4.9</span>
              </div>
              <p className="text-sm text-muted-foreground">Средняя оценка</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">150+</div>
              <p className="text-sm text-muted-foreground">Стран</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
