import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/components/ui/Modal';

/** The executive offices that live behind one button, so the main tabs stay about the branches of government. */
export const OFFICES = [
  { to: '/office/cabinet', label: 'Cabinet', icon: '🏛', text: 'Your secretaries and advisers, and who is still to be appointed.' },
  { to: '/office/briefing', label: 'Treasury', icon: '💰', text: 'The state of the Treasury and the ledger of every peso spent.' },
  { to: '/office/budget', label: 'Budget', icon: '📑', text: 'The National Expenditure Program and what Congress did to it.' },
  { to: '/office/nation', label: 'Nation & BIR', icon: '🗺', text: 'Taxes, the people, provinces, investments, and the year’s books.' },
  { to: '/office/goccs', label: 'GOCCs', icon: '🏭', text: 'Government corporations: their chiefs, boards, dividends, and troubles.' },
  { to: '/office/laws', label: 'Laws & Projects', icon: '⚖', text: 'Every law you signed and every project being built.' },
  { to: '/office/world', label: 'Foreign Affairs & Provinces', icon: '🌏', text: 'Relations with other countries, and the governors of each province.' },
  { to: '/office/record', label: 'Achievements & History', icon: '🏅', text: 'Badges you have earned, and how the history books are writing your presidency.' },
];

export function OfficesMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = OFFICES.find((o) => pathname.startsWith(o.to));

  return (
    <>
      <button className={`tab tab--offices ${current ? 'is-active' : ''}`} onClick={() => setOpen(true)}>
        {current ? current.label : 'Other offices'} ▾
      </button>
      {open && (
        <Modal title="Mga Tanggapan" kicker="The offices of the executive" onClose={() => setOpen(false)} className="offices-modal">
          <div className="offices-grid">
            {OFFICES.map((o) => (
              <button
                key={o.to}
                className={`office-card ${current?.to === o.to ? 'is-current' : ''}`}
                onClick={() => {
                  setOpen(false);
                  navigate(o.to);
                }}
              >
                <span className="office-card__icon" aria-hidden>{o.icon}</span>
                <b>{o.label}</b>
                <small>{o.text}</small>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
