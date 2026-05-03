import { useState } from 'react';
import { ANIMALS } from '../gameData';

export default function AnimalSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 via-pink-50 to-purple-100 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-[pop-in_0.6s_ease-out]">
        <div className="text-6xl mb-3">🐾</div>
        <h1 className="font-baloo text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
          FurEver Friends
        </h1>
        <p className="font-nunito text-lg text-purple-500 font-semibold mt-2">
          Choose your new best friend! 💕
        </p>
      </div>

      {/* Animal Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl w-full mb-10">
        {ANIMALS.map((animal, i) => (
          <button
            key={animal.id}
            onClick={() => onSelect(animal.id)}
            onMouseEnter={() => setHovered(animal.id)}
            onMouseLeave={() => setHovered(null)}
            className={`
              relative flex flex-col items-center gap-2 p-5 rounded-3xl border-3 border-2 cursor-pointer
              transition-all duration-300 select-none
              ${animal.bgColor} ${animal.borderColor}
              ${hovered === animal.id
                ? 'shadow-xl -translate-y-3 scale-105 border-opacity-100'
                : 'shadow-md hover:shadow-lg border-opacity-60'
              }
            `}
            style={{
              animationDelay: `${i * 100}ms`,
              animation: 'pop-in 0.5s ease-out both',
            }}
          >
            {/* Emoji */}
            <div
              className={`text-6xl transition-transform duration-300 ${
                hovered === animal.id ? 'scale-110 -translate-y-1' : ''
              }`}
            >
              {animal.emoji}
            </div>

            {/* Name + Species */}
            <div className="text-center">
              <div className={`font-baloo font-bold text-xl ${animal.textColor}`}>
                {animal.name}
              </div>
              <div className="font-nunito text-xs text-gray-500 font-semibold uppercase tracking-wide">
                {animal.species}
              </div>
            </div>

            {/* Personality tag */}
            <div className={`
              font-nunito text-xs font-bold px-2 py-1 rounded-full
              ${animal.accentColor} text-white
            `}>
              {animal.personality}
            </div>

            {/* Description on hover */}
            {hovered === animal.id && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-10 w-44 bg-white rounded-2xl shadow-xl p-3 text-center border border-gray-100 pointer-events-none">
                <p className="font-nunito text-xs text-gray-600 leading-snug">
                  {animal.description}
                </p>
                <div className={`mt-2 text-xs font-bold ${animal.textColor}`}>
                  Fave: {animal.favoriteAction} {
                    animal.favoriteAction === 'play' ? '🎾' :
                    animal.favoriteAction === 'feed' ? '🍖' :
                    animal.favoriteAction === 'sleep' ? '😴' : '🛁'
                  }
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 max-w-lg w-full text-center shadow-md border border-purple-100">
        <h2 className="font-baloo text-2xl font-bold text-purple-600 mb-3">How to Play 🌟</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: '🍖', text: 'Feed your pet to keep hunger full' },
            { icon: '🎾', text: 'Play together to boost happiness' },
            { icon: '😴', text: 'Let them sleep to restore energy' },
            { icon: '🛁', text: 'Bathe them to stay clean & fresh' },
            { icon: '🪙', text: 'Earn coins by keeping them happy' },
            { icon: '🛍️', text: 'Spend coins in the shop on treats' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-left bg-purple-50 rounded-2xl p-3">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <span className="font-nunito text-gray-600 text-xs leading-snug">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="font-nunito text-sm text-purple-400 mt-6">
        Your pet will remember you even after you close the page 💾
      </p>
    </div>
  );
}
