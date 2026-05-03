import { STAT_CONFIG } from '../gameData';

export default function StatBar({ statKey, value }) {
  const cfg = STAT_CONFIG[statKey];
  const pct = Math.round(value);
  const isCritical = value <= cfg.critical;
  const isLow = value <= cfg.low;

  const barColor = isCritical ? 'bg-red-400' : isLow ? 'bg-yellow-400' : cfg.color;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-lg flex-shrink-0 w-6 text-center">{cfg.emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-nunito text-xs font-bold text-gray-600">{cfg.label}</span>
          <span className={`font-nunito text-xs font-bold ${isCritical ? 'text-red-500' : isLow ? 'text-yellow-600' : 'text-gray-500'}`}>
            {pct}%
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${cfg.trackColor} overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${isCritical ? 'animate-pulse' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {isCritical && (
        <span className="text-sm animate-bounce flex-shrink-0">⚠️</span>
      )}
    </div>
  );
}
