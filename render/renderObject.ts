import p5 from "p5";
import { Spirit } from "../types";
import { matchSprite } from "../lib/matchSprite";

// 🌿 Cache loaded images
const plantCache: Record<string, p5.Image> = {};

/**
 * Renders a static plant sprite chosen via matchSprite().
 */
export function renderPlant(p: p5, spirit: Spirit) {
  const spritePath = matchSprite(spirit);

  if (!spritePath) return;

  // ✅ Load once
  if (!plantCache[spritePath]) {
    plantCache[spritePath] = p.loadImage(spritePath);
  }

  const img = plantCache[spritePath];
  if (!img || !img.width || !img.height) return;

  // 🌱 Determine scale based on growth
  const baseHeight = 180; // roughly how tall plants appear
  const scale = 0.6 + spirit.growth.branching * 0.4;

  const aspect = img.width / img.height;
  const targetHeight = baseHeight * scale;
  const targetWidth = targetHeight * aspect;

  // 🌿 Draw static image (no motion)
  p.push();
  p.translate(spirit.x ?? 0, spirit.y ?? 0);
  p.imageMode(p.CENTER);
  p.noTint();
  p.image(img, 0, 0, targetWidth, targetHeight);
  p.pop();
}