import { useState } from 'react';
import PetSprite from './PetSprite';
import StatBar from './StatBar';
import ActionButtons from './ActionButtons';
import Shop from './Shop';
import Inventory from './Inventory';
import Notifications from './Notifications';
import FloatingFeedback from './FloatingFeedback';
import { ACTION_CONFIGS } from '../gameData';

const MOOD_MESSAGES = {
  ecstatic: "I'm SO happy! 🥰",
  happy:    "Life is wonderful! ✨",
  content:  "I'm doing okay 🙂",
  neutral:  "Could use some love...",
  sad:      "I feel a bit down 😢",
  sick:     "Please take care of me 🤒",
};

export default function GameScreen({
  animal, mood, stats, coins, inventory,
  notifications, floatingFeedback, shopOpen, shopTab, actionAnim,
  setShopOpen, setShopTab,
  doAction, buyItem, useItem,
  dismissNotification, onReset,
}) {
  const [showInventory, setShowInventory] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const avgStat = Math.round(
    (stats.hunger + stats.happiness + stats.energy + stats.cleanliness) / 4
  );

  const bgGradients = {
    ecstatic: 'from-yellow-100 via-pink-50 to-fuchsia-100',
    happy:    'from-pink-100 via-purple-50 to-fuchsia-100',
    content:  'from-purple-100 via-pink-50 to-rose-100',
    neutral:  'from-gray-100 via-purple-50 to-blue-100',
    sad:      'from-blue-100 via-indigo-50 to-purple-100',
    sick:     'from-green-50 via-gray-100 to-blue-50',
  };
  const bg = bgGradients[mood.key] ?? bgGradients.neutral;

  function handleAction(actionKey, effects, _text) {
    const cfg = ACTION_CONFIGS[actionKey];
    doAction(actionKey, effects, `${animal.name} enjoyed the ${cfg.label.toLowerCase()}! ${cfg.emoji}`);
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bg} flex flex-col`}>
      <Notifications notifications={notifications} onDismiss={dismissNotification} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="font-baloo text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-purple-500 bg-clip-text text-transparent leading-tight">
            🐾 FurEver Friends
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm border border-yellow-200">
            <span className="text-lg">🪙</span>
            <span className="font-baloo font-bold text-yellow-600 text-lg">{coins}</span>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="w-10 h-10 flex items-center justify-center bg-white/70 hover:bg-white/90 rounded-2xl shadow-sm border border-gray-200 text-gray-600 font-bold text-lg transition-colors"
            >
              ⋯
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-44 z-40 animate-[pop-in_0.2s_ease-out]">
                <button
                  onClick={() => { setShowInventory(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-purple-50 font-nunito font-semibold text-gray-700 text-sm"
                >
                  🎒 Inventory
                </button>
                <button
                  onClick={() => { setShopOpen(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-purple-50 font-nunito font-semibold text-gray-700 text-sm"
                >
                  🛍️ Pet Shop
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { onReset(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 font-nunito font-semibold text-red-500 text-sm"
                >
                  🔄 New Pet
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-6 gap-4 max-w-md mx-auto w-full">

        {/* Pet card */}
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/80 overflow-hidden">
          {/* Pet name + mood */}
          <div className="flex items-center justify-between px-5 pt-4 pb-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-baloo text-2xl font-bold text-gray-800">{animal.name}</span>
                <span className={`font-nunito text-xs font-bold px-2 py-0.5 rounded-full ${animal.accentColor} text-white`}>
                  {animal.species}
                </span>
              </div>
              <p className="font-nunito text-sm text-gray-500 mt-0.5">{MOOD_MESSAGES[mood.key]}</p>
            </div>
            <div className="text-right">
              <div className="font-nunito text-xs text-gray-400 font-semibold">Mood</div>
              <div className="font-baloo text-lg font-bold text-gray-700">
                {mood.emoji} {mood.label}
              </div>
            </div>
          </div>

          {/* Sprite area */}
          <div className="relative h-52 flex items-center justify-center my-2">
            <PetSprite animal={animal} mood={mood} actionAnim={actionAnim} />
            <FloatingFeedback feedback={floatingFeedback} />
          </div>

          {/* Health score */}
          <div className="flex items-center justify-center gap-2 pb-3">
            <div className="flex items-center gap-1.5 bg-purple-50 rounded-2xl px-4 py-1.5">
              <span className="text-sm">💖</span>
              <span className="font-nunito font-bold text-sm text-purple-600">Overall Health: </span>
              <span className={`font-baloo font-bold text-lg ${avgStat >= 70 ? 'text-emerald-500' : avgStat >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {avgStat}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl shadow-md border border-white/80 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-baloo font-bold text-gray-700 text-lg">Stats</h2>
            <span className="font-nunito text-xs text-gray-400">{animal.personality}</span>
          </div>
          {['hunger', 'happiness', 'energy', 'cleanliness'].map(key => (
            <StatBar key={key} statKey={key} value={stats[key]} />
          ))}
        </div>

        {/* Actions */}
        <div className="w-full bg-white/60 backdrop-blur-sm rounded-3xl shadow-md border border-white/80 p-4">
          <h2 className="font-baloo font-bold text-gray-700 text-lg mb-3">Actions</h2>
          <ActionButtons onAction={handleAction} animalName={animal.name} />
        </div>

        {/* Quick-access shop + inventory buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setShopOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-400 to-purple-400 text-white font-baloo font-bold text-base shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            🛍️ Shop
          </button>
          <button
            onClick={() => setShowInventory(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-baloo font-bold text-base shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            🎒 Bag
            {inventory.length > 0 && (
              <span className="bg-white text-emerald-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {inventory.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Tip */}
        <p className="font-nunito text-xs text-center text-gray-400">
          Keep all stats high to earn more 🪙 coins! Your progress is saved automatically 💾
        </p>
      </main>

      {/* Modals */}
      {shopOpen && (
        <Shop
          coins={coins}
          inventory={inventory}
          onBuy={buyItem}
          onClose={() => setShopOpen(false)}
          activeTab={shopTab}
          onTabChange={setShopTab}
        />
      )}
      {showInventory && (
        <Inventory
          inventory={inventory}
          onUse={id => { useItem(id); setShowInventory(false); }}
          onClose={() => setShowInventory(false)}
        />
      )}
    </div>
  );
}
