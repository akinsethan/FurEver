import { useState, useEffect, useCallback, useRef } from 'react';
import { ANIMALS, MOODS, SHOP_ITEMS } from './gameData';

const STORAGE_KEY = 'furever_friends_save';
const DRAIN_INTERVAL_MS = 3000;

function getDefaultStats() {
  return { hunger: 80, happiness: 80, energy: 80, cleanliness: 80 };
}

function getMood(stats) {
  const avg = (stats.hunger + stats.happiness + stats.energy + stats.cleanliness) / 4;
  const entries = Object.entries(MOODS).sort((a, b) => b[1].threshold - a[1].threshold);
  for (const [key, mood] of entries) {
    if (avg >= mood.threshold) return { key, ...mood };
  }
  return { key: 'sick', ...MOODS.sick };
}

function clamp(val) {
  return Math.min(100, Math.max(0, val));
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt data
  }
  return null;
}

function writeSave(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function useGameState() {
  const saved = loadSave();

  const [screen, setScreen] = useState(saved?.animalId ? 'game' : 'select');
  const [animalId, setAnimalId] = useState(saved?.animalId ?? null);
  const [stats, setStats] = useState(saved?.stats ?? getDefaultStats());
  const [coins, setCoins] = useState(saved?.coins ?? 50);
  const [inventory, setInventory] = useState(saved?.inventory ?? []);
  const [notifications, setNotifications] = useState([]);
  const [floatingFeedback, setFloatingFeedback] = useState(null);
  const [lastInteracted, setLastInteracted] = useState(Date.now());
  const [shopOpen, setShopOpen] = useState(false);
  const [shopTab, setShopTab] = useState('food');
  const [actionAnim, setActionAnim] = useState(null);

  const notifIdRef = useRef(0);
  const coinAccRef = useRef(0);
  const prevMoodRef = useRef(null);

  const animal = ANIMALS.find(a => a.id === animalId);
  const mood = getMood(stats);

  // Persist save
  useEffect(() => {
    if (!animalId) return;
    writeSave({ animalId, stats, coins, inventory });
  }, [animalId, stats, coins, inventory]);

  // Drain stats over time
  useEffect(() => {
    if (!animalId || !animal) return;
    const timer = setInterval(() => {
      setStats(prev => {
        const next = {
          hunger:      clamp(prev.hunger      - animal.drainRates.hunger      * 0.5),
          happiness:   clamp(prev.happiness   - animal.drainRates.happiness   * 0.5),
          energy:      clamp(prev.energy      - animal.drainRates.energy      * 0.5),
          cleanliness: clamp(prev.cleanliness - animal.drainRates.cleanliness * 0.5),
        };
        return next;
      });
    }, DRAIN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [animalId, animal]);

  // Earn coins based on mood
  useEffect(() => {
    if (!animalId) return;
    const timer = setInterval(() => {
      const coinEarn = mood.coins;
      if (coinEarn > 0) {
        coinAccRef.current += coinEarn;
        if (coinAccRef.current >= 3) {
          setCoins(c => c + coinAccRef.current);
          coinAccRef.current = 0;
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [animalId, mood.coins]);

  // Low stat notifications
  useEffect(() => {
    if (!animalId) return;
    const timer = setInterval(() => {
      setStats(prev => {
        const alerts = [];
        if (prev.hunger < 20)      alerts.push({ stat: 'hunger',      msg: `${animal?.name} is starving! 🍖` });
        if (prev.happiness < 20)   alerts.push({ stat: 'happiness',   msg: `${animal?.name} is feeling lonely! ⭐` });
        if (prev.energy < 20)      alerts.push({ stat: 'energy',      msg: `${animal?.name} is exhausted! ⚡` });
        if (prev.cleanliness < 20) alerts.push({ stat: 'cleanliness', msg: `${animal?.name} needs a bath! ✨` });
        if (alerts.length > 0) addNotifications(alerts);
        return prev;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [animalId, animal]);

  function addNotifications(alerts) {
    setNotifications(prev => {
      const existingStats = new Set(prev.map(n => n.stat));
      const newOnes = alerts
        .filter(a => !existingStats.has(a.stat))
        .map(a => ({ ...a, id: ++notifIdRef.current }));
      if (newOnes.length === 0) return prev;
      return [...prev, ...newOnes];
    });
  }

  function dismissNotification(id) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  function showFloatingFeedback(type, text) {
    setFloatingFeedback({ type, text, id: Date.now() });
    setTimeout(() => setFloatingFeedback(null), 1200);
  }

  const applyAction = useCallback((actionKey, effects) => {
    setStats(prev => {
      const next = { ...prev };
      for (const [stat, delta] of Object.entries(effects)) {
        if (stat in next) next[stat] = clamp(next[stat] + delta);
      }
      return next;
    });
    setNotifications(prev =>
      prev.filter(n => !Object.keys(effects).includes(n.stat))
    );
    setActionAnim(actionKey);
    setTimeout(() => setActionAnim(null), 800);
    setLastInteracted(Date.now());
  }, []);

  function doAction(actionKey, effects, feedbackText) {
    applyAction(actionKey, effects);
    showFloatingFeedback(actionKey, feedbackText);
  }

  function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || coins < item.price) return false;
    setCoins(c => c - item.price);
    setInventory(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) return prev.map(i => i.id === itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: itemId, qty: 1 }];
    });
    showFloatingFeedback('buy', `Bought ${item.name}! ${item.emoji}`);
    return true;
  }

  function useItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    const invItem = inventory.find(i => i.id === itemId);
    if (!item || !invItem || invItem.qty < 1) return false;
    applyAction('item', item.effect);
    setInventory(prev =>
      prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0)
    );
    showFloatingFeedback('use', `Used ${item.name}! ${item.emoji}`);
    return true;
  }

  function selectAnimal(id) {
    setAnimalId(id);
    setStats(getDefaultStats());
    setCoins(50);
    setInventory([]);
    setNotifications([]);
    setScreen('game');
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    setAnimalId(null);
    setStats(getDefaultStats());
    setCoins(50);
    setInventory([]);
    setNotifications([]);
    setScreen('select');
  }

  return {
    screen, animal, mood, stats, coins, inventory,
    notifications, floatingFeedback, shopOpen, shopTab, actionAnim,
    setShopOpen, setShopTab,
    selectAnimal, resetGame,
    doAction, buyItem, useItem,
    dismissNotification,
  };
}
