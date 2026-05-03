import { SHOP_ITEMS } from '../gameData';

const TABS = [
  { key: 'food',      label: 'Food',       emoji: '🍎' },
  { key: 'toy',       label: 'Toys',       emoji: '🎾' },
  { key: 'accessory', label: 'Accessories', emoji: '🎀' },
];

export default function Shop({ coins, inventory, onBuy, onClose, activeTab, onTabChange }) {
  const items = SHOP_ITEMS.filter(i => i.category === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-[slide-down_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-fuchsia-400 to-purple-400 p-4 flex items-center justify-between">
          <h2 className="font-baloo text-2xl font-bold text-white">
            🛍️ Pet Shop
          </h2>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-lg">🪙</span>
              <span className="font-baloo font-bold text-white text-lg">{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold text-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-3 font-nunito font-bold text-sm
                transition-colors border-b-2
                ${activeTab === tab.key
                  ? 'border-purple-400 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="p-4 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {items.map(item => {
            const invItem = inventory.find(i => i.id === item.id);
            const canAfford = coins >= item.price;
            return (
              <div
                key={item.id}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                  ${canAfford ? 'border-purple-200 bg-purple-50 hover:border-purple-400' : 'border-gray-100 bg-gray-50 opacity-70'}
                `}
              >
                {invItem && (
                  <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {invItem.qty}
                  </span>
                )}
                <div className="text-4xl">{item.emoji}</div>
                <div className="text-center">
                  <div className="font-nunito font-bold text-sm text-gray-800">{item.name}</div>
                  <div className="font-nunito text-xs text-gray-500">{item.description}</div>
                </div>
                {/* Effects */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {Object.entries(item.effect).map(([stat, val]) => (
                    <span
                      key={stat}
                      className={`text-xs px-1.5 py-0.5 rounded-full font-bold font-nunito ${val > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                    >
                      {val > 0 ? '+' : ''}{val} {stat.slice(0, 3)}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => canAfford && onBuy(item.id)}
                  disabled={!canAfford}
                  className={`
                    w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
                    font-nunito font-bold text-sm transition-all
                    ${canAfford
                      ? 'bg-purple-400 hover:bg-purple-500 text-white shadow-sm active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span>🪙</span>
                  <span>{item.price}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Inventory hint */}
        <div className="px-4 pb-4 text-center">
          <p className="font-nunito text-xs text-gray-400">
            Tap inventory tab to use items you've purchased!
          </p>
        </div>
      </div>
    </div>
  );
}
