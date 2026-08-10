import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

const REDIRECT_URL = 'https://t.me/Elzadamasceno_bot';

function App() {
  const handleRedirect = () => {
    window.location.href = REDIRECT_URL;
  };

  // Generate fixed background star particles for the starry sky effect
  const stars = useMemo(() => {
    return Array.from({ length: 55 }).map((_, i) => ({
      id: i,
      top: `${(Math.random() * 100).toFixed(2)}%`,
      left: `${(Math.random() * 100).toFixed(2)}%`,
      size: Math.random() > 0.8 ? '3px' : Math.random() > 0.4 ? '2px' : '1.5px',
      opacity: (Math.random() * 0.7 + 0.2).toFixed(2),
      animationDelay: `${(Math.random() * 3).toFixed(1)}s`,
    }));
  }, []);

  return (
    <div 
      onClick={handleRedirect}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#14002c] via-[#0d001e] to-[#040008] text-white font-sans flex flex-col items-center justify-between p-6 overflow-hidden cursor-pointer select-none"
    >
      {/* Starry Sky - Fixed White Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: Number(star.opacity),
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-purple-600/10 blur-[100px] pointer-events-none z-0" />

      {/* Main Responsive Content */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center z-10 py-8 space-y-7 text-center">
        
        {/* Verification Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#270d4c]/70 border border-[#6b2aa8]/40 backdrop-blur-md shadow-lg shadow-purple-950/60"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black tracking-widest text-purple-200 uppercase">
            VERIFICAÇÃO
          </span>
        </motion.div>

        {/* Headings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Abra seu presente!
          </h1>
          <p className="text-purple-200/80 text-sm md:text-base font-normal tracking-wide">
            Toque na caixa para liberar o acesso
          </p>
        </motion.div>

        {/* Interactive 3D Gift Box Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative my-4 flex items-center justify-center group"
        >
          {/* Radial Backlight / Aura behind Gift Box */}
          <div className="absolute w-64 h-64 bg-gradient-to-r from-amber-500/30 via-pink-600/25 to-purple-600/30 rounded-full blur-3xl animate-pulse pointer-events-none" />

          {/* Pulsing 3D Gift Box SVG Graphic */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              y: [0, -6, 0]
            }}
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center drop-shadow-[0_20px_35px_rgba(230,0,70,0.4)]"
          >
            <svg
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                {/* Gradients for 3D Box look */}
                <linearGradient id="lidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="100%" stopColor="#d90429" />
                </linearGradient>

                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef233c" />
                  <stop offset="60%" stopColor="#d90429" />
                  <stop offset="100%" stopColor="#a7001e" />
                </linearGradient>

                <linearGradient id="ribbonGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffe169" />
                  <stop offset="50%" stopColor="#fad02c" />
                  <stop offset="100%" stopColor="#f39c12" />
                </linearGradient>

                <linearGradient id="ribbonGoldVert" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff099" />
                  <stop offset="50%" stopColor="#ffd000" />
                  <stop offset="100%" stopColor="#e67e22" />
                </linearGradient>

                <linearGradient id="bowRed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff758f" />
                  <stop offset="50%" stopColor="#ff2a4b" />
                  <stop offset="100%" stopColor="#c9002b" />
                </linearGradient>

                <filter id="bowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Bow Halo Glow */}
              <circle cx="160" cy="100" r="50" fill="#ffd700" opacity="0.3" filter="url(#bowGlow)" />

              {/* Top Bow - Left Loop */}
              <path
                d="M160 102 C130 65 80 65 95 98 C105 120 145 108 160 102 Z"
                fill="url(#bowRed)"
                stroke="#ffb3c1"
                strokeWidth="2"
              />

              {/* Top Bow - Right Loop */}
              <path
                d="M160 102 C190 65 240 65 225 98 C215 120 175 108 160 102 Z"
                fill="url(#bowRed)"
                stroke="#ffb3c1"
                strokeWidth="2"
              />

              {/* Bow Ribbon Tails */}
              <path d="M152 105 L130 135 L145 132 L158 112 Z" fill="#b7094c" />
              <path d="M168 105 L190 135 L175 132 L162 112 Z" fill="#b7094c" />

              {/* Bow Knot Center */}
              <ellipse cx="160" cy="102" rx="14" ry="11" fill="url(#bowRed)" stroke="#ffccd5" strokeWidth="2" />

              {/* Main Box Base */}
              <rect
                x="65"
                y="155"
                width="190"
                height="125"
                rx="20"
                fill="url(#boxGrad)"
              />

              {/* Box Highlight Overlay */}
              <path
                d="M75 160 Q160 168 245 160 L245 185 Q160 193 75 185 Z"
                fill="#ffffff"
                opacity="0.08"
              />

              {/* Vertical Gold Ribbon on Base */}
              <rect x="142" y="155" width="36" height="125" fill="url(#ribbonGoldVert)" />

              {/* Horizontal Gold Ribbon on Base */}
              <rect x="65" y="200" width="190" height="28" fill="url(#ribbonGold)" />

              {/* Box Lid (Overhanging) */}
              <rect
                x="55"
                y="125"
                width="210"
                height="38"
                rx="12"
                fill="url(#lidGrad)"
                stroke="#ff758f"
                strokeWidth="1.5"
              />

              {/* Vertical Gold Ribbon on Lid */}
              <rect x="142" y="125" width="36" height="38" fill="url(#ribbonGoldVert)" />

              {/* Lid Bottom Shadow */}
              <rect x="58" y="159" width="204" height="6" fill="#000000" opacity="0.3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Footer Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-1 pt-2"
        >
          <p className="text-lg md:text-xl font-bold text-purple-200 hover:text-white transition-colors flex items-center justify-center gap-1.5">
            Toque para abrir <span className="text-amber-300">✨</span>
          </p>
          <p className="text-xs md:text-sm text-purple-300/50 font-medium">
            Presente exclusivo aguardando
          </p>
        </motion.div>

      </div>

      {/* Bottom Spacer / Subtle Footer Copyright */}
      <footer className="z-10 py-2">
        <p className="text-[10px] text-purple-400/30 tracking-widest uppercase">
          Acesso Seguro & Verified
        </p>
      </footer>
    </div>
  );
}

export default App;


