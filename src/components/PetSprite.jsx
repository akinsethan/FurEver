import { useEffect, useState } from 'react';

const MOOD_OVERLAYS = {
  ecstatic: { stars: ['⭐', '✨', '💫'], color: 'from-yellow-100 to-pink-100' },
  happy:    { stars: ['💛', '💕'],       color: 'from-pink-50 to-yellow-50' },
  content:  { stars: [],                  color: 'from-purple-50 to-pink-50' },
  neutral:  { stars: [],                  color: 'from-gray-50 to-purple-50' },
  sad:      { stars: ['💧'],             color: 'from-blue-50 to-gray-50' },
  sick:     { stars: ['💊', '🤧'],       color: 'from-green-50 to-gray-50' },
};

const ANIM_CLASS = {
  ecstatic: 'animate-bounce-pet',
  happy:    'animate-bounce-pet',
  content:  'animate-wiggle-pet',
  neutral:  '',
  sad:      'animate-droop-pet',
  sick:     'animate-shake-pet',
};

const ACTION_PARTICLES = {
  feed:  ['🍖', '✨', '😋'],
  play:  ['⭐', '🎾', '💫'],
  sleep: ['💤', '😴', '🌙'],
  bathe: ['🛁', '✨', '💧'],
  buy:   ['🪙', '🛍️', '✨'],
  use:   ['✨', '💫', '🌟'],
};

export default function PetSprite({ animal, mood, actionAnim }) {
  const [particles, setParticles] = useState([]);
  const overlay = MOOD_OVERLAYS[mood.key] ?? MOOD_OVERLAYS.neutral;
  const animClass = ANIM_CLASS[mood.key] ?? '';

  useEffect(() => {
    if (!actionAnim) return;
    const icons = ACTION_PARTICLES[actionAnim] ?? ['✨'];
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      icon: icons[i % icons.length],
      x: (Math.random() - 0.5) * 140,
      delay: i * 80,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timer);
  }, [actionAnim]);

  return (
    <div className="relative flex items-center justify-center w-full">
      {/* Backdrop glow */}
      <div className={`absolute w-44 h-44 rounded-full bg-gradient-to-br ${overlay.color} opacity-80 blur-sm`} />

      {/* Platform */}
      <div className="absolute bottom-1 w-32 h-4 rounded-full bg-gradient-to-r from-purple-200/50 to-pink-200/50 blur-sm" />

      {/* Pet emoji */}
      <div
        className={`relative text-[96px] leading-none select-none z-10 ${animClass}`}
        style={{ filter: mood.key === 'sick' ? 'hue-rotate(60deg) saturate(0.6)' : 'none' }}
      >
        {animal.emoji}
      </div>

      {/* Mood face overlay */}
      <div className="absolute top-0 right-6 text-3xl z-20 animate-[pop-in_0.3s_ease-out]">
        {mood.emoji}
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute z-30 text-2xl pointer-events-none"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: '50%',
            animation: `heart-float 1s ${p.delay}ms ease-out both`,
          }}
        >
          {p.icon}
        </div>
      ))}

      {/* Ambient stars for happy moods */}
      {overlay.stars.map((star, i) => (
        <div
          key={i}
          className="absolute text-lg pointer-events-none animate-pulse"
          style={{
            top: `${10 + i * 22}%`,
            left: i % 2 === 0 ? `${5 + i * 5}%` : 'auto',
            right: i % 2 === 1 ? `${5 + i * 5}%` : 'auto',
            animationDelay: `${i * 300}ms`,
          }}
        >
          {star}
        </div>
      ))}

      {/* Sick overlay */}
      {mood.key === 'sick' && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="text-4xl mt-2 animate-bounce">😵</div>
        </div>
      )}
    </div>
  );
}
