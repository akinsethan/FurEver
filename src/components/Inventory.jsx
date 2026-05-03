import { SHOP_ITEMS } from '../gameData';

export default function Inventory({ inventory, onUse, onClose }) {
  const items = inventory
    .map(inv => ({ ...SHOP_ITEMS.find(i => i.id === inv.id), qty: inv.qty }))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-[slide-down_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-4 flex items-center justify-between">
          <h2 className="font-baloo text-2xl font-bold text-white">🎒 Inventory</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-4 min-h-32">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🎒</div>
              <p className="font-nunito text-gray-500">Nothing in your bag yet!</p>
              <p className="font-nunito text-xs text-gray-400 mt-1">Visit the shop to buy items.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onUse(item.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 active:scale-95 transition-all relative"
                >
                  <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.qty}
                  </span>
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="font-nunito text-xs font-bold text-gray-700 text-center leading-tight">
                    {item.name}
                  </span>
                  <span className="font-nunito text-xs text-emerald-600 font-semibold">Use</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
