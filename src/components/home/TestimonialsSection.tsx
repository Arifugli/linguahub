import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Екатерина М.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    role: "Ученица",
    language: "Английский",
    rating: 5,
    text: "Благодаря LinguaHub я наконец заговорила на английском! Мой репетитор подстроил программу под мои цели, и уже через 3 месяца я прошла собеседование в международную компанию.",
  },
  {
    name: "Алексей В.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    role: "Репетитор",
    language: "Французский",
    rating: 5,
    text: "Платформа дает мне возможность работать с учениками из разных стран. Удобный календарь, автоматические напоминания и безопасные выплаты — всё, что нужно для комфортной работы.",
  },
  {
    name: "Ольга С.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    role: "Ученица",
    language: "Испанский",
    rating: 5,
    text: "Очень удобно заниматься онлайн! Интерактивная доска и возможность записи уроков помогают мне повторять материал. Рекомендую всем, кто хочет учить языки эффективно.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            Отзывы наших пользователей
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Узнайте, что говорят ученики и репетиторы о LinguaHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-6 rounded-2xl bg-background border border-border hover:shadow-card transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-primary/10" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} · {testimonial.language}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
