import React from 'react';
import { motion, Variants } from 'motion/react';
import { Fighter, AnimationState } from '../types/fighter';

interface FighterSpriteProps {
  fighter: Fighter;
  state: AnimationState;
  facing?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
}

export const FighterSprite: React.FC<FighterSpriteProps> = ({
  fighter,
  state,
  facing = 'right',
  size = 'lg',
  showShadow = true,
}) => {
  const isLeft = facing === 'left';
  const { visual, primaryColor, secondaryColor } = fighter;

  // Dimensions based on size prop
  const sizeMap = {
    sm: { width: 120, height: 160 },
    md: { width: 170, height: 220 },
    lg: { width: 220, height: 290 },
    xl: { width: 280, height: 360 },
  };
  const { width, height } = sizeMap[size];

  // Motion variants for each combat animation state
  const containerVariants: Variants = {
    idle: {
      y: [0, -6, 0],
      rotate: isLeft ? [0, 1, 0] : [0, -1, 0],
      scale: 1,
      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    attack: {
      x: isLeft ? [0, -40, -20, 0] : [0, 40, 20, 0],
      y: [0, -4, 0],
      scale: [1, 1.12, 1],
      transition: {
        duration: 0.45,
        times: [0, 0.3, 0.7, 1],
        ease: 'easeOut',
      },
    },
    hit: {
      x: isLeft ? [0, 30, 10, 0] : [0, -30, -10, 0],
      y: [0, -15, 0],
      rotate: isLeft ? [0, 8, 0] : [0, -8, 0],
      filter: [
        'drop-shadow(0 0 10px rgba(239,68,68,0.8)) brightness(1.4)',
        'drop-shadow(0 0 2px rgba(239,68,68,0.4)) brightness(1)',
      ],
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    special: {
      y: [0, -25, -15, 0],
      scale: [1, 1.25, 1.2, 1],
      filter: [
        `drop-shadow(0 0 25px ${primaryColor}) drop-shadow(0 0 45px #fbbf24) brightness(1.2)`,
        `drop-shadow(0 0 15px ${primaryColor}) brightness(1.1)`,
      ],
      transition: {
        duration: 1.2,
        times: [0, 0.4, 0.8, 1],
        ease: 'easeInOut',
      },
    },
    victory: {
      y: [0, -18, -4, -18, 0],
      scale: [1, 1.08, 1.05, 1.08, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    defeat: {
      y: 35,
      rotate: isLeft ? 65 : -65,
      scale: 0.9,
      filter: 'grayscale(0.6) brightness(0.7) opacity(0.85)',
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  // Render specific hair style
  const renderHair = () => {
    switch (visual.hairStyle) {
      case 'grey_pompadour':
        return (
          <g id="hair-pompadour">
            {/* High voluminous pompadour with silver gradient */}
            <path
              d="M 60 48 C 55 25, 80 10, 110 15 C 135 20, 148 35, 142 50 C 135 48, 120 40, 100 42 C 78 45, 65 48, 60 48 Z"
              fill={visual.hairColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Highlights */}
            <path d="M 80 24 Q 105 20 125 30" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
          </g>
        );
      case 'grey_beard':
        return (
          <g id="hair-lula">
            {/* Curly grey hair on sides and top */}
            <path
              d="M 62 48 C 55 35, 75 24, 98 25 C 125 24, 142 35, 140 50 C 130 45, 110 40, 95 42 C 75 44, 68 48, 62 48 Z"
              fill={visual.hairColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Side curls */}
            <circle cx="65" cy="50" r="10" fill={visual.hairColor} stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="137" cy="50" r="10" fill={visual.hairColor} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        );
      case 'buzz':
        return (
          <path
            d="M 66 48 C 65 34, 80 28, 100 28 C 122 28, 136 34, 136 48 C 126 44, 112 42, 100 42 C 86 42, 74 44, 66 48 Z"
            fill={visual.hairColor}
            stroke="#0f172a"
            strokeWidth="3"
          />
        );
      case 'receding_side':
        return (
          <g id="hair-bolsonaro">
            {/* Parted hair to the side */}
            <path
              d="M 65 48 C 64 30, 85 24, 105 26 C 128 28, 138 38, 136 48 C 120 42, 105 44, 95 44 C 80 44, 72 46, 65 48 Z"
              fill={visual.hairColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path d="M 85 28 Q 105 32 120 38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
          </g>
        );
      case 'short_dark':
      case 'short_neat':
      default:
        return (
          <g id="hair-neat">
            <path
              d="M 64 48 C 62 30, 80 22, 102 22 C 126 22, 140 32, 138 48 C 128 44, 115 42, 100 42 C 82 42, 70 46, 64 48 Z"
              fill={visual.hairColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path d="M 80 26 Q 100 28 120 34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
          </g>
        );
    }
  };

  // Render facial hair
  const renderBeard = () => {
    if (visual.facialHair === 'grey_beard') {
      return (
        <g id="beard-full">
          {/* Full grey fluffy beard */}
          <path
            d="M 75 76 C 70 95, 80 112, 100 114 C 122 112, 130 95, 126 76 C 118 84, 108 86, 100 86 C 92 86, 82 84, 75 76 Z"
            fill={visual.hairColor}
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Mustache */}
          <path
            d="M 84 75 C 90 70, 96 74, 100 76 C 104 74, 110 70, 116 75 C 110 80, 90 80, 84 75 Z"
            fill={visual.hairColor}
            stroke="#0f172a"
            strokeWidth="2.5"
          />
        </g>
      );
    }
    if (visual.facialHair === 'light_stubble') {
      return (
        <path
          d="M 80 82 C 85 96, 115 96, 120 82"
          stroke="#4b5563"
          strokeWidth="3"
          strokeDasharray="2 3"
          fill="none"
          opacity="0.6"
        />
      );
    }
    return null;
  };

  // Eyes and facial expression according to state
  const renderEyesAndMouth = () => {
    if (state === 'defeat') {
      return (
        <g id="face-defeat">
          {/* X X Eyes */}
          <path d="M 80 56 L 90 66 M 90 56 L 80 66" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M 110 56 L 120 66 M 120 56 L 110 66" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          {/* Dizzy mouth */}
          <path d="M 92 80 Q 100 74 108 80" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Orbiting stars */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '100px', originY: '30px' }}
          >
            <text x="75" y="20" fontSize="16">💫</text>
            <text x="115" y="22" fontSize="14">⭐</text>
          </motion.g>
        </g>
      );
    }

    if (state === 'hit') {
      return (
        <g id="face-hit">
          {/* Squeezed wincing eyes */}
          <path d="M 78 62 Q 86 56 92 62" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 62 Q 114 56 122 62" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Pain open mouth */}
          <ellipse cx="100" cy="80" rx="9" ry="7" fill="#7f1d1d" stroke="#1f2937" strokeWidth="2.5" />
          {/* Sweat drop */}
          <path d="M 130 50 Q 134 56 130 60 Q 126 56 130 50 Z" fill="#60a5fa" />
        </g>
      );
    }

    if (state === 'victory') {
      return (
        <g id="face-victory">
          {/* Happy squint eyes */}
          <path d="M 78 60 Q 86 52 92 60" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 60 Q 114 52 122 60" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Huge confident winner smile */}
          <path d="M 84 75 Q 100 92 116 75 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="2.5" />
          <path d="M 84 75 L 116 75" stroke="#1f2937" strokeWidth="2" />
        </g>
      );
    }

    if (state === 'attack' || state === 'special') {
      return (
        <g id="face-attack">
          {/* Fierce determined angled eyebrows */}
          <path d="M 76 50 L 92 56" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 124 50 L 108 56" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
          {/* Focused eyes */}
          <circle cx="86" cy="60" r="4.5" fill="#111827" />
          <circle cx="114" cy="60" r="4.5" fill="#111827" />
          <circle cx="88" cy="58" r="1.5" fill="#ffffff" />
          <circle cx="116" cy="58" r="1.5" fill="#ffffff" />
          {/* Shouting political oratory mouth */}
          <path d="M 88 74 Q 100 88 112 74 Z" fill="#991b1b" stroke="#111827" strokeWidth="3" />
          <rect x="92" y="74" width="16" height="3.5" fill="#ffffff" />
        </g>
      );
    }

    // Default IDLE face
    return (
      <g id="face-idle">
        {/* Confident, diplomatic eyebrows */}
        <path d="M 78 52 Q 86 50 94 54" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 122 52 Q 114 50 106 54" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Confident eyes */}
        <circle cx="86" cy="60" r="4" fill="#111827" />
        <circle cx="114" cy="60" r="4" fill="#111827" />
        <circle cx="87.5" cy="58.5" r="1.5" fill="#ffffff" />
        <circle cx="115.5" cy="58.5" r="1.5" fill="#ffffff" />
        {/* Subtle confident smile */}
        <path d="M 88 76 Q 100 83 112 76" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  };

  return (
    <div className="relative select-none pointer-events-none flex flex-col items-center justify-center">
      {/* Special Cinematic Aura Glow when casting Ultra Special */}
      {state === 'special' && (
        <motion.div
          animate={{ scale: [1, 1.4, 1.2], opacity: [0.6, 1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${primaryColor} 0%, #f59e0b 60%, transparent 100%)` }}
        />
      )}

      {/* Main Fighter SVG */}
      <motion.div
        variants={containerVariants}
        animate={state}
        style={{
          transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)',
          transformOrigin: 'center bottom',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 200 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible filter drop-shadow-md"
        >
          <defs>
            <linearGradient id={`suit-grad-${fighter.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={visual.suitColor} />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="sash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <radialGradient id="energy-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Special Energy Spheres around fists when attacking/special */}
          {(state === 'special' || state === 'attack') && (
            <g id="combat-aura">
              <circle cx="160" cy="130" r="28" fill="url(#energy-glow)" />
              <circle cx="160" cy="130" r="14" fill="#ffffff" opacity="0.85" />
              <line x1="135" y1="130" x2="185" y2="130" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {/* BACK ARM / FIST */}
          <g id="arm-back">
            {state === 'victory' ? (
              // Raised victory fist
              <path
                d="M 64 125 L 42 70 Q 40 58 50 56 Q 60 56 62 68 L 74 120 Z"
                fill={visual.suitColor}
                stroke="#0f172a"
                strokeWidth="3.5"
              />
            ) : (
              // Guard pose
              <path
                d="M 65 125 Q 45 135 48 115 Q 50 95 68 110 Z"
                fill={visual.suitColor}
                stroke="#0f172a"
                strokeWidth="3.5"
              />
            )}
            {/* Back fist hand */}
            <circle
              cx={state === 'victory' ? '46' : '52'}
              cy={state === 'victory' ? '58' : '108'}
              r="10"
              fill={visual.skinTone}
              stroke="#0f172a"
              strokeWidth="3"
            />
          </g>

          {/* LEGS & SHOES (Terno Pants) */}
          <g id="legs">
            {/* Left Leg */}
            <path
              d="M 76 195 L 72 238 Q 62 245 56 250 L 84 250 L 90 195 Z"
              fill={visual.suitColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Right Leg */}
            <path
              d="M 110 195 L 116 238 Q 126 245 138 250 L 108 250 L 102 195 Z"
              fill={visual.suitColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Shiny black dress shoes */}
            <path
              d="M 54 246 Q 52 254 70 255 L 86 255 L 86 245 Z"
              fill="#090d16"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path
              d="M 106 246 L 106 255 L 126 255 Q 142 254 140 246 Z"
              fill="#090d16"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
          </g>

          {/* BODY / SUIT TORSO */}
          <g id="torso">
            {/* Main Suit Jacket */}
            <path
              d="M 64 115 L 76 198 L 124 198 L 136 115 Q 100 125 64 115 Z"
              fill={`url(#suit-grad-${fighter.id})`}
              stroke="#0f172a"
              strokeWidth="3.5"
            />

            {/* White Shirt Collar V-neck */}
            <polygon points="86,115 114,115 100,165" fill={visual.shirtColor} stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Presidential Tie */}
            <polygon points="96,118 104,118 106,172 100,182 94,172" fill={visual.tieColor} stroke="#0f172a" strokeWidth="2" />
            <polygon points="95,115 105,115 103,124 97,124" fill={visual.tieColor} />

            {/* Presidential Sash (Faixa Presidencial Verde e Amarela) */}
            {(visual.accessory === 'sash' || state === 'victory') && (
              <path
                d="M 72 118 L 128 190 L 120 198 L 65 125 Z"
                fill="url(#sash-grad)"
                stroke="#15803d"
                strokeWidth="1.5"
                opacity="0.95"
              />
            )}

            {/* Lapels of the Suit */}
            <polygon points="64,115 86,115 94,155 78,160" fill={visual.suitColor} stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="136,115 114,115 106,155 122,160" fill={visual.suitColor} stroke="#0f172a" strokeWidth="2.5" />

            {/* Flag Pin on Lapel */}
            {visual.accessory === 'pin' && (
              <rect x="74" y="132" width="7" height="5" rx="1.5" fill="#16a34a" stroke="#facc15" strokeWidth="1" />
            )}

            {/* Pen in pocket */}
            {visual.accessory === 'pen' && (
              <line x1="122" y1="130" x2="122" y2="140" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </g>

          {/* HEAD & NECK */}
          <g id="head-neck">
            {/* Neck */}
            <rect x="91" y="98" width="18" height="22" rx="3" fill={visual.skinTone} stroke="#0f172a" strokeWidth="2.5" />

            {/* Head oval */}
            <path
              d="M 68 62 C 68 40, 82 32, 100 32 C 118 32, 132 40, 132 62 C 132 88, 120 102, 100 102 C 80 102, 68 88, 68 62 Z"
              fill={visual.skinTone}
              stroke="#0f172a"
              strokeWidth="3.5"
            />

            {/* Ears */}
            <ellipse cx="68" cy="66" rx="5" ry="8" fill={visual.skinTone} stroke="#0f172a" strokeWidth="2.5" />
            <ellipse cx="132" cy="66" rx="5" ry="8" fill={visual.skinTone} stroke="#0f172a" strokeWidth="2.5" />

            {/* Nose */}
            <path d="M 100 64 Q 104 70 100 72" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Hair */}
            {renderHair()}

            {/* Beard / Stubble if any */}
            {renderBeard()}

            {/* Eyes & Mouth Expression */}
            {renderEyesAndMouth()}

            {/* Glasses (e.g. Ciro) */}
            {visual.glasses && (
              <g id="glasses">
                <rect x="76" y="55" width="18" height="12" rx="3" stroke="#0f172a" strokeWidth="2.5" fill="#e0f2fe" fillOpacity="0.4" />
                <rect x="106" y="55" width="18" height="12" rx="3" stroke="#0f172a" strokeWidth="2.5" fill="#e0f2fe" fillOpacity="0.4" />
                <line x1="94" y1="61" x2="106" y2="61" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="76" y1="61" x2="68" y2="59" stroke="#0f172a" strokeWidth="2" />
                <line x1="124" y1="61" x2="132" y2="59" stroke="#0f172a" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* FRONT ARM & ATTACKING FIST */}
          <g id="arm-front">
            {state === 'attack' || state === 'special' ? (
              // Thrusting attack punch / blast forward
              <g id="punch-thrust">
                <path
                  d="M 126 125 L 165 125 L 162 145 L 126 142 Z"
                  fill={visual.suitColor}
                  stroke="#0f172a"
                  strokeWidth="3.5"
                />
                {/* Punch fist */}
                <circle cx="170" cy="133" r="14" fill={visual.skinTone} stroke="#0f172a" strokeWidth="3.5" />
                {/* Knuckles */}
                <path d="M 166 124 L 176 124" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <path d="M 166 129 L 176 129" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <path d="M 166 134 L 176 134" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                {/* Motion lines */}
                <path d="M 110 115 L 150 115" stroke="#facc15" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                <path d="M 115 152 L 155 152" stroke="#facc15" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              </g>
            ) : state === 'victory' ? (
              // Two raised arms in victory
              <g id="raised-front-arm">
                <path
                  d="M 134 125 L 156 70 Q 158 58 148 56 Q 138 56 136 68 L 124 120 Z"
                  fill={visual.suitColor}
                  stroke="#0f172a"
                  strokeWidth="3.5"
                />
                <circle cx="152" cy="58" r="10" fill={visual.skinTone} stroke="#0f172a" strokeWidth="3" />
              </g>
            ) : (
              // Ready Guard Stance
              <g id="guard-front-arm">
                <path
                  d="M 128 125 Q 150 135 145 110 Q 140 95 125 112 Z"
                  fill={visual.suitColor}
                  stroke="#0f172a"
                  strokeWidth="3.5"
                />
                <circle cx="145" cy="105" r="11" fill={visual.skinTone} stroke="#0f172a" strokeWidth="3.5" />
                {/* Watch on wrist */}
                {visual.accessory === 'watch' && (
                  <rect x="135" y="112" width="6" height="5" rx="1" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
                )}
              </g>
            )}
          </g>
        </svg>
      </motion.div>

      {/* Realistic Ground Shadow */}
      {showShadow && (
        <motion.div
          animate={{
            scaleX: state === 'special' ? 0.7 : state === 'attack' ? 1.25 : 1,
            opacity: state === 'special' ? 0.3 : 0.6,
          }}
          transition={{ duration: 0.3 }}
          className="w-32 sm:w-40 h-4 bg-black/40 rounded-full blur-xs mt-1 -translate-y-2 pointer-events-none"
        />
      )}
    </div>
  );
};
