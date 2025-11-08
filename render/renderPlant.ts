import p5 from "p5";
import { Spirit } from "../types";
import { matchSprite } from "../lib/matchSprite";

const plantCache: Record<string, p5.Image> = {};

export function renderPlant(p: p5, spirit: Spirit) {
  const spritePath = matchSprite(spirit);
  if (!spritePath) return;

  if (!plantCache[spritePath]) {
    plantCache[spritePath] = p.loadImage(spritePath);
  }
  const img = plantCache[spritePath];
  if (!img || !img.width || !img.height) return;

  // 🌿 Base scale relative to canvas width
  const baseScale = p.width < 800 ? 0.6 : 1.2; // tweak these
  const growthFactor = 0.5 + spirit.growth.branching * 0.8; // amplify variety
  const densityFix = p.pixelDensity(); // 1 or 2 on retina
  const scale = (baseScale + growthFactor) / densityFix;

  // 🌸 Maintain aspect ratio
  const aspect = img.width / img.height;
  const targetHeight = 200 * scale; // make it clearly visible
  const targetWidth = targetHeight * aspect;

  p.push();
  p.translate(spirit.x ?? 0, spirit.y ?? 0);
  p.imageMode(p.CENTER);
  p.noTint();

  p.image(img, 0, 0, targetWidth, targetHeight);
  p.pop();
}
