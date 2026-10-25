import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_SETTINGS, useGameStore, type Difficulty } from '@/features/game-engine/store/gameStore';
import type { Honorific } from '@/features/game-engine/types/player';
import { COUNTRY } from '@/shared/constants/world';

const HONORIFICS: { value: Honorific; label: string }[] = [
  { value: 'Ginoong', label: 'Ginoong (Mr.)' },
  { value: 'Ginang', label: 'Ginang (Mrs.)' },
  { value: 'Binibining', label: 'Binibining (Ms.)' },
];

const cleanName = (s: string) => s.replace(/\s+/g, ' ').trim().slice(0, 30);

export function NameEntry() {
  const navigate = useNavigate();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [honorific, setHonorific] = useState<Honorific>('Ginoong');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [touched, setTouched] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const valid = cleanName(firstName).length > 0 && cleanName(lastName).length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    startNewGame({ honorific, firstName: cleanName(firstName), lastName: cleanName(lastName), nickname: cleanName(nickname) }, difficulty);
    navigate('/prologue');
  };

  return (
    <section className="center-stage">
      <form className="paper form" onSubmit={submit} noValidate>
        <p className="kicker">{COUNTRY.name}</p>
        <h2 className="paper__title">Sertipiko ng Kapanganakan</h2>
        <p className="paper__subtitle">Certificate of Live Birth · 1983</p>

        <p className="paper__intro">
          Every president was once a child with a name. Before the campaigns, the coalitions, and the Palasyo — tell us who you are.
        </p>

        <label className="field">
          <span>Title</span>
          <select value={honorific} onChange={(e) => setHonorific(e.target.value as Honorific)}>
            {HONORIFICS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </label>

        <div className="field-row">
          <label className="field">
            <span>First name · Pangalan</span>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus maxLength={30} placeholder="e.g. Andres" />
          </label>
          <label className="field">
            <span>Surname · Apelyido</span>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={30} placeholder="e.g. Villanueva" />
          </label>
        </div>

        <label className="field">
          <span>Nickname · Palayaw (optional)</span>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={30} placeholder="e.g. Andoy — what the crowds will chant" />
        </label>

        <fieldset className="difficulty">
          <legend>Difficulty · The Republic you inherit</legend>
          <div className="difficulty__cards">
            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => (
              <label key={d} className={`difficulty__card ${difficulty === d ? 'is-picked' : ''} is-${d}`}>
                <input type="radio" name="difficulty" value={d} checked={difficulty === d} onChange={() => setDifficulty(d)} />
                <b>{DIFFICULTY_SETTINGS[d].label}</b>
                <small>{DIFFICULTY_SETTINGS[d].text}</small>
              </label>
            ))}
          </div>
        </fieldset>

        {touched && !valid && <p className="form__error">Please enter both a first name and a surname.</p>}

        <div className="row row--end">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>Back</button>
          <button type="submit" className="btn btn--primary">Begin your story</button>
        </div>
      </form>
    </section>
  );
}
