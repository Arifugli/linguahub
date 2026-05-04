import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-16 text-center">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Присоединяйтесь к 100 000+ пользователей
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 font-serif">
              Начните свой путь к свободному владению языком
            </h2>

            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Зарегистрируйтесь бесплатно и получите скидку 50% на первый урок с любым репетитором
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="heroOutline"
                size="xl"
                className="gap-2 bg-white text-primary hover:bg-white/90"
              >
                Начать обучение
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="xl"
                className="text-primary-foreground hover:bg-white/10"
              >
                Стать репетитором
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
