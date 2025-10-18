import { Button } from '@/components/ui/button';
import MatrixBackground from '@/components/MatrixBackground';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import StatCard from '@/components/StatCard';
import { Shield, Users, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <MatrixBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="animate-fade-in">
          <h1 className="mb-6 bg-gradient-primary bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
            Where verified coders
            <br />
            connect, collaborate, and create
            <br />
            <span className="text-foreground">— together.</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join the most trusted platform for verified developers. Build your network, 
            sharpen your skills, and collaborate in real-time with fellow coders.
          </p>

          <Link to="/auth?mode=signup">
            <Button size="lg" className="animate-glow-pulse shadow-glow-lg">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <StatCard value="10K+" label="Verified Devs" />
          <StatCard value="5K+" label="Projects" />
          <StatCard value="24/7" label="Support" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
          Powerful Features
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Verified Registration"
            description="Only verified developers join. Upload your certificates and GitHub proof to get authenticated."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Professional Networking"
            description="Connect with coders at similar skill levels. Build meaningful relationships in the dev community."
          />
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="Real-time Collaboration"
            description="Work together on projects with live code editing. Sync with teammates in real-time."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card/50 p-12 backdrop-blur-sm">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to join the community?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Start your journey with verified coders today
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="shadow-glow-md">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Codifyr.co - Where verified coders connect
        </div>
      </footer>
    </div>
  );
};

export default Index;
