import { ACTION_CONFIGS } from '../gameData';

export default function ActionButtons({ onAction, animalName }) {
  const actions = [
    { key: 'feed',  ...ACTION_CONFIGS.feed },
    { key: 'play',  ...ACTION_CONFIGS.play },
    { key: 'sleep', ...ACTION_CONFIGS.sleep },
    { key: 'bathe', ...ACTION_CONFIGS.bathe },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map(({ key, label, emoji, color, effects }) => (
        <button
          key={key}
          onClick={() => onAction(key, effects, `${animalName} loves it!`)}
          className={`
            flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl
            text-white font-bold font-nunito text-sm
            transition-all duration-150 active:scale-95
            shadow-md hover:shadow-lg hover:-translate-y-0.5
            ${color}
          `}
        >
          <span className="text-2xl">{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
