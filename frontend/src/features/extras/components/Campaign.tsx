import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { CAMPAIGN_BUDGET, CAMPAIGN_MESSAGE, campaignDue, campaignPreview, governors, type CampaignBudget, type CampaignMessage } from '@/features/game-engine/engine/world';
import { PROVINCES } from '@/data/world/provinces';
import { ArchipelagoMap, type MapMarker } from '@/features/map/components/ArchipelagoMap';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { useUiStore } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { pressDue, sonaDue } from '@/features/game-engine/engine/extras';

const MAX_STOPS = 4;

/** Before the 2030 midterms and the 2033 race: plan where to campaign, how much to spend, and what to say. */
export function CampaignPlanner() {
  const s = useGameStore() as unknown as CampaignState;
  const campaign = useGameStore((x) => x.campaign);
  const reviewSeen = useUiStore((u) => u.reviewSeen);
  const [stops, setStops] = useState<string[]>([]);
  const [budget, setBudget] = useState<CampaignBudget>('big');
  const [message, setMessage] = useState<CampaignMessage>('economy');
  const [result, setResult] = useState<string[] | null>(null);
  const due = campaignDue(s);
  const reviewPending = !!s.monthReport && s.monthReport.month === s.month - 1 && reviewSeen < s.monthReport.month;
  // Waits for the month summary, the press conference, and the State of the Nation Address.
  if (!result && (!due || s.lastReport || reviewPending || pressDue(s) || sonaDue(s) || s.chapterComplete || s.flags.game_over)) return null;

  const govs = governors(s);
  const toggle = (id: string) => setStops(stops.includes(id) ? stops.filter((x) => x !== id) : stops.length >= MAX_STOPS ? stops : [...stops, id]);
  const markers: MapMarker[] = PROVINCES.map((p, i) => {
    const g = govs.find((x) => x.province === p.id);
    return { id: p.id, x: p.x, y: p.y, label: `${p.name}${stops.includes(p.id) ? ' — campaign stop' : ''}${g ? ` · governor: ${g.stance}` : ''}`, color: stops.includes(p.id) ? '#d6b25e' : g?.stance === 'ally' ? '#8fd19e' : g?.stance === 'opposition' ? '#e0806f' : '#8a95a3', order: i };
  });
  const lift = campaignPreview(s, stops, budget, message);
  const title = due === 'final' ? 'Kampanya 2033 · The race for your successor' : 'Kampanya 2030 · The midterm elections';

  return (
    <Modal title={title} kicker="Campaign headquarters" onClose={() => setResult(null)} closable={!!result} className="campaign-modal">
      {result ? (
        <div>
          <ul>{result.map((l) => <li key={l}>{l}</li>)}</ul>
          <button className="btn btn--primary btn--small" onClick={() => setResult(null)}>Back to the Palasyo</button>
        </div>
      ) : (
        <>
          <p className="muted">{due === 'final' ? 'Your successor’s fate — and your own protection after June 30 — depends on this race.' : 'Twelve Senate seats, the whole House, and every governor are on the ballot.'} Elections are won region by region and class by class.</p>
          <div className="campaign">
            <div className="campaign__map">
              <ArchipelagoMap embedded showLabels={false} markers={markers} onMarkerClick={toggle} />
              <small className="muted">Click provinces to add up to {MAX_STOPS} campaign stops. Allied governors (green) deliver bigger crowds.</small>
            </div>
            <div className="campaign__plan">
              <h4 className="section-title">Stops ({stops.length}/{MAX_STOPS})</h4>
              <div className="sona-grid">
                {PROVINCES.map((p) => (
                  <button key={p.id} className={`pick-chip ${stops.includes(p.id) ? 'is-picked' : ''}`} onClick={() => toggle(p.id)}>{p.name}</button>
                ))}
              </div>
              <h4 className="section-title">Budget</h4>
              <div className="sona-grid">
                {(Object.keys(CAMPAIGN_BUDGET) as CampaignBudget[]).map((b) => (
                  <button key={b} className={`pick-chip ${budget === b ? 'is-picked' : ''}`} onClick={() => setBudget(b)}>{CAMPAIGN_BUDGET[b].label}</button>
                ))}
              </div>
              <h4 className="section-title">Message</h4>
              <div className="sona-grid">
                {(Object.keys(CAMPAIGN_MESSAGE) as CampaignMessage[]).map((m) => (
                  <button key={m} className={`pick-chip ${message === m ? 'is-picked' : ''}`} title={CAMPAIGN_MESSAGE[m].text} onClick={() => setMessage(m)}>{CAMPAIGN_MESSAGE[m].label}</button>
                ))}
              </div>
              <p className="muted">{CAMPAIGN_MESSAGE[message].text}</p>
              <div className="campaign__lift">
                {Object.entries(lift).map(([k, v]) => (
                  <span key={k} className={v > 0.05 ? 'is-good' : v < -0.05 ? 'is-bad' : ''}>{k.replace('class', 'Class ')} {v >= 0 ? '+' : ''}{v.toFixed(1)}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="wizard-foot">
            <span className="muted">Expected poll changes shown above. The campaign is paid from the Treasury.</span>
            <button className="btn btn--primary btn--small" onClick={() => setResult(campaign(stops, budget, message))}>Launch the campaign</button>
          </div>
        </>
      )}
    </Modal>
  );
}
