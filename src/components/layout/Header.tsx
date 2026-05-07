import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, GraduationCap, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: t('nav.findTutor'), href: '/tutors' },
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: t('nav.becomeTutor'), href: '/auth?role=tutor' },
  ];

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Lingua<span className="text-gradient">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            {loading ? (
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-xl p-0">
                    <Avatar className="h-8 w-8 rounded-xl">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="rounded-xl gradient-primary text-white text-xs font-bold">
                        {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
                  <DropdownMenuLabel className="px-2 py-2">
                    <div className="font-semibold text-sm">{profile?.first_name} {profile?.last_name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/dashboard"><User className="mr-2 h-4 w-4" />{t('dashboard.overview')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/profile"><Settings className="mr-2 h-4 w-4" />{t('dashboard.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-xl cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />{t('dashboard.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="rounded-xl font-medium" asChild>
                  <Link to="/auth">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="gradient-accent text-white border-0 rounded-xl font-semibold hover:opacity-90" asChild>
                  <Link to="/auth">{t('nav.signup')}</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-muted" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <LanguageSwitcher />
                {user ? (
                  <Button variant="ghost" size="sm" className="flex-1 rounded-xl text-destructive" onClick={handleSignOut}>
                    {t('dashboard.logout')}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" asChild>
                      <Link to="/auth">{t('nav.login')}</Link>
                    </Button>
                    <Button size="sm" className="flex-1 gradient-accent text-white border-0 rounded-xl font-semibold" asChild>
                      <Link to="/auth">{t('nav.signup')}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
