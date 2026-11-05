import { motion } from 'framer-motion';

export function ContinueButton({
  onClick,
  label = 'Continue the journey',
  ghost = false,
}: {
  onClick: () => void;
  label?: string;
  ghost?: boolean;
}) {
  return (
    <motion.button
      type="button"
      className={ghost ? 'cta cta-ghost' : 'cta'}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      {label}
      <motion.span
        aria-hidden
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        →
      </motion.span>
    </motion.button>
  );
}
