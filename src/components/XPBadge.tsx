import { motion } from 'framer-motion';
import { Award, Star, Trophy, Zap } from 'lucide-react';

interface XPBadgeProps {
  level: number;
  show: boolean;
  onComplete: () => void;
}

const XPBadge = ({ level, show, onComplete }: XPBadgeProps) => {
  const getBadgeInfo = (level: number) => {
    if (level <= 5) return { icon: Star, color: 'text-yellow-400', title: 'Beginner Badge', bg: 'bg-yellow-400/20' };
    if (level <= 10) return { icon: Zap, color: 'text-blue-400', title: 'Rising Coder', bg: 'bg-blue-400/20' };
    if (level <= 20) return { icon: Award, color: 'text-purple-400', title: 'Expert Developer', bg: 'bg-purple-400/20' };
    return { icon: Trophy, color: 'text-orange-400', title: 'Master Coder', bg: 'bg-orange-400/20' };
  };

  const badge = getBadgeInfo(level);
  const Icon = badge.icon;

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: 2,
            ease: 'easeInOut',
          }}
          className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full ${badge.bg} border-4 border-primary shadow-glow-xl`}
        >
          <Icon className={`h-16 w-16 ${badge.color}`} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-4xl font-bold text-foreground"
        >
          Level {level} Unlocked!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-primary"
        >
          {badge.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <p className="text-muted-foreground">Keep coding to unlock more badges! 🚀</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default XPBadge;
