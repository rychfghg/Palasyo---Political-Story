# Palasyo: A Political Story — Game Design Blueprint

> A Suzerain-inspired, Philippine-inspired political narrative game for the web.
> Fictional republic, fictional people, real constitutional logic (1987 PH Constitution as the model).

---

## 1. Pitch

You are the newly elected President of the **Republika ng Kapuluan** (working name — fictional archipelago republic).
You serve **one six-year term**. You cannot command Congress, the Supreme Court, or independent bodies —
you can only **persuade, negotiate, appoint, sign, veto, and live with the consequences**.

**Design rule #1 (from the reference doc):** the President never automatically gets what they want.
Every institution follows its own powers, incentives, and memory of past choices.

---

## 2. Pillars

| Pillar | Meaning in play |
|---|---|
| **Story first** (Suzerain) | Most play happens in reading and choosing: dialogue, meetings, speeches, news. |
| **Institutions push back** | Congress votes, the Commission on Appointments (CA) confirms, the Judicial and Bar Council (JBC) shortlists, courts rule, the Ombudsman investigates, all independently. |
| **Delayed consequences** | Flags set in Year 1 come back in Year 4. |
| **Pinoy flavor** | Padrino politics, utang na loob, dynasties, party-switching, typhoons, OFWs, pork-barrel, rallies at EDSA-like avenues, teleserye-style drama. |
| **Numbers matter, but don't dominate** | Stats drive which events trigger and how votes land, but the player mostly sees them on a dashboard, not in spreadsheets. |

---

## 3. Core Game Loop

```
 ┌──────────── MONTH / TURN ─────────────┐
 │ 1. Morning Briefing (news, polls, stats)│
 │ 2. Story events (dialogue + choices)    │
 │ 3. Presidential actions (limited AP):   │
 │    appoint · propose bill · sign/veto · │
 │    allocate budget · start project ·    │
 │    meet a character · public address    │
 │ 4. Institutions resolve (votes, rulings,│
 │    hearings, investigations)            │
 │ 5. Consequences → stats, relationships, │
 │    flags → next month's events          │
 └─────────────────────────────────────────┘
```

- **Time unit:** 1 turn = 1 month → 72 turns per full term (some months get skipped or compressed).
- **Political Capital (PC):** the action currency. Earned from approval and coalition strength, spent on pushing bills, whipping votes, and forcing appointments.

---

## 4. Six-Year Campaign (Acts)

| Year | Act | Key content |
|---|---|---|
| 1 | **Unang Isandaang Araw** | Inauguration speech, form the Cabinet (CA hearings), first budget (GAA), coalition building, inherited crisis |
| 2 | **Reporma** | Flagship reform bill, first SC/JBC vacancy, commission appointments, foreign pressure, first scandal |
| 3 | **Midterm** | Midterm elections (House + 12 Senate seats), coalition test, Cabinet reshuffle |
| 4 | **Krisis** | Major crisis (economic, security, or constitutional); impeachment risk peaks |
| 5 | **Pamana** | Legacy projects, succession positioning, allies turn rivals |
| 6 | **Paalam** | Final budget, election season, endorse a successor, transition, possible endgame crisis |

---

## 5. Game Systems (→ frontend `features/`)

| # | System | Feature folder | Core mechanic |
|---|---|---|---|
| 1 | Story engine | `narrative`, `dialogue`, `decisions` | Data-driven event nodes (see §7) |
| 2 | National stats | `stats-dashboard`, `economy` | Approval, GDP, inflation, unemployment, debt, treasury, poverty, stability… |
| 3 | Budget | `budget` | Yearly General Appropriations: allocate ₱ per department → effects; Congress can amend; President can line-item veto |
| 4 | Cabinet | `cabinet` | ~20 secretaries with competence, loyalty, ideology, corruption risk, ambition; meetings, clashes, resignations, leaks |
| 5 | Appointments | `appointments` | Nominate → Commission on Appointments hearing → confirm/reject/bypass; JBC shortlist (3+) → pick a justice |
| 6 | Congress | `congress` | 24 individual Senators; House modeled as **party blocs** + key characters (Speaker, Majority/Minority Leader, committee chairs) |
| 7 | Legislation | `legislation` | Bill → House committee → House vote → Senate committee → Senate vote → bicam → sign/veto → override (2/3) |
| 8 | Supreme Court | `supreme-court` | 15 justices, retire at 70; cases can strike down your actions; appointees stay independent |
| 9 | Impeachment | `impeachment` | Story arc: controversy → House complaint → Articles → Senate trial → 16/24 to convict |
| 10 | Independent bodies | `institutions` | Ombudsman, COA, COMELEC, CSC: investigations, audits, election rulings |
| 11 | Infrastructure | `infrastructure` | Multi-turn projects (bridges, rail, airports, dams) with cost, delays, kickback risk, regional effects |
| 12 | Map / regions | `map` | Regions → provinces: approval, poverty, infra, disasters, governors/dynasties |
| 13 | Public opinion | `polling`, `news-feed` | Surveys by sector/region; newspapers, TV, social media with bias |
| 14 | Diplomacy | `diplomacy` | Fictional neighbors and superpowers, territorial sea dispute, trade deals, OFW crises |
| 15 | Security / emergency | `security` | AFP/PNP confidence, insurgency, calling out the military, martial law with Congress/SC checks |
| 16 | Characters | `characters` | Directory + relationship values + memory of your choices |
| 17 | Timeline | `timeline` | Log of decisions and their consequences |
| 18 | Endings | `endings` | Evaluated at end of term or on removal/resignation |
| 19 | Meta | `main-menu`, `save-load`, `settings` | New game, offline saves, preferences |

---

## 6. State Model (what we track)

**National:** approval, gdpGrowth, inflation, unemployment, debt, treasury, poverty, healthcare, education, security, infrastructure, energy, environment, corruption, militaryReadiness, diplomacy, stability.

**Political:** houseSupport, senateSupport, coalitionCohesion, oppositionStrength, politicalCapital, cabinetCohesion, militaryConfidence, judicialRelation, protestIntensity, mediaClimate.

**Character:** relationship, loyalty, ideology, competence, ambition, integrity, influence, popularity, stress, faction, secrets[], priorities[].

**Flags:** `Record<string, boolean | number | string>`, the long-term memory of every choice (e.g. `appointed_justice_reyes`, `vetoed_rice_tariff_bill`).

---

## 7. Story Engine (data-driven, no hard-coded plot in React)

Every event lives in `src/data/` as typed data:

```ts
interface StoryEvent {
  id: string;                 // "y1_cabinet_finance_hearing"
  trigger: {                  // when it can fire
    minTurn?: number; maxTurn?: number;
    conditions?: Condition[]; // stat/flag/relationship checks
    priority?: number; once?: boolean;
  };
  location: string;           // "Palasyo – Study"
  nodes: DialogueNode[];      // speaker, text, choices
}

interface Choice {
  text: string;
  requires?: Condition[];     // hidden or locked if unmet
  effects: Effect[];          // immediate: stats, relationships, PC
  flags?: Record<string, FlagValue>;
  delayed?: { afterTurns: number; eventId: string }[];
  next?: string;              // next node id, or end
}
```

The engine only interprets conditions and effects. **Adding content means adding data, not changing UI code.**

---

## 8. Endings (evaluated from stats + flags)

- Full term: Beloved Reformer / Builder President / Strongman Legacy / Forgotten President / mixed.
- Impeached and acquitted, then finishes the term (scarred).
- Impeached and removed; the VP takes over.
- Resignation.
- Coalition collapse and paralysis.
- Emergency rule: democracy preserved or damaged.
- Successor wins or loses.
- Epilogue cards: fates of Cabinet members, your justices' later rulings, regions.

---

## 9. Offline-First Saves (sync later)

- **No login now.** Everything runs in the browser.
- **State:** Zustand store per feature, combined into one `GameState`.
- **Persistence:** IndexedDB (via `idb-keyval` or `localforage`) with multiple slots plus an autosave every turn.
- **Abstraction:** all saving goes through a `SaveRepository` interface:
  ```ts
  interface SaveRepository {
    list(): Promise<SaveMeta[]>;
    load(slotId: string): Promise<GameState>;
    save(slotId: string, state: GameState): Promise<void>;
    remove(slotId: string): Promise<void>;
  }
  ```
  Today: `LocalSaveRepository`. Later: `RemoteSaveRepository` (Spring Boot) plus a sync layer, with no changes to game code.
- Each save stores `schemaVersion` so old saves can be migrated.
- Export/import a save as a `.json` file (a useful backup before online sync exists).

---

## 10. MVP Scope (build order)

1. **Engine core:** game store, turn clock, stats, flags, condition/effect interpreter, IndexedDB saves.
2. **Screens:** Main menu → Presidential Office (story view) → Stats dashboard → Save/Load.
3. **Year 1 vertical slice:** inauguration, Cabinet formation with 5 key posts and CA hearings, first budget, one bill through Congress, one crisis (typhoon).
4. **Congress plus legislation** with real vote counting.
5. **Supreme Court / JBC**, then **impeachment arc**, then map, diplomacy, remaining years, endings.

---

## 11. Open Decisions

- Fictional country name (placeholder: *Republika ng Kapuluan*).
- Language mix: English with Filipino/Taglish flavor (recommended) vs full Filipino.
- Fixed president character vs customizable (name, party, background).
- Art style: portrait illustrations + newspaper-style UI (recommended, Suzerain-like).
