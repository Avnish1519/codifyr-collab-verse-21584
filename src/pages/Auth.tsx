import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MatrixBackground from '@/components/MatrixBackground';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Validate signup data
        const result = signupSchema.safeParse({ fullName, email, password });
        if (!result.success) {
          toast({
            title: 'Validation Error',
            description: result.error.errors[0].message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/verification-upload`,
          },
        });

        if (error) throw error;

        toast({
          title: 'Check your email!',
          description: 'We sent you a verification link. Please check your inbox.',
        });
        
        // Store email for potential resend
        sessionStorage.setItem('pending_verification_email', email);
      } else {
        // Validate login data
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          toast({
            title: 'Validation Error',
            description: result.error.errors[0].message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast({
              title: 'Email not verified',
              description: 'Please check your email and verify your account.',
              variant: 'destructive',
            });
          } else if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Invalid credentials',
              description: 'Email or password is incorrect.',
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          setLoading(false);
          return;
        }

        toast({
          title: 'Welcome back!',
          description: 'Signed in successfully.',
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    const emailResult = z.string().email().safeParse(resetEmail);
    if (!emailResult.success) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: 'Check your email',
        description: 'Password reset link sent successfully',
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const pendingEmail = sessionStorage.getItem('pending_verification_email') || email;
    if (!pendingEmail) {
      toast({
        title: 'Error',
        description: 'No email found for resend',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });

      if (error) throw error;

      toast({
        title: 'Email sent',
        description: 'Verification email has been resent',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <MatrixBackground />
      
      <Card className="w-full max-w-md border-border bg-card/80 p-8 backdrop-blur-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
              Codifyr.co
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSignup ? 'Join the verified coder community' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignup}
                className="bg-input"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full shadow-glow-md"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        {!isSignup && !showForgotPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {showForgotPassword && (
          <div className="mt-6 space-y-4 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="bg-input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleForgotPassword}
                className="flex-1 shadow-glow-sm"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                onClick={() => setShowForgotPassword(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isSignup && (
          <div className="mt-4 text-center">
            <button
              onClick={handleResendVerification}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setShowForgotPassword(false);
            }}
            className="font-medium text-primary hover:underline"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
