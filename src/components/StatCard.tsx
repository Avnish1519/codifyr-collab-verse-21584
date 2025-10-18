import { Card } from '@/components/ui/card';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <Card className="border-border bg-card/30 p-6 text-center backdrop-blur-sm">
      <div className="mb-2 bg-gradient-primary bg-clip-text text-4xl font-bold text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
};

export default StatCard;
