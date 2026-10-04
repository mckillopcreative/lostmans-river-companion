# Visual brief — Escape to Lostman's River companion site

**Hand this file to an image model or an illustrator.** It describes the look, the file contract, and every picture the site can use. Files saved at the exact paths below appear on the site automatically on the next build; nothing else needs to change.

Generated from `data/*.json` by `npm run brief`. Counts: 23 fish, 17 crew, 19 critters, 12 boats, 34 tackle terms, 5 knots, 29 places, 23 chapters.

---

## 1. The look

The book cover is the reference: a **watercolor sky** in cover blue, a pale **seafoam** horizon, and **black ink silhouettes** of an angler casting from a flats boat with a seaplane overhead. Inside the book, every illustration is a **pen-and-ink sketch** by Linda McKillop. The site combines both: cream paper pages, ink drawings, and watercolor washes in the cover's colors.

Every new image must sit comfortably next to Linda's sketches. Think *field guide painted on the boat*, not *cartoon*, not *photoreal render*.

### Palette (use these, nothing neon)
| Token | Hex | Where it comes from / use |
|---|---|---|
| paper | `#f6f1e7` | page background; leave transparent, the site supplies it |
| ink | `#1f2a2e` | line work, lettering |
| silhouette | `#0b1218` | the cover's black figures |
| sky | `#6ab8e8` | cover sky, water washes |
| sky-pale | `#d9eefb` | high sky, highlights on water |
| seafoam | `#cfeacb` | the cover's horizon glow, mangrove light |
| mangrove | `#2f5d50` | foliage, deep shade |
| gulf | `#2a7f8e` | deeper water, teal |
| sunrise | `#e8873a` | the one warm accent: a lure flash, a float, a bobber, a sunrise |
| oyster | `#b8b2a6` | shell, sand, driftwood |

Fish get their own natural colors (listed per species below), kept muted and watercolor-soft.

### Medium and rendering rules
- **Pen-and-ink line + loose watercolor wash.** Visible paper grain in the wash is good; airbrush smoothness is not.
- **Transparent background (PNG with alpha).** No white or cream box behind the subject, no vignette, no frame, no drop shadow.
- **No text, no lettering, no logos, no watermarks, no signatures** inside any image. The site adds captions.
- **One subject, centered, with breathing room.** Fill about 80% of the canvas. No cropped edges.
- **Consistent light:** soft daylight from upper left.
- **Species accuracy matters.** Adult anglers will judge the fish. Fin counts, stripe placement, mouth shape and tail shape must be right for the species. Use the identification notes below.
- **People are drawn, never photoreal,** and never resemble a real public figure. Faces are kind, a little weathered, outdoors-people. No cartoon proportions.
- **No violence close-ups.** The shark, the gator and the moccasin are drawn as field-guide animals, not as attacks.
- **Square canvas, 2048 × 2048 px** for all subjects unless a size is given. The site resizes.

### File contract
Save each file as **`assets/art/<folder>/<id>.png`** using the folder and id in the tables. Lower-case, hyphens, no spaces. Ids are fixed; do not rename them.

A good prompt skeleton:

> Pen-and-ink line drawing with loose watercolor wash, field-guide style, on a transparent background. Subject: {subject}. {identification notes}. Muted natural colors: {colors}. Soft daylight from upper left. No text, no border, no background scenery, single subject centered, square.

For scenes (places, chapters) drop "single subject" and allow a horizon, still with no text.

---

## 2. Priorities

Make them in this order; the site improves with every batch.

1. **Six core fish** — snook, tarpon, redfish, spotted seatrout, mangrove snapper, grouper. These are on nearly every chapter page.
2. **The five crew portraits without a sketch** — Uncle Dan, Snapper, Rose, Rawley, Marge.
3. **Site emblems** — the site mark, section emblems, social share image.
4. **Lures and rigs**, then **knots**.
5. The remaining fish, critters, boats.
6. Place scenes and chapter spot illustrations.

---

## 3. Fish — `assets/art/fish/<id>.png`

Side view, head to the left, full body including tail, as in a field guide plate. Slight three-quarter turn is fine. Wet, not glossy.

| id | Common name | Scientific | Identification (must be right) | Typical size | Color notes |
| --- | --- | --- | --- | --- | --- |
| snook | Common snook | Centropomus undecimalis | Long body, protruding lower jaw, single black stripe nose to tail. | 20–35 in; trophies over 40 in | #b9b58f |
| tarpon | Tarpon ('silver king') | Megalops atlanticus | Huge silver scales, upturned mouth, long trailing dorsal ray. | 40–150 lb; giants over 200 lb | #aab8c2 |
| redfish | Redfish (red drum, 'spot-tail') | Sciaenops ocellatus | Copper-bronze, one or more black spots at the base of the tail. | 18–27 in slot; bull reds over 40 in | #b86b3a |
| trout | Spotted seatrout | Cynoscion nebulosus | Silver-gray with black spots on back, dorsal, and tail; two canine teeth. | 14–20 in | #7f9a7a |
| snapper | Mangrove (gray) snapper | Lutjanus griseus | Gray-bronze, dark stripe through the eye, reddish tint near the mouth. | 10–16 in inshore | #8c6a4f |
| grouper | Grouper (goliath / gag) | Epinephelus itajara (goliath); Mycteroperca microlepis (gag) | Broad head, huge mouth, mottled brown. Goliaths are the 300-pounders. | Gag 20–30 in; goliath 100–400 lb | #7a6a52 |
| black-drum | Black drum | Pogonias cromis | Deep-bodied, gray-black, chin barbels, vertical bars when young. | 14–24 in slot; big ones over 40 lb | #4d4f52 |
| cobia | Cobia | Rachycentron canadum | Long, dark brown, flat head; often mistaken for a shark. | 30–50 lb | #5a4b3c |
| yellowtail | Yellowtail snapper | Ocyurus chrysurus | Yellow stripe from nose to a forked yellow tail. |  | #e2bd4a |
| ladyfish | Ladyfish | Elops saurus | Slender, silver, leaps wildly when hooked. |  | #c3cbd0 |
| flounder | Gulf flounder | Paralichthys albigutta | Flat, both eyes on the left side, three ocellated spots. |  | #9a8a6a |
| sheepshead | Sheepshead | Archosargus probatocephalus | Black vertical bars and eerily human-looking teeth. |  | #8a8a86 |
| pufferfish | Pufferfish | Sphoeroides spp. | Inflates when threatened. |  | #c9b98a |
| jack | Jack crevalle | Caranx hippos | Blunt head, yellow tail, black spot on the gill cover. |  | #6d8a5a |
| mullet | Striped mullet | Mugil cephalus | Blunt nose, silver, jumps for no reason anyone has proven. |  | #93a3ac |
| pinfish | Pinfish | Lagodon rhomboides | Small, striped, sharp dorsal spines. |  | #c2bb6c |
| catfish | Hardhead catfish | Ariopsis felis | Venomous spines — handle carefully. |  | #737a7c |
| bonefish | Bonefish | Albula vulpes | Silver, forked tail, tails in inches of water. |  | #c9d2d6 |
| amberjack | Greater amberjack | Seriola dumerili |  |  | #8a7a4a |
| brim | Bluegill ('brim') | Lepomis macrochirus |  |  | #6a7a4a |
| lionfish | Lionfish (invasive) | Pterois volitans |  |  | #b5593a |
| mako-shark | Shark on the beach ('Mako') | Isurus oxyrinchus (as named in the book); more likely a bull shark, Carcharhinus leucas, in those shallows |  |  | #5b6c7a |
| hammerhead-shark | Hammerhead shark | Sphyrna spp. |  |  | #687782 |

Notes: the `mako-shark` entry is what the book calls it; draw a shark that reads as a bull shark in shallow water at night. `hammerhead-shark`: great hammerhead, head-on view acceptable.

---

## 4. Crew — `assets/art/crew/<id>.png`

Bust or three-quarter portrait, pen-and-ink with a light wash, like a sketch Matt made in the Guidebook margin. Plain transparent background. Clothing and props from the description. Matthew 'Matt' Creek, Doc Brown, Bertha and Oscar, Old Scarface already have Linda's sketches; a portrait is still welcome for consistency but is lower priority.

| id | Name | Role | What to draw |
| --- | --- | --- | --- |
| matt | Matthew 'Matt' Creek | protagonist | 15¾ at the start; turns 16 in Chapter 22 List-keeper, daydreamer, lifeguard, and the best young angler in the Ten Thousand Islands. Half Seminole on his father's side. Unusually long thumbs. Lost his father last summer and is spending this one as Uncle Dan's assistant fishing guide. Tells: keeps a summer to-do list in his dad's Guidebook; learns a new word each day; 'mental rebound' when worry hits; loves Orange Crush, candy corn, tuna-and-mayo for breakfast, donuts; sketches fish and pelicans into the Guidebook's blank pages |
| james-creek | James W. Creek ('Dad') | Matt's late father | Owner of the South Florida Fishing Guidebook and the red airboat. Died the previous summer when poachers' boat struck his airboat while he was trying to scare off illegal alligator hunters. His bronze plaque read 'O God, thy sea is so great, and my boat is so small.' |
| dan | Daniel Walter Panther Jr. ('Uncle Dan') | Matt's uncle, charter captain | Matt's mother's older brother. Lifelong Chokoloskee fishing guide, 'amateur psychologist with a rockin' suntan,' restorer of old boats, keeper of a backyard pelican rookery. Drives a rusty Chevy Tahoe. Secretly serving as the FBI's informant against the smugglers. |
| rose | Rose | Matt's oldest friend | Red hair, freckles, a slightly sunburnt nose, and a fishing pole twice her height. Swaps the first letters of swear words so she isn't technically swearing. Doc Brown's granddaughter and Marge's daughter. Wins the Port of the Everglades tarpon division with a 68-inch, 81-pound fish. |
| snapper | Snapper | Dan's neighbor, retired guide | A 'crazy old buzzard with a constant crooked smile.' Communicates mostly in grunts, hoots, and howls. Once guided President George H. W. Bush on the Key Largo flats. Forgetful, fearless, and the best navigator in the backcountry. |
| doc | Doc Brown | Old fishing guide and retired Navy physician | Short, stocky, friendly blue eyes, and a face smeared chalk-white with zinc oxide. A fishing rival of Dan and Snapper for thirty years. Dishonorably discharged from the Navy for treating the most wounded soldier first instead of a higher-ranking officer. Has heart disease and needs a procedure the family can't afford. |
| rawley | 'Rawley' Simms | Grocery-store owner / undercover FBI agent | Six-foot-plus, shaggy brown hair, tattooed biceps, burps as a greeting. Runs the musty Chokoloskee grocery store, which is a front. Spends the book looking like the villain and turns out to be one of the good guys; his real name is never revealed. |
| russ | Russ Worthington | FBI agent, fishing client | Tall, muscular, could pass for a local. Lives in Naples. Fishes with his grandson off a lake dock. Hooks Old Scarface for thirty minutes and loses him. |
| dave | Dave Carver | FBI agent, fishing client | Russ's partner, overdressed in a stuffed fishing vest on day one. Catches the first snapper and the first trout. Eats Doritos. |
| marge | Marge | Doc's daughter, Rose's mother | Red curly hair, waitress in Everglades City, worn white tennis shoes. Takes care of Doc. |
| mom | Matt's mother | Dan's sister | Recently opened a restaurant in Fort Lauderdale. Worried about Matt since his father's death. Her letters ask to hear about every single day of his summer. |
| josh-ben | Josh and Ben | Matt's ten-year-old twin brothers | Josh is thirty seconds older with curly hair and freckles; Ben is a bit taller. Both intend to be doctors. Both already know what 'starboard' means. They sign the Guidebook on the last page. |
| captain-homer | Captain Homer | Local legend | Has won the tournament more times than Matt has been alive. Captains a twenty-one-foot boat named, inexplicably, 'The Marina.' His 65-inch tarpon from Indian Key doesn't beat Rose. |
| third-man | The third man | Smuggler boss (unnamed) | The man in charge on the jet boat at Pavilion Key — one of the real smugglers arrested at the end. |
| bertha-oscar | Bertha and Oscar | Pelicans of the rookery | 'Soulmates,' according to Dan. Bertha was named by a German client after she ate his breakfast burrito. Oscar steals a glazed donut out of Matt's hand. They nest in a flat tire, a barbecue grill, and an old wooden tub. |
| old-scarface | Old Scarface | The legendary tarpon | Roams Rabbit Key and Little Pavilion Key. Face scarred by years of lures and oyster bars. Evaded every angler for years, spit Russ's hook, then took Matt's trolled lure and fought for an hour and a half before being gaffed, photographed, and released alive. |
| lobster | Lobster | Marge's red tabby cat | Falls off the couch at the key moment of Matt's 'Big One' speech. |

Special cases: `bertha-oscar` is two brown pelicans on a dock piling; `old-scarface` is a huge tarpon with an old scar across the jaw, half out of the water; `lobster` is a red tabby cat; `third-man` can be a figure in a dark windbreaker seen from behind at the rail of a boat; `josh-ben` are ten-year-old twins, one curly-haired with freckles, one a little taller.

---

## 5. Critters — `assets/art/critters/<id>.png`

Field-guide plates. Plants and habitats (mangroves, oyster bar, seagrass, cypress, banyan) as a representative clump or cross-section.

| id | Name | Scientific | Notes |
| --- | --- | --- | --- |
| pelican | Brown pelican | Pelecanus occidentalis | Bertha and Oscar; the hooked pelican Snapper carries to the door; the fish-head thief at Lostman's. Dive from 30–60 feet and hit the water head-first; air sacs under the skin cushion the impact. |
| dolphin | Bottlenose dolphin | Tursiops truncatus | The playful pair at Lopez River; the mother who rams the hammerhead and bites her calf free of the net. Everglades dolphins live in small resident groups and work the mangrove edges in teams. |
| alligator | American alligator | Alligator mississippiensis | The marina gators tourists get too close to; the grouper thief at Lostman's; Alligator Alley; the poachers who caused Dad's death. Everglades gators tolerate brackish water near river mouths but prefer fresh. |
| water-moccasin | Cottonmouth (water moccasin) | Agkistrodon piscivorus conanti | The snake drawn to the lantern at Comer Key. Florida cottonmouths swim with the whole body on the surface; harmless water snakes swim with just the head up. |
| shark | Sharks of the Ten Thousand Islands | Bull, blacktip, lemon, bonnethead, hammerhead | The 'Mako' on the beach at Comer Key; the hammerhead at the ghost net. Bull sharks are the shallow-water shark of the Everglades and move far up the rivers. |
| mangroves | Mangroves | Red (Rhizophora mangle), black, white | Everywhere. The hideout at Pavilion Key, the storm tie-off, the overhangs where snook wait. Red mangroves' prop roots are a fish nursery — most of the fish in this book start life there. |
| oyster-bar | Oyster bars | Crassostrea virginica | The thing that scrapes the hull, holds the Sea Belle, cuts your line, and hides the redfish. Oysters filter up to 50 gallons of water a day each. |
| cypress | Bald cypress | Taxodium distichum | 'Colossal cypress trees gnarled up out of the ground like giant twisted guardians of the realm' on the drive in. Deciduous conifers; the 'knees' may help with stability in soft mud. |
| banyan | Banyan / strangler fig | Ficus spp. | Two massive banyans flank Dan's front yard. |
| mosquito | Mosquitoes, sand fleas, no-see-ums | Aedes taeniorhynchus and friends | 'It was the mosquitos that chomped at his peace of mind.' Dan's homemade lavender repellent. The black salt-marsh mosquito breeds in the mangroves by the billion after rain. |
| ghost-net | Abandoned fishing nets |  | Catches Matt's foot in the storm and the baby dolphin the next day. Derelict gear keeps 'fishing' for years. |
| stone-crab | Stone crab | Menippe mercenaria | Matt begging claws from the seafood company as a kid. Only one claw is taken and the crab is returned alive to regrow it. |
| grass-beds | Seagrass beds | Thalassia, Halodule | Rabbit Key's grass beds — 'grass bed fishing meant trout.' |
| frogs | The Everglades choir |  | Mullet splashing, frogs croaking, birds singing — Ch. 15's night on deck. |
| iguana | Green iguana (invasive) | Iguana iguana | Smuggled exotics in the Gazette article. |
| seagull | Gull | Larus spp. | Matt's confidant about the lavender repellent. |
| birds | Birds of the islands |  | 'Birds danced alongside in the air, no doubt singing songs of Matt's adventures.' |
| sand-flea | Sand fleas |  |  |
| gnat | Gnats / no-see-ums |  |  |

---

## 6. Boats and vehicles — `assets/art/boats/<id>.png`

Three-quarter view from slightly above, afloat (no trailer), no people unless noted. Hull colors as described.

| id | Name | Type | What to draw |
| --- | --- | --- | --- |
| mako | The Mako | Center-console bay boat | Named after the shark. Wide and flat at the back, V-hull forward, draws almost no water. The workhorse for client trips and the Pavilion Key escape. Mako Marine has built center consoles since 1967; a 17–19 ft Mako is the classic Florida guide boat. |
| bonefisher | The Bonefisher | Sixteen-foot open backcountry skiff | 'The new smaller backcountry boat.' Towed behind the Sea Belle; tows the Sea Belle off the oyster bar; dragged across a channel by a grouper. |
| sea-belle | The Sea Belle | Houseboat | Four times the size of the Mako, with a cabin, bunks, kitchen, and a covered rear deck. 'Only he drives this here boat.' Home for a week at Lostman's River. |
| airboat | Dad's red airboat | Airboat | Fire-engine red hull, white bow, 'just the right amount of rust.' Wrecked in the accident, found in a junkyard by Snapper, restored by Dan. Matt's sixteenth-birthday gift and next summer's project. An aircraft-style propeller pushes the flat-bottomed hull over inches of water and sawgrass. |
| tahoe | Dan's Chevy Tahoe | SUV | Rusty, beloved, with the radio antenna Matt threatens to bend. Matt drives it to the DMV and to the airport. |
| doc-skiff | Doc's skiff | Small aluminum boat | 'Too little to be out so far from civilization.' Drifts up empty to the Sea Belle. |
| seaplane | The smugglers' seaplane | Twin-engine floatplane | Lands without lights at Little Pavilion Key and flashes three times. |
| jet-boat | The smugglers' jet boat | Deep-hull powerboat | Faster than the Mako but can't follow into one-foot bays — 'bogged down in the muddy shallow bay' three times. |
| the-marina | 'The Marina' | Twenty-one-foot sea boat | 'Who names a boat Marina?' |
| boeing-737 | Boeing 737 | Airliner | Matt's first flight; starboard confirmed in the Guidebook. |
| fbi-suv | The agents' black SUV | SUV | 'The cool government license plate.' |
| smuggler-boats | Two boats and a car at South Point |  | The night exchange in Ch. 5. |

---

## 7. Tackle box — `assets/art/tackle/<id>.png`

Objects as catalog drawings: the item alone, slightly larger than life, every part legible. Techniques and water-reading terms are small scene diagrams (a boat, a cast, an arrow or two is fine, still no text).

### Lures & bait
| id | Term | What to draw |
| --- | --- | --- |
| lure | Lure | A miniature plastic or metal fish with treble hooks, reeled with just the right jerk to look like a scared meal. Floating or sinking depending on weather, tide, and target. |
| bagley-mullet | Bagley Mullet lure | Dan's black-and-silver mullet imitation that 'glistens in the moonlight.' The lure that caught the South Point snook. |
| yellow-feather | Yellow feather tipped with shrimp | A feathered jig with a piece of shrimp on the hook; jigged over grass for trout, bounced for snapper. |
| popping-cork | Popping cork | A float with a cupped top; tug every few seconds and it 'pops' to call fish to the shrimp dangling beneath. How Matt caught his first snook and most redfish. |
| spoon-lure | Spoon | A curved metal flasher that wobbles on the retrieve. Matt's first post-storm cast. |
| golden-flicker | The 'Golden Flicker' | Matt's prized red mullet lure with gold flecks. |
| shrimp | Live shrimp | The universal Everglades bait, kept alive in a bucket with a battery aerator. |
| aerator | Aerator | Battery-powered bubbler that keeps bait shrimp alive overnight. |
| live-bait | Live bait | Snapper tosses a small live snapper into the current and hooks the giant. |

### Line & rigging
| id | Term | What to draw |
| --- | --- | --- |
| leader | Leader | The last few feet of line: heavier or clearer than the main line, with the lure or hook, often a swivel and a small weight above it. Matt adds a thirty-pound leader the night before the big snook. |
| swivel | Swivel | A tiny metal figure-eight that joins main line to leader and keeps the line from twisting. |
| boat-poles | Boat poles | Heavy rods with woven 30-lb test, steel tip leaders, and forged hooks for beach-casting at tarpon and sharks. |
| steel-leader | Steel leader | Wire leader that toothy fish can't bite through. |
| thirty-pound-leader | Thirty-pound test | Line strength rated to hold thirty pounds before breaking. |
| gaff | Gaff | A big hook on a pole for lifting a fish aboard by the mouth. Snapper's one lucky pass. |
| sand-pipes | Sand pipes (rod holders) | Aluminum pipes hammered into the beach to hold rods after a long cast. |

### Techniques
| id | Term | What to draw |
| --- | --- | --- |
| push-pole | Push pole | Long wooden pole for moving a boat silently through the shallows — how Snapper gets the Mako into the mangroves unheard. |
| drifting | Drifting | Letting the boat move with the tide and wind while casting. 'Drifting actually meant casting.' |
| trolling | Trolling | Dragging a lure a hundred feet behind a moving boat. Little effort, long waits, then Old Scarface. |
| setting-the-hook | Setting the hook | The upward yank at exactly the right bite. Too early and the hook flies out empty — Ch. 4. |
| reviving-a-fish | Reviving a fish | Hold it upright and move it back and forth so water passes over the gills until the tail kicks. Done for the snook and for Old Scarface. |
| storm-tie-off | Storm tie-off | Bow rope to one mangrove, stern anchor out — the boat 'stretched secure from end to end.' |

### Reading the water
| id | Term | What to draw |
| --- | --- | --- |
| throwing-a-wake | Throwing a wake | A big fish moving just under the surface, pushing a ripple like a tiny boat. |
| tides | Reading the tide | Fish the hour either side of high tide; 'morning high' means plenty of water over the oyster bars. Dan: the water isn't rising, the earth is turning through bulges of water pulled by sun and moon. |
| grass-beds-trout | Grass beds = trout | Seatrout hold over seagrass; mangroves and oysters hold snook and reds. |
| snook-season | Snook closed season | Snook spawn May–September; the book's Gulf-coast season is closed then and all snook go back. |
| navigational-chart | Navigational chart | Paper chart of the backcountry; cell reception is unreliable so 'they had to rely on actual maps.' |

### Boat & safety
| id | Term | What to draw |
| --- | --- | --- |
| marine-radio | Marine VHF radio | How Dan reaches the Sea Belle. |
| channel-16 | Channel 16 | The international hailing and distress channel. Dan says to leave it open 9–10 p.m. |
| spotlight | Spotlight | Swiveled over the bow to find Doc in the dark. |
| snorkel | Snorkel, fins, pocketknife | Matt's dolphin-rescue kit. |
| medical-bag | Doc's medical bag | Novocain, needles, thread, antiseptic, gauze — and Matt's first stitches. |
| provisioning | Provisioning the Sea Belle | Peanut butter, three loaves of bread, cereal, cans, meat, milk, eggs, butter — 'a week of solid eating for two.' Plus donuts. |
| tournament-rules | Tournament categories | Tarpon, cobia, snapper, trout, drum — by weight. Snook, grouper, and redfish excluded under catch-and-release rules. |

### Knots — `assets/art/tackle/knot-<id>.png`
Step diagrams in ink: three to four stages left to right, line drawn as a thick rope so the wraps read, hook or swivel in silhouette. No text; the site labels the steps.

| id (file is knot-<id>.png) | Knot | Notes |
| --- | --- | --- |
| improved-clinch | Improved clinch knot | The everyday hook-to-line knot; show the five wraps and the tag end tucked back. |
| loop-knot | Non-slip loop knot | Lets a lure swing freely; show the open loop at the lure eye. |
| uni-knot | Uni knot | Line to swivel, and doubled as a line-to-leader join. |
| palomar | Palomar knot | Strongest simple hook knot; show the doubled line passed over the hook. |
| albright | Albright knot | Main line to a heavier leader, as Matt ties for the big snook. |

---

## 8. Places — `assets/art/places/<id>.png`

Landscape scenes, 2048 × 1365 px (3:2), watercolor with ink line. Low horizon, big Everglades sky in the cover's blue, mangroves in mangrove green. No people, no text. These sit behind the place popups on the chart and at the top of future place pages.

| id | Place | Type | In the book |
| --- | --- | --- | --- |
| naples-airport | Naples, Florida (airport) | town | Where Matt lands in Ch. 1 and takes his driver's test in Ch. 22. |
| alligator-alley | Alligator Alley (I-75) | route | The drive to the airport in Ch. 23 — 'those crazy large reptiles cheered people on.' |
| everglades-city | Everglades City | town | The mainland town; Rose lives here with her dad; Marge waits tables here. |
| everglades-marina | Everglades City marina (Barron River) | marina | Gas, water, and Rawley on the dock, Ch. 11. |
| barron-river | Barron River | river | The Sea Belle's channel from Chokoloskee Bay to Everglades City. |
| chokoloskee-causeway | Chokoloskee causeway | route | First view of Chokoloskee Bay, 'the glassy waters of Matt's youth.' |
| chokoloskee | Chokoloskee Island | town | Home base. Seminole for 'Old House.' Dan's cottage, the grocery store, the marina. |
| chokoloskee-bay | Chokoloskee Bay | water | The bay crossed at sunrise on every trip. |
| chokoloskee-marina | Chokoloskee marina | marina | Where the Mako lives, where Matt caught his first snook, where Rose waves from the last dock. |
| dans-cottage | Dan's cottage and rookery | home | Stilt house with banyans out front and pelicans out back. Fictional location — place near the island's east side. |
| anglers-motel-dock | Anglers Motel dock | dock | Childhood catfish and lobster traps. |
| south-point | South Point (abandoned post office) | spot | Matt's spot. The snook, the smugglers' meeting, the sleeping-bag night. (The real Smallwood Store sits at Chokoloskee's south tip.) |
| lopez-river | Lopez River | river | First client trip, Ch. 3 — the mangrove overhang between two oyster bars. |
| rabbit-key-pass | Rabbit Key Pass | pass | The way home from the storm in Ch. 3; the escape route in Ch. 10. |
| sandfly-pass | Sandfly Pass | pass | Out to the Gulf for Comer Key camping. |
| comer-key | Comer Key | island | Beach camping, the moccasin, the shark. Matt's first keeper redfish years ago. |
| indian-key | Indian Key | island | Where Captain Homer hooked his tournament tarpon. |
| pavilion-key | Pavilion Key | island | The seaplane drop at dawn, Ch. 9; the mangrove hideout. |
| little-pavilion-key | Little Pavilion Key | island | Old Scarface's territory. Hooked by Russ (Ch. 7) and caught by Matt (Ch. 19). |
| gulf-of-mexico | Gulf of Mexico | water | The 'blue abyss' from the plane window. |
| lostmans-river | Lostman's River | river | The destination. 'A river inside a bay inside a gulf.' The Sea Belle beached on an oyster bar near the mouth, Ch. 11–18. |
| crooked-creek | Crooked Creek | creek | The magazine-writer story, Ch. 15. |
| backcountry | The backcountry bays | water | 'A navigational test for even the most experienced fishing guides.' |
| shark-river | Shark River | river | Matt asks Snapper and Doc if they've been out there. |
| port-of-the-everglades | Port of the Everglades Lodge (tournament) | marina | The tournament weigh-in. Appears fictionalized; the real Port of the Islands marina is nearby. Confirm with the author. |
| docs-house | Doc's house | home | Rundown house down a dirt road on Chokoloskee. Fictional. |
| key-largo | Key Largo flats | water | Snapper and President Bush's bonefish. |
| fort-lauderdale | Fort Lauderdale | town | Matt's home. Mom's restaurant. Mr. Farmer's garage with the airboat. |
| naples | Naples DMV | town | Driver's test on Matt's sixteenth birthday. |

---

## 9. Chapter spot illustrations — `assets/art/chapters/ch-NN.png`

A small ink spot illustration per chapter (a single object or moment, like a chapter-head vignette): 1024 × 1024, mostly line, a single wash of one color. These sit beside the chapter number on each QR landing page. Chapters marked "has sketch" already have one of Linda's drawings on the page; the spot should be a *different* object from that chapter.

| file | Chapter | Summary | Linda sketch on page? |
| --- | --- | --- | --- |
| ch-01.png | 1 — Off Ground | Matt Creek, fifteen and three-quarters, flies alone for the first time to Naples to spend the summer as Uncle Dan's assistant fishing guide in Chokoloskee. We meet his father's South Florida Fishing Guidebook, his summer to-do list, the plaque quote, and learn his father died last summer. | no |
| ch-02.png | 2 — Welcome | Dan picks Matt up in the Tahoe. Donuts at the grocery store run by the unsettling Rawley Simms. Dan's stilt cottage, the pelican rookery with Bertha and Oscar, the tarpon room, rigging eight poles, and a warning: tomorrow's clients are federal agents. | yes |
| ch-03.png | 3 — Early Morning | First client trip with FBI agents Russ and Dave. Sunrise run across Chokoloskee Bay toward Lopez River, dolphins at the oyster bar, trout and redfish, then a snapper bonanza at a river mouth. Matt spots Rose at the marina but misses her. | no |
| ch-04.png | 4 — The Monster of South Point | A month passes. Snook lore, closed season, and Matt's nightly vigil at South Point under the abandoned post office. A giant snook 'throwing a wake' steals his shrimp. | no |
| ch-05.png | 5 — Unexpected Voices | Oscar steals a donut. Matt camps overnight at South Point with the Bagley Mullet lure. Dan brings cookies and asks about school; Matt tells him he read the accident report. After Dan leaves, two boats and a car meet in the dark — smugglers, and one of them is called Rawley. | no |
| ch-06.png | 6 — Second Chances | Minutes after the smugglers leave, Matt hooks and lands the biggest snook of his life — 36 inches, 20 pounds — on the Bagley Mullet, revives it, and releases it. 'Catch you later.' | yes |
| ch-07.png | 7 — A Tarpon to Remember | Snapper arrives holding a hooked pelican. Out at Rabbit Key / Little Pavilion Key with Russ and Dave, Russ hooks the legendary tarpon Old Scarface, who spits the hook after thirty minutes. Matt finally tells the agents about the smugglers. | no |
| ch-08.png | 8 — Dangerous Encounters | Dan announces a 'business trip' and enters them both in the Port of the Everglades tournament. Beach camping on Comer Key: boat poles in sand pipes, a water moccasin dispatched with a hand ax, and a shark on the line in the shallows. | yes |
| ch-09.png | 9 — Wrong Place at the Wrong Time | Pre-dawn run to Pavilion Key with Snapper. A seaplane lands without lights and meets a jet boat — a smuggling drop. Snapper poles the Mako into the mangroves. At sunrise Matt recognizes one of the three men: Uncle Dan. | yes |
| ch-10.png | 10 — Run for It | Matt guns the Mako out of hiding; the jet boat bogs in the shallows. Dan calls: 'Trust me. Head to Lostman's River in the Sea Belle. Channel sixteen, nine to ten p.m.' Matt and Snapper load the houseboat, towing the Bonefisher — and pass Rose waving on the dock. | no |
| ch-11.png | 11 — Escape to Lostman's River | Gas and water at Everglades Marina — and Rawley on the dock. Down the Barron River and out through the islands to the mouth of Lostman's. A threatening phone call: 'how you gonna wave next time without your hand?' | yes |
| ch-12.png | 12 — The Storm | A squall from the east drives the Sea Belle onto an oyster bar. Matt uses the Bonefisher to tow and tie the houseboat to mangroves, then gets his foot caught in an abandoned fishing net swimming back. | no |
| ch-13.png | 13 — Hungry Visitors | After the storm: muddy water, no bites, PB&J. Then snapper on a yellow feather, a grouper bitten in half by an alligator, and a pelican that steals the fish head — hook, line, and a 'present' on Matt's arm. | yes |
| ch-14.png | 14 — The Unseen Giant | The 'Golden Flicker' lure. Into the backcountry in the Bonefisher. Snapper live-baits a small snapper and hooks something that drags the anchored boat across the channel before the line snaps — a grouper, three hundred pounds or more. | yes |
| ch-15.png | 15 — Silent Shadows and Warm Memories | A sleepless night on deck listening to the Everglades 'choir.' Matt remembers Dan, a magazine writer, a snagged hat, and a snook landed by hand through a bird's nest of line at Crooked Creek. | no |
| ch-16.png | 16 — A Dolphin in Trouble | Dan's explanation of tides as the earth turning through bulges of water. A man dressed all in white passes without waving. Redfish, grouper, trout. A baby dolphin tangled in the ghost net; Matt swims out with a knife as a hammerhead arrives — and the mother dolphin rams the shark. | yes |
| ch-17.png | 17 — Stranger in White | The white-clad man's boat drifts up empty. Matt and Snapper find Doc Brown half-submerged with a cut head and broken rib. Zinc oxide. Matt stitches Doc's wound. Dan's voice on channel sixteen. | yes |
| ch-18.png | 18 — Push and Pull | Oatmeal vs. PB&J. At the 9 a.m. high tide, Matt and Snapper push while Doc tows with the Bonefisher. Matt bangs his knee on the propeller. The Sea Belle floats free. | no |
| ch-19.png | 19 — The Return of Old Scarface | Trolling home on the last day of the tournament. Off Little Pavilion Key Matt hooks Old Scarface; a ninety-minute fight; Snapper gaffs him aboard. Matt chooses to release the fish rather than weigh it. Dan on the radio: 'I'm so proud of you, son.' | yes |
| ch-20.png | 20 — Finding an Old Friend | The tournament weigh-in. Rose has the leading tarpon: 68 inches, 81 pounds. Rawley corners Matt in the parking lot — he's undercover FBI, Dan is the informant, the real smugglers are in jail, and the cargo was sunken treasure. A $20,000 reward. Doc's story and his heart. | no |
| ch-21.png | 21 — A Final Tarpon Entry | Captain Homer's 65-inch tarpon doesn't beat Rose's. Matt hides Snapper's share of the reward in a Dorito bag. At Doc's house Matt explains what 'the Big One' really means and offers Doc his reward for surgery — then Rose walks in with the trophy, having already done the same. | no |
| ch-22.png | 22 — An Uncle's Promise | Birthday week. In the garage: Dad's red airboat, found in a junkyard and restored by Dan and Snapper. Next summer's project. Matt turns sixteen and passes his driver's test in Naples. | no |
| ch-23.png | 23 — In It Together | Alligator Alley to the airport. The date with Rose set for next summer at the end of the last dock. Home in Fort Lauderdale, Matt opens the Guidebook and draws two blank lines under his name for Josh and Ben. | yes |

---

## 10. Emblems and site furniture — `assets/art/emblems/<id>.png`

| id | Size | What it is |
| --- | --- | --- |
| site-mark | 1024 × 1024 | The site mark: a leaping tarpon in a hand-drawn circle, ink only, one sunrise-orange dot for the eye. Must work at 32 px. |
| site-mark-wordmark | 2400 × 800 | The mark beside “Lostman’s River” — no, do NOT letter it; leave space to the right of the mark for the site’s own type. |
| compass-rose | 1024 × 1024 | Pen-and-ink compass rose like one drawn in a chart corner; the site already has an SVG version, this is the painted one for the chart page. |
| emblem-chart | 1024 × 1024 | Section emblem: a rolled chart and dividers. |
| emblem-fish | 1024 × 1024 | Section emblem: a snook silhouette. |
| emblem-crew | 1024 × 1024 | Section emblem: a weathered captain’s cap. |
| emblem-critters | 1024 × 1024 | Section emblem: a brown pelican on a piling. |
| emblem-boats | 1024 × 1024 | Section emblem: a center-console skiff, bow on. |
| emblem-tackle | 1024 × 1024 | Section emblem: an open tackle box with a popping cork and a spoon. |
| emblem-list | 1024 × 1024 | Section emblem: a pencil and a tick box. |
| emblem-sketchbook | 1024 × 1024 | Section emblem: a dip pen and an ink bottle. |
| emblem-about | 1024 × 1024 | Section emblem: the Guidebook itself, a thick water-stained book with a ribbon. |
| qr-frame | 2048 × 2048 | A hand-drawn frame for the printed QR codes: an open rectangle with a fishing line looping around it and a tiny hook; the center must stay empty and pure white; black ink only; print-safe. |
| divider-wave | 2400 × 200 | Horizontal ink divider: a water line with three mullet jumping. |
| divider-line | 2400 × 200 | Horizontal ink divider: a fishing line with a swivel in the middle and a hook at the right end. |
| texture-watercolor-sky | 2400 × 1600 | A plain watercolor sky wash in the cover blue fading to seafoam at the bottom, no subject; used as a page background. This one is NOT transparent. |
| texture-paper | 2048 × 2048 | Cream paper grain, seamless tile, very subtle. NOT transparent. |
| social-share | 1200 × 630 | Open-graph image: the cover composition reinterpreted — silhouetted angler casting from a skiff, seaplane high right, watercolor sky — with empty space on the left third for the title which the site overlays. NOT transparent. |
| badge-snook | 512 × 512 | Reader badge (future): a snook in a circle, “earned” look, ink and one wash. |
| badge-tarpon | 512 × 512 | Reader badge (future): a tarpon leaping in a circle. |
| badge-captain | 512 × 512 | Reader badge (future): a captain’s wheel in a circle. |

---

## 11. Photos the family should supply (not for an image model)

- A high-resolution file of the printed cover (the KDP cover PDF or JPG). The site currently has only a 129 × 199 px thumbnail.
- A photo of Linda and John together → `assets/photos/authors.jpg`.
- Caption for the “For Dad” dedication photo.
- Any photos of the real Chokoloskee, the boats, the airboat. Record each in `docs/CREDITS.md`.

## 12. Checklist before dropping files in

- [ ] PNG, transparent (except the three textures and the social image)
- [ ] No text, logos, borders, signatures
- [ ] Filename exactly matches the id, lower-case, `.png`
- [ ] Fish anatomy checked against the identification column
- [ ] Looks right next to one of Linda’s sketches at the same size
