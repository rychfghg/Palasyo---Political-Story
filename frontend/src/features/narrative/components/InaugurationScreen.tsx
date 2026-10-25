import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore, fullName } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { COUNTRY, TIMELINE } from '@/shared/constants/world';

export function InaugurationScreen() {
  const navigate = useNavigate();
  const { player, setPhase, initPresidency } = useGameStore();
  const setMap = useUiStore((s) => s.setMap);
  const [sworn, setSworn] = useState(false);

  useEffect(() => setMap('luzara', 'luzara'), [setMap]);

  if (!player) return <Navigate to="/" replace />;

  const name = fullName(player);

  return (
    <section className="center-stage">
      <article className="paper inauguration">
        <p className="kicker">Liwasang Bayani, {COUNTRY.capital} · {TIMELINE.inaugurationDate} · 12:00 NN</p>
        <h2 className="paper__title">Ang Panunumpa</h2>
        <p className="paper__subtitle">The Oath of Office</p>

        <p>
          A hundred thousand people fill the park under a white-hot sky. Outgoing President {TIMELINE.outgoingPresident} sits in the front row,
          smiling for the cameras. The Chief Justice raises the Bible. You raise your right hand.
        </p>

        <blockquote className="oath">
          “Ako, si {name}, ay taimtim na nanunumpa na tutuparin ko nang buong katapatan at sigasig ang aking mga tungkulin bilang Pangulo ng{' '}
          {COUNTRY.name}, pangangalagaan at ipagtatanggol ang kanyang Konstitusyon, ipatutupad ang mga batas nito, magiging makatarungan sa
          bawat tao, at itatalaga ang aking sarili sa paglilingkod sa Bansa. Kasihan nawa ako ng Diyos.”
        </blockquote>

        {sworn ? (
          <div className="story__outcome">
            <p>
              The cannons fire twenty-one times. The crowd roars your name. For six years — not one day more — the Republic is yours to steer
              and yours to answer for.
            </p>
            <p className="headline">Mabuhay ang Pangulo {player.lastName}!</p>
            <div className="row row--end">
              <button
                className="btn btn--primary"
                onClick={() => {
                  setPhase('presidency');
                  initPresidency();
                  navigate('/office');
                }}
              >
                Enter the {COUNTRY.palace} →
              </button>
            </div>
          </div>
        ) : (
          <div className="row row--end">
            <button className="btn btn--primary" onClick={() => setSworn(true)}>Take the oath</button>
          </div>
        )}
      </article>
    </section>
  );
}
