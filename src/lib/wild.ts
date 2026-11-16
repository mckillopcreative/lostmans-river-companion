// Wild Florida: how many animals are actually in the game. An animal joins the game when its
// plate has been painted (src/pages/wild-florida/index.astro leaves the others out), so every
// count the site prints comes from here and never runs ahead of the pictures.
import data from '../../data/wild.json';
import { artImage } from './images';

export const wildCount = data.animals.filter((a) => artImage(a.art[0], a.art[1])).length;
export const wildTitle = data.title;
/** Every animal written, painted or not: where the count is heading. */
export const wildTotal = data.animals.length;
/** The free starter set, among the painted ones. */
export const wildStarters = data.animals.filter((a) => (a as { starter?: boolean }).starter && artImage(a.art[0], a.art[1])).length;
/** "51 Florida animals today, growing to 201 as the plates are painted", then "201 Florida animals". */
export const wildHowMany = wildCount < wildTotal ? `${wildCount} Florida animals today, growing to ${wildTotal} as the plates are painted` : `${wildTotal} Florida animals`;
