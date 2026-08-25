import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, ShoppingBag, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface FloatingCTAProps {
  onGoToPlans: () => void;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ onGoToPlans }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <p className="text-[11px] font-black text-rose-600 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-rose-600" />
                Acesso VIP Imediato
              </p>
              <p className="text-xs font-extrabold text-zinc-900">
                Apenas <span className="text-pink-600">R$ 19,90</span>
              </p>
            </div>

            <button
              onClick={onGoToPlans}
              className="flex-1 max-w-[200px] py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-1.5 transition-transform"
            >
              <span>ASSINAR AGORA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
