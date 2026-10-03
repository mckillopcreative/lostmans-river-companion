// Typed access to /data/*.json. All site content flows through here (CLAUDE.md ground rule).
import chaptersJson from '@data/chapters.json';
import charactersJson from '@data/characters.json';
import fishJson from '@data/fish.json';
import wildlifeJson from '@data/wildlife.json';
import boatsJson from '@data/boats.json';
import gearJson from '@data/gear.json';
import placesJson from '@data/places.json';
import routesJson from '@data/routes.json';
import quotesJson from '@data/quotes.json';
import todoJson from '@data/todo.json';
import glossaryJson from '@data/glossary.json';
import recipesJson from '@data/recipes.json';
import sketchesJson from '@data/sketches.json';

export interface Chapter {
  n: number;
  slug: string;
  title: string;
  summary: string;
  places: string[];
  fish: string[];
  wildlife: string[];
  characters: string[];
  boats: string[];
  gear: string[];
  word_of_day: string[];
  sketch: string | null;
}
export interface Character {
  id: string;
  name: string;
  role: string;
  age?: string;
  from?: string;
  description: string;
  traits?: string[];
  sayings?: string[];
  first_chapter: number;
  sketch: string | null;
}
export interface Fish {
  id: string;
  common: string;
  scientific: string;
  in_book: string;
  how_matt_fishes_it?: string;
  identify?: string;
  typical_size?: string;
  habitat?: string;
  regulation_note?: string;
  conservation?: string;
  chapters: number[];
  sketch: string | null;
}
export interface Wildlife {
  id: string;
  name: string;
  scientific: string | null;
  in_book?: string;
  facts?: string[];
  chapters: number[];
  sketch: string | null;
}
export interface Boat {
  id: string;
  name: string;
  type: string | null;
  owner?: string;
  in_book: string;
  facts?: string[];
  chapters: number[];
  sketch: string | null;
}
export interface Gear {
  id: string;
  term: string;
  definition: string;
  chapter: number;
  group: GearGroup;
}
export type GearGroup = 'lures-bait' | 'line-rigging' | 'techniques' | 'reading-the-water' | 'boat-safety';
export const gearGroups: Record<GearGroup, string> = {
  'lures-bait': 'Lures & bait',
  'line-rigging': 'Line & rigging',
  techniques: 'Techniques',
  'reading-the-water': 'Reading the water',
  'boat-safety': 'Boat & safety',
};
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  in_book: string;
}
export interface Route {
  chapter: number;
  label: string;
  waypoints: string[];
  mode: 'boat' | 'road' | 'air';
}
export interface Quote {
  who: string;
  text: string;
  chapter: number;
}
export interface Todo {
  item: string;
  chapter_added: number;
  chapter_checked: number | null;
}
export interface GlossaryWord {
  word: string;
  definition: string;
  chapter: number;
}
export interface Recipe {
  name: string;
  chapter: number;
  note: string;
}
export interface Sketch {
  file: string;
  subject: string;
  chapters: number[];
  also_used?: string;
  artist: string;
}

export const chapters = chaptersJson as Chapter[];
export const characters = charactersJson as Character[];
export const fish = fishJson as Fish[];
export const wildlife = wildlifeJson as Wildlife[];
export const boats = boatsJson as Boat[];
export const gear = gearJson as Gear[];
export const places = placesJson as Place[];
export const routes = routesJson as Route[];
export const quotes = quotesJson as Quote[];
export const todo = todoJson as Todo[];
export const glossary = glossaryJson as GlossaryWord[];
export const recipes = recipesJson as Recipe[];
export const sketches = sketchesJson as Sketch[];

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((e) => [e.id, e]));
export const characterById = byId(characters);
export const fishById = byId(fish);
export const wildlifeById = byId(wildlife);
export const boatById = byId(boats);
export const gearById = byId(gear);
export const placeById = byId(places);
export const chapterByN = new Map(chapters.map((c) => [c.n, c]));
export const sketchByFile = new Map(sketches.map((s) => [s.file, s]));
export const routeByChapter = new Map(routes.map((r) => [r.chapter, r]));
export const glossaryByWord = new Map(glossary.map((g) => [g.word, g]));

/** The four "entity" sections that share the card/detail components. */
export type Section = 'fish' | 'crew' | 'critters' | 'boats';

export interface CardModel {
  section: Section;
  id: string;
  title: string;
  hook: string;
  chapters: number[];
  sketch: string | null;
}

const clip = (s: string | undefined, n = 110) => {
  if (!s) return '';
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 40)).replace(/[,;:\s]+$/, '') + '…';
};

export function toCard(section: Section, e: Fish | Character | Wildlife | Boat): CardModel {
  switch (section) {
    case 'fish': {
      const f = e as Fish;
      return { section, id: f.id, title: f.common, hook: clip(f.in_book), chapters: f.chapters, sketch: f.sketch };
    }
    case 'crew': {
      const c = e as Character;
      return { section, id: c.id, title: c.name, hook: c.role, chapters: [c.first_chapter], sketch: c.sketch };
    }
    case 'critters': {
      const w = e as Wildlife;
      return { section, id: w.id, title: w.name, hook: clip(w.in_book ?? w.scientific ?? ''), chapters: w.chapters, sketch: w.sketch };
    }
    case 'boats': {
      const b = e as Boat;
      return { section, id: b.id, title: b.name, hook: b.type ?? clip(b.in_book), chapters: b.chapters, sketch: b.sketch };
    }
  }
}

export const sectionMeta: Record<Section, { label: string; one: string; blurb: string }> = {
  fish: { label: 'Fish', one: 'fish', blurb: 'Every fish named in the book, and how Matt went after it.' },
  crew: { label: 'Crew', one: 'character', blurb: 'The people (and pelicans, and one tarpon) of Chokoloskee.' },
  critters: { label: 'Critters', one: 'critter', blurb: 'What Matt met that was not on the end of a line.' },
  boats: { label: 'Boats', one: 'boat', blurb: 'The Mako, the Sea Belle, the Bonefisher, and Dad’s red airboat.' },
};

/** Characters whose first_chapter is the only chapter signal; derive full chapter lists from chapters.json. */
export function chaptersForCharacter(id: string): number[] {
  return chapters.filter((c) => c.characters.includes(id)).map((c) => c.n);
}
export function chaptersForGear(id: string): number[] {
  return chapters.filter((c) => c.gear.includes(id)).map((c) => c.n);
}
export function chaptersForPlace(id: string): number[] {
  return chapters.filter((c) => c.places.includes(id)).map((c) => c.n);
}
