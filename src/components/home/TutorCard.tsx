import { Star, Video, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorCardProps {
  name: string;
  avatar: string;
  languages: string[];
  rating: number;
  reviews: number;
  price: number;
  lessons: number;
  isOnline?: boolean;
}

const TutorCard = ({
  name,
  avatar,
  languages,
  rating,
  reviews,
  price,
  lessons,
  isOnline = false,
}: TutorCardProps) => {
  return (
    <div className="group bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 overflow-hidden">
      {/* Header with Avatar */}
      <div className="relative p-4 pb-0">
        <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
          <Heart className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
        </button>
        <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden ring-4 ring-secondary">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
        
        {/* Languages */}
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="font-semibold text-foreground">{rating}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{reviews} отзывов</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>{lessons} уроков</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>50 мин</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-foreground">${price}</span>
            <span className="text-sm text-muted-foreground"> / урок</span>
          </div>
          <Button variant="hero" size="sm">
            Записаться
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
