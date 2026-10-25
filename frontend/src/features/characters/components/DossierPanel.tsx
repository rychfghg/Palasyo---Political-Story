import { useGameStore, fullName } from '@/features/game-engine/store/gameStore';
import { TRAIT_LABELS, type TraitKey } from '@/features/game-engine/types/player';
import { getParty } from '@/data/world/parties';
import { REGIONS } from '@/data/world/regions';
import { IdeologyCompass } from './IdeologyCompass';

export function DossierPanel() {
  const { player, traits, ideology, lifeEvents, partyId, homeRegionId, platform } = useGameStore();

  if (!player) {
    return <p className="lede">No file yet. Start a new game and your life will be recorded here.</p>;
  }

  const party = getParty(partyId);
  const region = REGIONS.find((r) => r.id === homeRegionId);

  return (
    <div className="stack">
      <section className="dossier-id">
        <div className="dossier-id__photo">{player.firstName[0]}{player.lastName[0]}</div>
        <div>
          <h3>{fullName(player)}</h3>
          {player.nickname && <p className="muted">“{player.nickname}”</p>}
          <p className="muted">
            {region ? `From ${region.name}` : 'Origin unknown'}
            {party ? ` · ${party.abbreviation}` : ''}
            {platform ? ` · ${platform}` : ''}
          </p>
        </div>
      </section>

      <section>
        <h3 className="section-title">Traits</h3>
        <div className="traits">
          {(Object.keys(TRAIT_LABELS) as TraitKey[]).map((k) => (
            <div key={k} className="trait">
              <span>{TRAIT_LABELS[k]}</span>
              <div className="trait__bar"><i style={{ width: `${traits[k] * 10}%` }} /></div>
              <b>{traits[k]}</b>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-title">Ideology</h3>
        <IdeologyCompass economic={ideology.economic} social={ideology.social} />
      </section>

      <section>
        <h3 className="section-title">Timeline</h3>
        {lifeEvents.length === 0 ? (
          <p className="muted">Your story has not yet begun.</p>
        ) : (
          <ol className="timeline">
            {lifeEvents.map((e) => (
              <li key={e.chapterId}>
                <span className="timeline__year">{e.year}</span>
                <div>
                  <b>{e.chapterTitle}</b>
                  <p>{e.choiceLabel}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
