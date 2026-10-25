# Palasyo: A Political Story

*Anim na taon. Isang bayan. Bawat desisyon ay may kapalit.*
*Six years. One nation. Every decision has a price.*

**Palasyo** is a narrative political strategy game inspired by Philippine politics and by games like *Suzerain*. You play the newly elected President of the **Republika ng Kapuluan**, a fictional island republic, from inauguration in 2027 to the end of your term in 2033 — and beyond.

Every month brings a desk full of decisions: budgets, bills, scandals, typhoons, foreign powers, family crises, and people who want something from you. Every choice moves the economy, Congress, the courts, the streets, and your own family — and the consequences can come back months or years later.

> A work of fiction. All people, parties, places, and organizations are invented, inspired by — not depicting — the Philippines.

---

## Table of contents

- [Quick start](#quick-start)
- [How to play](#how-to-play)
- [Features](#features)
- [How the game works](#how-the-game-works)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Saving and loading](#saving-and-loading)
- [Adding content](#adding-content)
- [Scripts](#scripts)
- [Roadmap](#roadmap)

---

## Quick start

**Requirements:** [Node.js](https://nodejs.org) 18 or newer (20+ recommended) and npm.

```bash
git clone https://github.com/rychfghg/Palasyo---Political-Story.git
cd Palasyo---Political-Story/frontend
npm install
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`). Stop the server with **Ctrl + C**.

To build a production version:

```bash
npm run build
npm run preview
```

The game runs entirely in the browser. No server, account, or internet connection is needed to play.

---

## How to play

1. **New Game** — fill in your birth certificate (name, title, nickname) and choose a difficulty:
   - **Honeymoon** — healthier Treasury, friendlier Congress, a public that wants you to win.
   - **Normal** — the Republic as the previous administration left it: growing, indebted, restless.
   - **Crisis Republic** — debt near 75% of GDP, a weak peso, high inflation, and a hostile Senate.
2. **Prologue** — live your life from 1983 to the 2027 election: education, career, party, home region.
3. **Inauguration** — take the oath, then form your Cabinet and draft your first national budget.
4. **The Agenda** — each month, matters land on your desk. Read them, choose, and live with the result.
5. **End the month** — the economy moves, the papers report on you, and the next month begins.
6. **Survive six years** — or don't. Impeachment, People Power, a coup, a revolt, or resignation can end your presidency early.
7. **After the Palasyo** — run for the Senate or House, face the courts, or go home. Then play **Chapter 3** as your heir.

---

## Features

### The presidency
- **Two full chapters** — *Ang Mabigat na Korona* (2027–2030) and *Pamana at Paghuhukom* (2030–2033), with 900+ story events, chained storylines, and choices that come back years later.
- **Cabinet room** — appoint 17 secretaries and 5 presidential advisers in a step-by-step pop-up. Department secretaries face the **Commission on Appointments**. Fired or resigned officials are replaced with newly generated candidates.
- **Adviser reactions** — after every decision, advisers with a strong view react in person (pleased, relieved, worried, disappointed, upset). If most of them think it's a mistake, you can **reconsider once**.
- **Generated portraits** — every official, justice, senator, governor, and family member has a unique face drawn from their name, with moods.

### Branches of government
- **Congress** — a session hall with the Speaker's rostrum, majority and minority benches, leadership, and a party roll board. Bills face real roll-call votes.
- **Bill drafting** — for major laws (tax reform, minimum wage, anti-dynasty, universal health care) you set each detail on a drafting table and watch the expected House and Senate votes change before sending it.
- **Senate** — 24 senators with portraits, blocs, influence, and temperament. 13 votes pass a bill; 16 convict or ratify. Midterm elections in 2030.
- **Supreme Court** — the bench with the Chief Justice at the center and 14 associate justices by seniority. Independent rulings on your laws and orders; Judicial and Bar Council shortlists for vacancies.
- **Congressional hearings** — Blue Ribbon and House inquiries: testify, invoke executive privilege, or offer up a scapegoat.

### The economy
- **Realistic finances** — revenue, spending, borrowing, interest, a monthly **debt installment** paid from taxes, and a **debt tally** that adds up to the peso.
- **Bangko Sentral** — an independent central bank with a governor and Monetary Board. It sets interest rates by inflation and growth, defends the peso with reserves, and advises you on the most pressing problem. A weaker peso raises inflation and the foreign-currency debt.
- **Inflation that behaves like the real thing** — driven by unemployment, growth, debt, deficits, the peso, and random oil, harvest, and weather shocks.
- **Income-earning investments** — airports, ports, toll roads, economic zones, power plants, and more, proposed by Cabinet members, governors, tycoons, and allied governments. They take time to build, can run into trouble, and can fail.
- **Government corporations (GOCCs)** — power, ports, and gaming corporations run by holdover chiefs you can only replace after a proven fault; new corporations need a charter from Congress.
- **Foreign companies** — global firms pitch you directly; your terms and your record decide whether they come.
- **What the country lacks** — roads, hospitals, classrooms, power, water, internet, and housing. Coverage wears down; planning meetings and shortages decide what you build.
- **The year's books** — a live ledger of income, spending, borrowing, and investment earnings.

### Politics and people
- **Polls by region and class** — approval in Luzara, Visara, and Mindara, and among classes A–B to E. Elections weigh them by turnout.
- **Hidden loyalty** — every Cabinet member and allied senator has a trust score you never see. Hints warn you; low trust leads to leaks, defections, or testimony against you.
- **Governors** — allies speed up projects in their provinces; opponents slow them down. Local elections in 2030 and 2033.
- **Foreign relations** — Haizhou, Columbia, Nippara, Qadir, and the regional bloc, each tracked separately and shaped by summits.
- **Family storylines** — your son's crash, your sister's governorship, your spouse's foundation, your daughter's activism, threats, illness, and reconciliation.
- **Enemies** — plunder complaints, disbarments, international court complaints, deepfakes, tell-all books, documentaries, and whistleblowers.

### Twists and crises
- **Coup attempt** — if the military turns, a night of decisions at 3 a.m.
- **The hidden recording** — a bug in the Cabinet Room, and blackmail that quotes your actual worst decision.
- **Secret illness** — disclose, hide, or delay; a collapse on live TV.
- **A spy in the Cabinet** — find the right suspect among three.
- **Party split** — your coalition breaks apart.
- **Revolt** — if inflation and debt won't come down, rallies grow until crowds storm the Palasyo, and you must **declare martial law or step down**.

### Media and voice
- **Phone** — texts from the Speaker, governors, tycoons, ambassadors, and your family. Some expire with consequences. The phone appears in the side bar only when someone is waiting for a reply.
- **Newspapers** — each month, two rival front pages (*Pahayagang Liwayway* and *Tinig ng Bayan*) cover your biggest decision, with a political cartoon.
- **Press conferences** — every quarter: answer honestly, dodge, attack the reporter, or risk a joke.
- **State of the Nation Address** — every July: choose claims (fact-checked), promises (checked a year later), and who to blame.
- **Social media trends** — trending hashtags react to your decisions.

### Guidance and insight
- **Tutorial** — a guided tour on your first visit to the desk, and hover tips on every number in the header.
- **Month summary** — one screen at the end of each month: both newspapers, the economy, the Bangko Sentral, new texts, achievements, promises, warnings, and who is drifting away from you.
- **Statistics** — charts of approval, inflation, unemployment, debt, the peso, growth, and regional polls across your whole term, with markers on headline decisions.
- **Cabinet meetings as scenes** — your secretaries argue around the table, each for one option. The one you back trusts you more; those you pass over remember.
- **Day One checklist** — your first day is one checklist (form the Cabinet, draft the budget, start governing) instead of a chain of pop-ups.
- **Consequence hints** — every choice lists what it touches ("Affects: prices, approval, the Treasury") without giving away the amounts.
- **Coming up** — a card beside the Agenda lists projects about to open, promises falling due, elections, the next SONA and press conference, and how many consequences are still brewing.
- **Difficulty badge** — the difficulty you chose is shown under your name.
- **Election campaigns** — before the 2030 midterms and the 2033 race, choose up to four provinces on the map, a budget, and a message, and see the expected poll gains before launching.

### Atmosphere
- **Situation map** — storms crossing the islands, protests, opposition governors, and newly opened projects.
- **Ambient sound** — a generated soundtrack that darkens during crises (off by default).
- **Crisis mood** — a red tint over the screen during emergencies.
- **Sound effects** — a gavel for votes, camera shutters before press conferences, a phone buzz for new texts, and crowd noise at protests (only when sound is on).
- **Distinct endings** — prison, exile, pardon, the Senate, a quiet retirement, beloved statesman, martial-law ruler, impeachment, resignation, People Power, or a coup, each with its own emblem and colors.

### Accessibility
- **Keyboard** — press 1–4 to pick a choice on the Agenda.
- **Larger text** and a **colorblind-safe palette** (blue for good, orange for bad) in Settings.
- **Mobile layout** — on phones the side bar becomes a bottom bar, the header and tabs scroll sideways, and pop-ups open as full-width sheets.

### After the presidency
- **Your own race** — run for the Senate or House, take your seat, and choose what kind of legislator to be — or face charges, exile, a pardon, or a plea deal.
- **Endings** — a full epilogue, a history-book chapter on your presidency, and a play-again / exit pop-up.
- **Achievements** — 18 badges, from *Debt Slayer* to *Survived a Coup*.
- **Chapter 3: The Next Generation** — choose an heir (Bea, Migo, or Tessa) and run for the Senate in 2036 and the presidency in 2039. Your record decides where they start.

---

## How the game works

### The monthly loop
1. **The desk fills.** The engine picks the month's matters from all story events: those scheduled for this month, follow-ups from earlier choices, and anything triggered by conditions (stats, flags, past decisions). Up to 9 matters appear each month; older waiting matters climb the queue, and ordinary ones that wait too long lapse.
2. **You decide.** Each choice applies **effects**: stats, spending, taxes, laws, votes, appointments, investments, relations, and flags that unlock later events.
3. **The month ends.** The engine runs the economy (revenue, spending, debt installment, interest, borrowing), inflation, growth, approval, the central bank, the peso, GOCC dividends, investment risks, polls, loyalty, phone messages, promises, local elections, achievements, and the crisis clock.
4. **The papers report.** The front page shows your biggest decision; the State of the Nation Address and press conferences arrive on schedule.

### Story events
Events are plain data in `frontend/src/data/story/`. Each has a title, location, body text with `{placeholders}` (names like `{speaker}`, `{sec:finance}`, `{vp}`), conditions, and choices. Each choice has an outcome and **effects**. Events can schedule follow-ups, appear only under certain conditions, or open the drafting table.

### Randomness
Randomness is **seeded by your name**, so the same save always plays out consistently, while different presidents get different Congresses, candidates, crises, and outcomes.

### Saving
The entire game state is a single object saved automatically to the browser's local storage, compressed (about 4–6× smaller) and written half a second after the last change, or immediately when the page is closed or hidden. If storage runs low, older history (ledger, news, texts) is trimmed; if saving still fails, a warning appears.

---

## Project structure

```
Palasyo - A Political Story/
├── frontend/                  React + TypeScript + Vite game (everything playable)
│   └── src/
│       ├── app/               Router, global UI store, styles
│       ├── data/
│       │   ├── story/         All story events (chapters, twists, family, messages, …)
│       │   ├── government/    Cabinet, Congress, Supreme Court, economy data
│       │   └── world/         Parties, regions, provinces, companies
│       ├── features/
│       │   ├── game-engine/   Engine: events, economy, institutions, society, world, legacy
│       │   ├── narrative/     Agenda, prologue, newspapers, endings
│       │   ├── cabinet/       Cabinet room and appointment pop-up
│       │   ├── congress/      House and Senate
│       │   ├── supreme-court/ The Court
│       │   ├── economy/       Treasury, Nation & BIR, warnings, header
│       │   ├── institutions/  Bangko Sentral, GOCCs, adviser reactions
│       │   ├── extras/        Phone, press, SONA, drafting, map, sound, achievements, Chapter 3
│       │   └── …              Budget, laws, map, settings, main menu
│       ├── pages/             The President's office layout
│       └── shared/            Reusable UI (modal, portraits, icons)
├── backend/                   Spring Boot placeholder for future online saves (not used yet)
└── docs/                      Game design document
```

---

## Tech stack

| Part | Technology |
|---|---|
| UI | React 19, TypeScript 5.8 |
| Build | Vite 6 |
| Routing | React Router 7 |
| State and saves | Zustand 5 with `persist` (browser local storage) |
| Graphics | SVG (map, portraits, charts) and CSS animations |
| Sound | Web Audio API (generated, no audio files) |
| Backend | Spring Boot — planned, not yet connected |

---

## Saving and loading

- **Autosave** — every change is saved automatically in your browser, compressed so long games fit.
- **Three save slots** — on the main menu and in Settings: save, load, or delete.
- **Export** — Settings → *Export save (.json)* downloads your game.
- Saves live in the browser you played in; clearing site data deletes them. Online saves are planned for later.

---

## Adding content

New events go in `frontend/src/data/story/`. A minimal event using the `quick` helper:

```ts
quick('my_event', [10, 20], 'economy', 'Title', 'Location', 'What happens. {sec:finance} weighs in.', [
  ['Choice label', 'Short description', 'What happened after.', { spend: 5, spendLabel: 'My program', stats: { approval: 2 } }],
  ['Another choice', 'Description', 'Outcome.', { stats: { investor: 3 } }],
]),
```

- `[10, 20]` — the event appears in a random month between 10 and 20 (month 0 = July 2027). Use `null` for follow-ups that only arrive via `then('my_event', 3)`.
- Common effects: `stats`, `spend`, `income`, `taxRate`, `debt`, `law`, `vote`, `asset` (income-earning investment), `need` (roads, schools…), `relations`, `flags`, `schedule`.
- Register new event arrays in `frontend/src/data/story/index.ts`.

---

## Scripts

Run inside `frontend/`:

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (first time) |
| `npm run dev` | Start the game for development |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Check TypeScript without building |
| `npm test` | Run the automated tests: save compression, story-data integrity, and a full playthrough on each difficulty |

---

## Roadmap

- [ ] Online accounts and cloud saves with the Spring Boot backend
- [ ] Mobile layout and accessibility options
- [ ] More endings: a martial-law regime branch and an exile chapter

---

*Palasyo: A Political Story* — a work of fiction inspired by Philippine politics.
