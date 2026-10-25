export type IslandGroup = 'luzara' | 'visara' | 'mindara';

export interface Region {
  id: string;
  name: string;
  islandGroup: IslandGroup;
  center: string;
  population: number; // millions
  note: string;
}

export const ISLAND_GROUPS: Record<IslandGroup, { name: string; description: string }> = {
  luzara: {
    name: 'Luzara',
    description: 'The great northern island. Seat of the capital, the congested heart of commerce and power.',
  },
  visara: {
    name: 'Visara',
    description: 'The scattered central islands. Fishing towns, sugar haciendas, and the path of every typhoon.',
  },
  mindara: {
    name: 'Mindara',
    description: 'The rich, restless south. Mines, plantations, a proud Muslim heritage, and long-running insurgencies.',
  },
};

export const REGIONS: Region[] = [
  { id: 'kalakhang-maynilad', name: 'Kalakhang Maynilad', islandGroup: 'luzara', center: 'Maynilad', population: 14.2, note: 'National capital region. Traffic, towers, and slums in the shadow of the Palasyo.' },
  { id: 'hilagang-luzara', name: 'Hilagang Luzara', islandGroup: 'luzara', center: 'San Fernando del Norte', population: 6.1, note: 'Tobacco country and dynasty strongholds. Votes as one.' },
  { id: 'gitnang-kapatagan', name: 'Gitnang Kapatagan', islandGroup: 'luzara', center: 'Kapatagan City', population: 12.4, note: 'The rice bowl. Farmers, land disputes, and industrial zones creeping outward.' },
  { id: 'bikolandia', name: 'Bikolandia', islandGroup: 'luzara', center: 'Legazpira', population: 6.3, note: 'Volcano and typhoon belt. Fiercely independent-minded voters.' },
  { id: 'kanlurang-visara', name: 'Kanlurang Visara', islandGroup: 'visara', center: 'Iloilanan', population: 7.9, note: 'Sugar haciendas and old landed families.' },
  { id: 'gitnang-visara', name: 'Gitnang Visara', islandGroup: 'visara', center: 'Sugbu City', population: 8.1, note: 'The second economy. Ports, factories, and a rival to Maynilad.' },
  { id: 'silangang-visara', name: 'Silangang Visara', islandGroup: 'visara', center: 'Tacloban Nuevo', population: 4.6, note: 'Poorest of the islands, first to be hit by every storm.' },
  { id: 'hilagang-mindara', name: 'Hilagang Mindara', islandGroup: 'mindara', center: 'Cagayan de Ilog', population: 5.2, note: 'Gateway to the south. Growing fast, unevenly.' },
  { id: 'davira', name: 'Rehiyon ng Davira', islandGroup: 'mindara', center: 'Davira City', population: 5.5, note: 'Southern powerhouse city. Home of the federalist movement.' },
  { id: 'bangsa-lanao', name: 'Bangsa Lanao', islandGroup: 'mindara', center: 'Marawira', population: 4.4, note: 'Autonomous region. Peace deal holds — for now.' },
];
