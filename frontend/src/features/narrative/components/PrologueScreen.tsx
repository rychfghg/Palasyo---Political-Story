import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PROLOGUE } from '@/data/story/prologue';
import { REGIONS } from '@/data/world/regions';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import type { PrologueChoice } from '../types/prologue';
import { fillTokens } from '../utils/text';

export function PrologueScreen() {
  const navigate = useNavigate();
  const { player, chapterIndex, tags, homeRegionId, applyChoice, advanceChapter, setPhase } = useGameStore();
  const setMap = useUiStore((s) => s.setMap);
  const [picked, setPicked] = useState<PrologueChoice | null>(null);

  const chapter = PROLOGUE[chapterIndex];
  const homeGroup = REGIONS.find((r) => r.id === homeRegionId)?.islandGroup ?? null;

  // Zoom the map to the player's home islands during their early life; pull back for the national chapters.
  useEffect(() => {
    if (!chapter) return;
    const national = ['party', 'campaign', 'trial'].includes(chapter.id);
    const group = picked?.effects.homeRegionId ? REGIONS.find((r) => r.id === picked.effects.homeRegionId)?.islandGroup ?? null : homeGroup;
    setMap(!national && group ? group : 'all', group);
  }, [chapter, homeGroup, picked, setMap]);

  if (!player) return <Navigate to="/new" replace />;
  if (!chapter) return <Navigate to="/election" replace />;

  const choices = chapter.choices.filter((c) => !c.requiresAnyTag || c.requiresAnyTag.some((t) => tags.includes(t)));
  const variant = chapter.tagVariants?.find((v) => tags.includes(v.tag));
  const isLast = chapterIndex === PROLOGUE.length - 1;

  const proceed = () => {
    if (!picked) return;
    applyChoice({ chapterId: chapter.id, year: chapter.year, chapterTitle: chapter.title, choiceLabel: picked.label }, picked.effects);
    setPicked(null);
    if (isLast) {
      setPhase('election');
      navigate('/election');
    } else {
      advanceChapter();
    }
  };

  return (
    <section className="story">
      <div className="story__progress" aria-label={`Chapter ${chapterIndex + 1} of ${PROLOGUE.length}`}>
        {PROLOGUE.map((c, i) => (
          <span key={c.id} className={i < chapterIndex ? 'done' : i === chapterIndex ? 'current' : ''} title={`${c.year} · ${c.title}`} />
        ))}
      </div>

      <article className="paper story__card" key={chapter.id}>
        <header className="story__header">
          <span className="story__year">{chapter.year}</span>
          <div>
            <h2>{chapter.title}</h2>
            <p className="kicker">{chapter.subtitle}</p>
          </div>
        </header>

        <div className="story__body">
          {chapter.body.map((p, i) => (
            <p key={i} style={{ animationDelay: `${i * 0.25}s` }}>{fillTokens(p, player)}</p>
          ))}
          {variant && <p className="story__variant">{fillTokens(variant.text, player)}</p>}
        </div>

        {picked ? (
          <div className="story__outcome">
            <p className="story__chosen">▸ {picked.label}</p>
            <p>{fillTokens(picked.outcome, player)}</p>
            <div className="row row--end">
              <button className="btn btn--ghost" onClick={() => setPicked(null)}>Reconsider</button>
              <button className="btn btn--primary" onClick={proceed}>{isLast ? 'Election Day →' : 'Continue →'}</button>
            </div>
          </div>
        ) : (
          <>
            <p className="story__prompt">{chapter.prompt}</p>
            <ul className="choices">
              {choices.map((c) => (
                <li key={c.id}>
                  <button className="choice" onClick={() => setPicked(c)}>
                    <b>{c.label}</b>
                    <span>{c.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </section>
  );
}
