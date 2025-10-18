import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group cursor-pointer border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-glow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
};

export default FeatureCard;
