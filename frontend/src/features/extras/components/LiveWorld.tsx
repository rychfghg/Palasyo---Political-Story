import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { EVENTS_BY_ID } from '@/data/story';
import { PROVINCES } from '@/data/world/provinces';
import { ArchipelagoMap, type MapMarker } from '@/features/map/components/ArchipelagoMap';
import { fill, tokens } from '@/features/game-engine/engine/engine';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { seededRandom } from '@/features/game-engine/utils/random';

const current = (s: CampaignState) => (s.queue[0] ? EVENTS_BY_ID[s.queue[0]] : undefined);

/** True while the country is in a crisis or calamity: the screen tints and the music darkens. */
export function useCrisis() {
  const s = useGameStore() as unknown as CampaignState;
  const e = current(s);
  return !!e && (e.category === 'crisis' || e.category === 'calamity') && !s.lastReport;
}

// ───────────────────────── Social media trends ─────────────────────────

/** What the country is posting about this month. */
export function SocialTrends() {
  const s = useGameStore() as unknown as CampaignState;
  if (!s.economy || !s.player) return null;
  const last = s.player.lastName.replace(/\s+/g, '');
  const e = s.economy;
  const r = seededRandom(`${last}:trends:${s.month}`);
  const t = tokens(s);
  const tags: { tag: string; good: boolean; posts: number }[] = [];
  const top = [...(s.lastMonthLog ?? [])].sort((a, b) => b.weight - a.weight)[0];
  if (top) {
    const word = fill(top.title, t).split(/[\s:·]+/).filter((w) => w.length > 3)[0] ?? 'Palasyo';
    tags.push({ tag: `#${word.replace(/[^A-Za-zÀ-ÿ0-9]/g, '')}`, good: top.approval >= 0, posts: 0 });
  }
  if (e.approval >= 60) tags.push({ tag: `#Mabuhay${last}`, good: true, posts: 0 });
  if (e.approval < 35) tags.push({ tag: `#${last}Resign`, good: false, posts: 0 });
  if (e.inflation > 4.5) tags.push({ tag: '#PresyoNgBigas', good: false, posts: 0 });
  if (s.politics.corruption > 60) tags.push({ tag: '#NasaanAngPera', good: false, posts: 0 });
  if (s.politics.sovereignty > 70) tags.push({ tag: '#AtinAngWestSea', good: false, posts: 0 });
  if (s.flags.troll_army) tags.push({ tag: `#Tatag${last}`, good: true, posts: 0 });
  if ((s.economy.growth ?? 5) > 6) tags.push({ tag: '#BoomKapuluan', good: true, posts: 0 });
  if (s.politics.protest > 55) tags.push({ tag: '#Mendiola', good: false, posts: 0 });
  tags.push({ tag: '#KapuluanUpdates', good: true, posts: 0 });
  const list = tags.slice(0, 5).map((x, i) => ({ ...x, posts: Math.round((180 - i * 30) * (0.6 + r() * 0.8) * (s.flags.troll_army && x.good ? 2.2 : 1)) }));
  const mood = list.reduce((n, x) => n + (x.good ? x.posts : -x.posts), 0);

  return (
    <section className="card trends">
      <h3 className="section-title">Trending sa Kapuluan</h3>
      <ol>
        {list.map((x, i) => (
          <li key={x.tag} className={x.good ? 'is-good' : 'is-bad'}>
            <span className="trends__rank">{i + 1}</span>
            <b>{x.tag}</b>
            <small>{x.posts}K posts</small>
          </li>
        ))}
      </ol>
      <p className={`trends__mood ${mood >= 0 ? 'is-good' : 'is-bad'}`}>Online mood: {mood >= 0 ? 'mostly on your side' : 'turning against you'}{s.flags.troll_army ? ' · boosted by paid accounts' : ''}</p>
    </section>
  );
}

// ───────────────────────── Situation map ─────────────────────────

/** A live map: storms crossing the islands, protests in the cities, and new projects lighting up. */
export function SituationMap() {
  const s = useGameStore() as unknown as CampaignState;
  const e = current(s);
  const storm = !!e && e.category === 'calamity';
  const markers: MapMarker[] = [];
  let order = 0;
  const near = (id: string) => PROVINCES.find((p) => p.id === id);
  for (const a of s.assets ?? []) {
    if (a.failed || a.startedMonth > s.month || a.startedMonth < s.month - 3) continue;
    const p = near(a.province);
    if (p) markers.push({ id: `new-${a.id}`, x: p.x, y: p.y, label: `Now open: ${a.name}`, color: '#d6b25e', order: order++ });
  }
  if (s.politics.protest > 45) {
    for (const id of ['maynilad', 'sugbu', 'marawira'].slice(0, s.politics.protest > 65 ? 3 : 1)) {
      const p = near(id);
      if (p) markers.push({ id: `protest-${id}`, x: p.x + 1.5, y: p.y - 1.5, label: `Protests in ${p.name}`, color: '#e0806f', order: order++ });
    }
  }
  for (const g of s.governors ?? []) {
    if (g.stance !== 'opposition') continue;
    const p = near(g.province);
    if (p) markers.push({ id: `gov-${g.province}`, x: p.x - 1.5, y: p.y + 1.5, label: `${g.name} (opposition governor)`, color: '#8a95a3', order: order++ });
  }
  return (
    <section className="card situation">
      <h3 className="section-title">Situation map</h3>
      <div className="situation__map">
        <ArchipelagoMap embedded showLabels={false} markers={markers} />
        {storm && <div className="situation__storm" aria-label="A storm crossing the islands">🌀</div>}
        {s.politics.protest > 45 && <div className="situation__pulse" />}
      </div>
      <div className="situation__legend">
        <span><i style={{ background: '#d6b25e' }} /> New projects</span>
        <span><i style={{ background: '#e0806f' }} /> Protests</span>
        <span><i style={{ background: '#8a95a3' }} /> Opposition governors</span>
        {storm && <span>🌀 Storm</span>}
      </div>
    </section>
  );
}

// ───────────────────────── Sound and mood ─────────────────────────

/**
 * A soft ambient pad generated in the browser (no files): calm in the office, darker and pulsing
 * in a crisis. Off until the player turns it on.
 */
export function AmbientSound() {
  const crisis = useCrisis();
  const [on, setOn] = useState(() => {
    try { return localStorage.getItem('palasyo-sound') === 'on'; } catch { return false; }
  });
  const ctxRef = useRef<{ ctx: AudioContext; oscs: OscillatorNode[]; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null>(null);

  useEffect(() => {
    try { localStorage.setItem('palasyo-sound', on ? 'on' : 'off'); } catch { /* storage unavailable */ }
    if (!on) {
      ctxRef.current?.ctx.close();
      ctxRef.current = null;
      return;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.connect(gain).connect(ctx.destination);
    const oscs = [0, 1, 2].map((i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sine' : 'triangle';
      o.connect(filter);
      o.start();
      return o;
    });
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.015;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    ctxRef.current = { ctx, oscs, gain, lfo, lfoGain };
    return () => {
      ctx.close();
      ctxRef.current = null;
    };
  }, [on]);

  useEffect(() => {
    const a = ctxRef.current;
    if (!a) return;
    const now = a.ctx.currentTime;
    // Calm: a warm major chord. Crisis: a low minor chord with a faster, deeper pulse.
    const chord = crisis ? [110, 130.81, 164.81] : [130.81, 164.81, 196];
    a.oscs.forEach((o, i) => o.frequency.setTargetAtTime(chord[i], now, 0.8));
    a.lfo.frequency.setTargetAtTime(crisis ? 1.4 : 0.08, now, 0.5);
    a.lfoGain.gain.setTargetAtTime(crisis ? 0.025 : 0.015, now, 0.5);
  }, [crisis, on]);

  return (
    <button className={`sidenav__btn sound-nav ${on ? 'is-active' : ''}`} onClick={() => setOn(!on)} aria-label={on ? 'Turn sound off' : 'Turn sound on'} title={on ? 'Sound on' : 'Sound off'}>
      <span className="phone-nav__icon" aria-hidden>{on ? '🔊' : '🔇'}</span>
      <span>Sound</span>
    </button>
  );
}

/** A red vignette over the desk during crises. */
export function CrisisTint() {
  const crisis = useCrisis();
  return <div className={`crisis-tint ${crisis ? 'is-on' : ''}`} aria-hidden />;
}
