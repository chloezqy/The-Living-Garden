import { Spirit } from "../types";

const PLANT_COUNT = 21;
const ANIMAL_COUNT = 8;
const CLOUD_COUNT = 15;

export function matchSprite(spirit: Spirit): string {
  const spriteKey = `sprite_${spirit.id}`;

  const savedSprite = localStorage.getItem(spriteKey);
  if (savedSprite) return savedSprite;

  let spritePath = "";
  switch (spirit.archetype) {
    case "animal":
      spritePath = `/animals-${Math.floor(Math.random() * ANIMAL_COUNT)}.png`;
      break;
    case "cloud":
      spritePath = `/clouds-${Math.floor(Math.random() * CLOUD_COUNT)}.png`;
      break;
    default:
      spritePath = `/plants-${Math.floor(Math.random() * PLANT_COUNT)}.png`;
      break;
  }

  localStorage.setItem(spriteKey, spritePath);
  return spritePath;
}

export function getStablePosition(spiritId: string, canvasWidth: number, canvasHeight: number) {
  const posKey = `pos_${spiritId}`;
  const saved = localStorage.getItem(posKey);
  if (saved) return JSON.parse(saved);

  const pos = {
    x: Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1,
    y: Math.random() * canvasHeight * 0.5 + canvasHeight * 0.4,
  };

  localStorage.setItem(posKey, JSON.stringify(pos));
  return pos;
}