import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MatrixBackground from '@/components/MatrixBackground';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Code2, ArrowLeft } from 'lucide-react';

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      <MatrixBackground />
      <ParticlesBackground />
      
      <div className="relative z-10 p-8">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Coding Challenges</h1>
            <p className="text-muted-foreground">Choose a challenge to get started</p>
          </div>
        </div>

        <Card className="border-border bg-card/80 p-12 backdrop-blur-md text-center">
          <Code2 className="mx-auto h-24 w-24 text-primary mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Challenges Coming Soon
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We're preparing an amazing set of coding challenges for you. Stay tuned!
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;
