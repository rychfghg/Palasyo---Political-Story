import { useId } from 'react';

export type Mood = 'neutral' | 'happy' | 'relieved' | 'worried' | 'disappointed' | 'angry';

/** Small deterministic hash so the same name always draws the same face. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const SKIN = ['#f1c9a5', '#e0ac85', '#c68c65', '#a86f4c', '#8a5a3c', '#d9a37a'];
const HAIR = ['#1b1512', '#2b1d16', '#3a2a20', '#4a4a4a', '#8c8c8c', '#d8d8d8', '#2a1a10'];
const SUIT = ['#1e2a3a', '#2c2c34', '#3a2a2a', '#1f3a33', '#3b3325', '#26324d', '#5a4a3a'];
const TIE = ['#8f2d2d', '#d6b25e', '#2d5a8f', '#3f8f58', '#6b3f8f', '#c0463c'];
const BG = ['#233246', '#2d2a3a', '#1f3a3a', '#3a3023', '#2a2f3f'];

/**
 * A painted-style portrait drawn in SVG from a name. The same person always looks the same;
 * the mouth and brows change with their mood.
 */
export function Portrait({ name, mood = 'neutral', size = 56, title }: { name: string; mood?: Mood; size?: number; title?: string }) {
  const gid = `pbg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const r = hash(name.replace(/^(Atty\.|Dr\.|Engr\.|Gen\.|Sen\.|Rep\.|Gov\.|Mayor|Prof\.|Amb\.|Arch\.|Ka|Sister|P\/Gen\.|Justice|VP|Dean)\s*(\(Ret\.\)\s*)?/, ''));
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const skin = pick(SKIN);
  const hair = pick(HAIR);
  const suit = pick(SUIT);
  const tie = pick(TIE);
  const bg = pick(BG);
  const style = Math.floor(r() * 5); // hair style
  const glasses = r() < 0.3;
  const beard = r() < 0.15;
  const collar = r() < 0.5 ? 'tie' : 'blouse';

  const mouth = {
    neutral: 'M40 72 Q50 74 60 72',
    happy: 'M38 70 Q50 82 62 70',
    relieved: 'M40 71 Q50 77 60 71',
    worried: 'M40 74 Q50 70 60 74',
    disappointed: 'M39 76 Q50 68 61 76',
    angry: 'M40 75 Q50 70 60 75',
  }[mood];
  const brows = {
    neutral: ['M33 47 L44 46', 'M56 46 L67 47'],
    happy: ['M33 46 Q38 43 44 45', 'M56 45 Q62 43 67 46'],
    relieved: ['M33 46 L44 46', 'M56 46 L67 46'],
    worried: ['M33 46 L44 43', 'M56 43 L67 46'],
    disappointed: ['M33 45 L44 47', 'M56 47 L67 45'],
    angry: ['M33 43 L45 48', 'M55 48 L67 43'],
  }[mood];

  const hairPath = [
    'M26 50 Q26 22 50 20 Q74 22 74 50 Q70 34 50 32 Q30 34 26 50 Z',
    'M24 56 Q22 20 50 18 Q78 20 76 56 Q74 36 62 30 Q50 38 36 32 Q26 38 24 56 Z',
    'M24 70 Q20 20 50 18 Q80 20 76 70 Q74 40 70 34 Q50 26 30 34 Q26 40 24 70 Z',
    'M28 46 Q30 24 50 23 Q70 24 72 46 Q66 30 50 30 Q34 30 28 46 Z',
    'M25 52 Q24 24 46 20 Q70 16 75 44 Q60 30 42 34 Q30 36 25 52 Z',
  ][style];

  return (
    <svg className={`portrait portrait--${mood}`} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title ?? name}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={bg} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a1119" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="14" fill={`url(#${gid})`} />
      {/* shoulders */}
      <path d="M14 100 Q16 80 50 78 Q84 80 86 100 Z" fill={suit} />
      {collar === 'tie' ? (
        <>
          <path d="M42 80 L50 90 L58 80 L50 84 Z" fill="#f4ecd8" />
          <path d="M48 84 L52 84 L54 100 L46 100 Z" fill={tie} />
        </>
      ) : (
        <path d="M40 80 Q50 92 60 80 L58 86 Q50 94 42 86 Z" fill="#f4ecd8" />
      )}
      {/* neck and head */}
      <rect x="43" y="64" width="14" height="16" rx="5" fill={skin} />
      <ellipse cx="50" cy="52" rx="22" ry="25" fill={skin} />
      <ellipse cx="28" cy="54" rx="3.5" ry="5" fill={skin} />
      <ellipse cx="72" cy="54" rx="3.5" ry="5" fill={skin} />
      <path d={hairPath} fill={hair} />
      {/* face */}
      <path d={brows[0]} stroke={hair === '#d8d8d8' ? '#777' : hair} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={brows[1]} stroke={hair === '#d8d8d8' ? '#777' : hair} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="39" cy="53" rx="2.6" ry={mood === 'happy' ? 1.6 : 2.6} fill="#1b1512" />
      <ellipse cx="61" cy="53" rx="2.6" ry={mood === 'happy' ? 1.6 : 2.6} fill="#1b1512" />
      <path d="M50 56 Q47 64 50 65" stroke="rgba(0,0,0,0.25)" strokeWidth="1.6" fill="none" />
      {glasses && (
        <g stroke="#111" strokeWidth="1.6" fill="rgba(255,255,255,0.08)">
          <circle cx="39" cy="53" r="7" />
          <circle cx="61" cy="53" r="7" />
          <path d="M46 53 L54 53" />
        </g>
      )}
      {beard && <path d="M32 62 Q34 80 50 82 Q66 80 68 62 Q60 72 50 72 Q40 72 32 62 Z" fill={hair} opacity="0.85" />}
      <path d={mouth} stroke="#6b2a22" strokeWidth="2.4" strokeLinecap="round" fill={mood === 'happy' ? 'rgba(107,42,34,0.35)' : 'none'} />
      {(mood === 'worried' || mood === 'disappointed') && <path d="M66 42 q2 4 0 6 q-2 -2 0 -6" fill="#8fc3e8" opacity="0.8" />}
    </svg>
  );
}
