import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TutorCard from "./TutorCard";

const tutors = [
  {
    name: "Анна Смирнова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    languages: ["Английский", "Немецкий"],
    rating: 4.9,
    reviews: 234,
    price: 25,
    lessons: 1250,
    isOnline: true,
  },
  {
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    languages: ["Китайский", "Английский"],
    rating: 5.0,
    reviews: 187,
    price: 30,
    lessons: 890,
    isOnline: true,
  },
  {
    name: "Maria García",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    languages: ["Испанский", "Французский"],
    rating: 4.8,
    reviews: 312,
    price: 22,
    lessons: 1680,
    isOnline: false,
  },
  {
    name: "Yuki Tanaka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    languages: ["Японский"],
    rating: 4.9,
    reviews: 156,
    price: 28,
    lessons: 720,
    isOnline: true,
  },
];

const TutorsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Лучшие репетиторы
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Проверенные преподаватели с высокими рейтингами и положительными отзывами
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 gap-2">
            Смотреть всех
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.name} {...tutor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorsSection;
