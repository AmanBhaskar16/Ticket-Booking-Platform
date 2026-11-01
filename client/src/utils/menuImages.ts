import type { MenuCategory, MenuItem } from "../types/movie.types.ts";

// Bundled stock food photography (see constants/photoCredits.ts) used until a theatre
// uploads a photo for the item. Uploaded images always take priority.
const IMG = (name: string) => `/images/food/${name}.jpg`;

// First match wins, so the specific popcorn flavours come before plain "popcorn"
const BY_NAME: [RegExp, string][] = [
  [/caramel/i,                         "popcorn-caramel"],
  [/cheese.*popcorn|popcorn.*cheese/i, "popcorn-cheese"],
  [/combo|meal|bucket/i,               "combo"],
  [/popcorn/i,                         "popcorn-salted"],
  [/nacho/i,                           "nachos"],
  [/fries|chips|wedges/i,              "fries"],
  [/burger/i,                          "burger"],
  [/sandwich|toast|sub\b/i,            "sandwich"],
  [/samosa|puff|kachori/i,             "samosa"],
  [/hot ?dog|sausage/i,                "hotdog"],
  [/coffee|frapp|latte|cappuccino/i,   "cold-coffee"],
  [/chai|tea\b/i,                      "chai"],
  [/water/i,                           "water"],
  [/pepsi|coke|cola|soda|soft drink|sprite|7.?up|mojito|lemonade|juice/i, "cola"],
  [/brownie|cake|muffin|cookie/i,      "brownie"],
  [/ice ?cream|sundae|kulfi|gelato/i,  "ice-cream"],
];

const BY_CATEGORY: Record<MenuCategory, string> = {
  Popcorn:   "popcorn-salted",
  Combos:    "combo",
  Snacks:    "nachos",
  Beverages: "cola",
  Desserts:  "ice-cream",
};

/** Owner's photo for a menu item, else a matching stock photo */
export function menuItemPhoto(item: Pick<MenuItem, "name" | "category" | "image">): string {
  if (item.image) return item.image;
  const hit = BY_NAME.find(([re]) => re.test(item.name));
  return IMG(hit ? hit[1] : BY_CATEGORY[item.category] ?? "combo");
}
