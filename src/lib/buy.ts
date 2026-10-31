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
export const buyLabel = isOpen ? `Get the Full Experience ${c.price}` : `Opens ${c.opens}: join the list`;
export const opens = c.opens;
export const price = c.price;
