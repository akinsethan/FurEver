import { useEffect } from 'react';

export default function Notifications({ notifications, onDismiss }) {
  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map(n =>
      setTimeout(() => onDismiss(n.id), 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
      {notifications.map(n => (
        <div
          key={n.id}
          className="flex items-center gap-3 bg-white border-2 border-red-200 rounded-2xl px-4 py-3 shadow-lg animate-[slide-down_0.3s_ease-out] cursor-pointer"
          onClick={() => onDismiss(n.id)}
        >
          <span className="text-xl animate-bounce">⚠️</span>
          <p className="font-nunito font-bold text-sm text-gray-700 flex-1">{n.msg}</p>
          <button className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
      ))}
    </div>
  );
}
