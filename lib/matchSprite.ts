import { Spirit } from "../types";

// 🌿 Simple hash → stable index (same sprite for same ID)
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32-bit integer
  }
  return hash;
};

// 🌿 Number of available plant sprites (plants-0.png → plants-20.png)
const PLANT_COUNT = 21;

/**
 * 🌱 All archetypes use plant images for now.
 * Chooses one deterministically from spirit.id (so it never changes).
 */
export function matchSprite(spirit: Spirit): string {
  const { id } = spirit;
  const hash = Math.abs(hashCode(id));
  const index = hash % PLANT_COUNT; // 0 → 20
  return `/plants-${index}.png`;
}