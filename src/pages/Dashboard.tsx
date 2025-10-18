import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { LogOut, Home, Code, MessageSquare, User as UserIcon, FolderKanban, Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  xp_score: number;
  level: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  tech_stack: string[];
  avatar_url: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user || loading) return null;

  const xpForNextLevel = profile ? profile.level * 100 : 100;
  const xpProgress = profile ? (profile.xp_score % 100) : 0;
  const xpProgressPercent = (xpProgress / xpForNextLevel) * 100;

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Code, label: 'Challenges' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: UserIcon, label: 'Profile' },
    { icon: FolderKanban, label: 'Projects' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar p-6">
        <div className="mb-8">
          <h1 className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
            Codifyr
          </h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                item.active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-glow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || 'Coder'}!</h2>
              <p className="mt-2 text-muted-foreground">{user.email}</p>
            </div>
            <Badge 
              variant={profile?.verification_status === 'approved' ? 'default' : 'secondary'}
              className="shadow-glow-sm"
            >
              {profile?.verification_status === 'approved' ? '✓ Verified' : '⏳ Pending Verification'}
            </Badge>
          </div>
        </div>

        {/* XP and Level Section */}
        <div className="mb-8">
          <Card className="border-border bg-card/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Level {profile?.level || 1}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.xp_score || 0} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next Level</p>
                <p className="text-lg font-semibold text-foreground">{xpForNextLevel} XP</p>
              </div>
            </div>
            <Progress value={xpProgressPercent} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {xpProgress} / {xpForNextLevel} XP to next level
            </p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card/50 p-6 hover:shadow-glow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Daily Challenge</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Complete challenges to level up and earn XP</p>
            <Button className="w-full shadow-glow-sm">Start Challenge</Button>
          </Card>

          <Card className="border-border bg-card/50 p-6 hover:shadow-glow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Your Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Challenges Solved:</span>
                <span className="font-semibold text-foreground">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Streak:</span>
                <span className="font-semibold text-foreground">0 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rank:</span>
                <span className="font-semibold text-foreground">Beginner</span>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card/50 p-6 hover:shadow-glow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Collaboration</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Connect with verified coders at your level</p>
            <Button className="w-full" variant="outline" disabled={profile?.verification_status !== 'approved'}>
              {profile?.verification_status === 'approved' ? 'Find Partners' : 'Verify First'}
            </Button>
          </Card>
        </div>

        {profile?.verification_status !== 'approved' && (
          <div className="mt-8">
            <Card className="border-border bg-card/30 p-8 text-center border-primary/50">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Get Verified</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Upload your coding certificates or GitHub proof to get verified and unlock collaboration features!
              </p>
              <Button className="mt-6 shadow-glow-md">Upload Verification</Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
