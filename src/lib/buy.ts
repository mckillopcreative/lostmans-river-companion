// Where every Buy button goes. Before opening day (site.config → checkout.open false) it is the
// waitlist; on opening day it is the Stripe Payment Link. One switch for the whole site.
import site from '../../site.config.mjs';
import { url } from './url';

const c = site.checkout;
export const isOpen = !!c.open;
export const buyHref = isOpen ? c.url : url('/waitlist/');
/** The click event: a real checkout, or interest before opening day. */
export const buyTrack = isOpen ? 'buy_click' : 'waitlist_click';
/** The button words in a lock panel. */
export const buyLabel = isOpen ? `Hook the Full Experience ${c.price}` : `Opens ${c.opens}: join the list`;
export const opens = c.opens;
export const price = c.price;
/** The holiday "buy one, give one" offer while it runs, else null (site.config → checkout.bogo). */
const b = (c as { bogo?: { until: string; through: string } }).bogo;
export const bogo = isOpen && b && Date.now() < Date.parse(b.until) ? b : null;
/** The Wild Florida add-on while checkout is open, else null (site.config → checkout.wild). */
const w = (c as { wild?: { price: string; url: string; crewUrl: string; addUrl: string } }).wild;
/** Wild Florida comes with every Experience (site.config → checkout.wildIncluded, 2026-11-27). */
export const wildIncluded = !!(c as { wildIncluded?: boolean }).wildIncluded;
export const wild = isOpen && w && !wildIncluded ? w : null;
