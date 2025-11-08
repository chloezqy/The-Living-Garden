import { Spirit } from "../types";

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const PLANT_COUNT = 21;

export function matchSprite(spirit: Spirit): string {
  let id = spirit.id;

  id = `spirit_${Math.floor(Math.random() * 1e9)}`;
  spirit.id = id;

  const { traits = [], motionStyle = "still", archetype = "plant" } = spirit;
  const key = `${id}_${archetype}_${traits.sort().join("_")}_${motionStyle}`;
  const hash = Math.abs(hashCode(key));
  const index = hash % PLANT_COUNT;
  return `/plants-${index}.png`;
}