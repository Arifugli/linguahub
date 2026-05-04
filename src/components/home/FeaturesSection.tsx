import { Calendar, Video, MessageSquare, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Онлайн-занятия",
    description: "Встроенный видеокласс с интерактивной доской, демонстрацией экрана и записью уроков",
  },
  {
    icon: Calendar,
    title: "Гибкое расписание",
    description: "Бронируйте занятия в удобное время с учетом вашего часового пояса",
  },
  {
    icon: MessageSquare,
    title: "Встроенный чат",
    description: "Общайтесь с преподавателем, получайте материалы и домашние задания",
  },
  {
    icon: BarChart3,
    title: "Отслеживание прогресса",
    description: "Следите за своими успехами, оценками и развитием навыков",
  },
  {
    icon: Shield,
    title: "Безопасные платежи",
    description: "Защищенные транзакции и гарантия возврата средств",
  },
  {
    icon: Globe,
    title: "Репетиторы со всего мира",
    description: "Выбирайте носителей языка или билингвальных преподавателей",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            Всё для эффективного обучения
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Современные инструменты для учеников, репетиторов и языковых школ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
