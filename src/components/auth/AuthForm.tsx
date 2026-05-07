import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, GraduationCap, School, Eye, EyeOff, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'register';
type AppRole = 'student' | 'tutor' | 'school';

export function AuthForm() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<AppRole>('student');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const roles = [
    { value: 'student' as AppRole, icon: GraduationCap, label: t('auth.learn'), sub: t('auth.learnSub'), gradient: 'gradient-primary' },
    { value: 'tutor' as AppRole, icon: User, label: t('auth.teach'), sub: t('auth.teachSub'), gradient: 'gradient-primary' },
    { value: 'school' as AppRole, icon: School, label: t('auth.school'), sub: t('auth.schoolSub'), gradient: 'gradient-accent' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      if (mode === 'login') { await signIn(email, password); toast({ title: t('dashboard.welcome') + '!' }); }
      else { await signUp(email, password, role, { first_name: firstName, last_name: lastName }); toast({ title: 'Аккаунт создан!' }); }
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } finally { setIsLoading(false); }
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); }
    catch (error: any) { toast({ title: t('common.error'), description: error.message, variant: 'destructive' }); }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Lingua<span className="text-gradient">Hub</span></span>
        </Link>
      </div>

      <div className="bg-card rounded-3xl border border-border p-7 shadow-lift">
        <div className="flex p-1 bg-muted rounded-2xl mb-7">
          {(['login', 'register'] as AuthMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {m === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t('auth.firstName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Иван" value={firstName} onChange={e => setFirstName(e.target.value)} className="pl-9 h-11 rounded-xl border-border" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t('auth.lastName')}</Label>
                <Input placeholder="Иванов" value={lastName} onChange={e => setLastName(e.target.value)} className="h-11 rounded-xl border-border" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-9 h-11 rounded-xl border-border" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground">{t('auth.password')}</Label>
              {mode === 'login' && <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:opacity-75">{t('auth.forgotPassword')}</Link>}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-9 pr-10 h-11 rounded-xl border-border" minLength={6} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">{t('auth.iWantTo')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => {
                  const Icon = r.icon; const active = role === r.value;
                  return (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                      <div className={`w-8 h-8 rounded-lg ${active ? r.gradient : 'bg-muted'} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`text-[11px] font-semibold leading-tight ${active ? 'text-primary' : 'text-muted-foreground'}`}>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full h-11 gradient-primary text-white border-0 rounded-xl font-semibold hover:opacity-90 gap-2 mt-1">
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}<ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="px-3 bg-card text-xs text-muted-foreground">или</span></div>
        </div>

        <Button variant="outline" className="w-full h-11 rounded-xl font-semibold border-border gap-3" onClick={handleGoogle} type="button">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('auth.googleLogin')}
        </Button>

        {mode === 'register' && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            {t('auth.agreeText')}{' '}
            <Link to="/terms" className="text-primary font-semibold hover:opacity-75">{t('auth.terms')}</Link>
            {' и '}
            <Link to="/privacy" className="text-primary font-semibold hover:opacity-75">{t('auth.privacy')}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
