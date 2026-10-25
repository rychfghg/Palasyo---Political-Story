export function IdeologyCompass({ economic, social }: { economic: number; social: number }) {
  const x = 50 + economic / 2;
  const y = 50 - social / 2;
  return (
    <div className="compass">
      <svg viewBox="0 0 100 100" role="img" aria-label={`Economic ${economic}, social ${social}`}>
        <rect x="0" y="0" width="100" height="100" className="compass__bg" />
        <line x1="50" y1="0" x2="50" y2="100" className="compass__axis" />
        <line x1="0" y1="50" x2="100" y2="50" className="compass__axis" />
        <circle cx={x} cy={y} r="4" className="compass__dot" />
      </svg>
      <span className="compass__label compass__label--top">Progressive</span>
      <span className="compass__label compass__label--bottom">Traditional</span>
      <span className="compass__label compass__label--left">Left</span>
      <span className="compass__label compass__label--right">Right</span>
    </div>
  );
}
