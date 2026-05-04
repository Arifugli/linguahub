import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Как это работает", href: "/how-it-works" },
    { label: "Найти репетитора", href: "/tutors" },
    { label: "Языковые школы", href: "/schools" },
    { label: "Стать репетитором", href: "/become-tutor" },
    { label: "Для бизнеса", href: "/business" },
  ],
  languages: [
    { label: "Английский", href: "/languages/english" },
    { label: "Испанский", href: "/languages/spanish" },
    { label: "Французский", href: "/languages/french" },
    { label: "Немецкий", href: "/languages/german" },
    { label: "Китайский", href: "/languages/chinese" },
  ],
  support: [
    { label: "Справочный центр", href: "/help" },
    { label: "Связаться с нами", href: "/contact" },
    { label: "Безопасность", href: "/security" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Условия использования", href: "/terms" },
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LinguaHub</span>
            </Link>
            <p className="text-background/60 text-sm mb-6">
              Платформа для изучения языков с лучшими репетиторами со всего мира.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Платформа</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold mb-4">Языки</h4>
            <ul className="space-y-3">
              {footerLinks.languages.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Документы</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © 2024 LinguaHub. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-background/60">🌍 Русский</span>
            <span className="text-sm text-background/60">$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
