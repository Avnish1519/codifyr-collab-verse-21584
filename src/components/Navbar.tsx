import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-xl font-bold text-transparent">
            Codifyr.co
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button className="shadow-glow-sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
