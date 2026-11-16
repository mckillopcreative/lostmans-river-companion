// Wild Florida: how many animals are actually in the game. An animal joins the game when its
// plate has been painted (src/pages/wild-florida/index.astro leaves the others out), so every
// count the site prints comes from here and never runs ahead of the pictures.
import data from '../../data/wild.json';
import { artImage } from './images';

export const wildCount = data.animals.filter((a) => artImage(a.art[0], a.art[1])).length;
export const wildTitle = data.title;
