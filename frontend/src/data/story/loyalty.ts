import type { StoryEvent } from '@/features/narrative/types/event';
import { quick } from './chapter1/helpers';

/**
 * Betrayals. When someone's hidden trust falls too low, they act. Each kind has several copies so
 * it can happen more than once in a term; the engine schedules the next unused one.
 */
const copies = (make: (i: number) => StoryEvent) => [1, 2, 3, 4, 5].map(make);

export const LOYALTY_EVENTS: StoryEvent[] = [
  ...copies((i) =>
    quick(`b_leak_${i}`, null, 'scandal', 'Tumagas', 'Front pages', [
      'A leaked recording from your Cabinet meeting is all over the morning shows. You recognize every word — you said them.',
      'The Palasyo’s own security staff trace the leak to {betrayer}, your {betrayerRole}.',
    ], [
      ['Fire them today', 'Loyalty is not optional.', 'The dismissal is announced before lunch. The rest of the Cabinet gets the message.', { betrayal: 'fire', stats: { cabinetCohesion: -3, media: 2 } }],
      ['Confront them privately and make peace', 'Better inside the tent.', 'A long, tense meeting. They apologize — or pretend to.', { betrayal: 'reconcile', stats: { capital: -3 } }],
      ['Deny the recording is real', 'Call it a deepfake.', 'Forensic experts say it is genuine. The denial becomes the story.', { stats: { media: 6, approval: -3 }, flags: { betrayer_pending: false } }],
    ], { priority: 8 }),
  ),
  ...copies((i) =>
    quick(`b_defect_${i}`, null, 'congress', 'Lumipat ng Panig', 'Senate', [
      '{betrayer} calls a press conference in the Senate lobby. After months of silence, the {betrayerRole} announces they are joining the opposition.',
      'Your political adviser says there may still be time to change their mind — for a price.',
    ], [
      ['Offer projects for their province: ₱5B', 'Everyone has a price.', 'The press conference is postponed “indefinitely”.', { spend: 5, spendLabel: 'Projects to keep a senator', betrayal: 'reconcile', stats: { corruption: 2 } }],
      ['Let them go', 'The door swings both ways.', 'They cross the aisle with a speech about “conscience”.', { betrayal: 'defect', stats: { cohesion: -3 } }],
      ['Threaten to expose their secrets', 'You have files too.', 'They leave anyway — and tell the press you threatened them.', { betrayal: 'defect', stats: { media: 5, cohesion: -2, ombudsman: 3 } }],
    ], { priority: 8 }),
  ),
  ...copies((i) =>
    quick(`b_testify_${i}`, null, 'scandal', 'Ang Saksi', 'Office of the Ombudsman', [
      '{betrayer}, your {betrayerRole}, has quietly met the Ombudsman three times. Your legal counsel believes they have agreed to testify about decisions made in the Palasyo.',
    ], [
      ['Fire them and question their credibility', 'Hit first.', 'The testimony goes ahead anyway — from a bitter ex-official.', { betrayal: 'fire', stats: { ombudsman: 6, media: 4 } }],
      ['Cooperate with the investigators', 'Nothing to hide.', 'Your openness blunts the story. They leave the Cabinet quietly.', { betrayal: 'fire', stats: { ombudsman: 2, corruption: -2, approval: 1 } }],
      ['Negotiate their silence', 'An ambassadorship, perhaps.', 'They accept a post abroad. The Ombudsman takes note of the timing.', { betrayal: 'reconcile', spend: 2, spendLabel: 'Ambassadorial posting', stats: { corruption: 4, ombudsman: 4 }, flags: { obstruction: true } }],
    ], { priority: 8 }),
  ),
];
