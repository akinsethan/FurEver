export default function FloatingFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div
      key={feedback.id}
      className="absolute left-1/2 -translate-x-1/2 top-8 z-30 pointer-events-none"
      style={{ animation: 'heart-float 1.1s ease-out both' }}
    >
      <div className="bg-white border-2 border-purple-200 rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap">
        <span className="font-nunito font-bold text-purple-600 text-sm">{feedback.text}</span>
      </div>
    </div>
  );
}
