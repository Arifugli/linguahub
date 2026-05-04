import { Search, CalendarCheck, Video, Award } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Найдите репетитора",
    description: "Просматривайте профили, читайте отзывы и выбирайте преподавателя по вашим критериям",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Забронируйте урок",
    description: "Выберите удобное время и забронируйте пробный или обычный урок",
  },
  {
    icon: Video,
    step: "03",
    title: "Начните обучение",
    description: "Присоединяйтесь к онлайн-уроку через наш встроенный видеокласс",
  },
  {
    icon: Award,
    step: "04",
    title: "Достигайте целей",
    description: "Отслеживайте прогресс и получайте сертификаты о достижениях",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            Как это работает
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Начните изучать язык за 4 простых шага
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/20 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl gradient-primary mb-6 shadow-glow">
                  <item.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                
                {/* Step Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-4">
                  Шаг {item.step}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
