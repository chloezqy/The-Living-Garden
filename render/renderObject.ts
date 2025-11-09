import p5 from "p5";
import { Spirit } from "../types";
import { matchSprite } from "../lib/matchSprite";

const spriteCache: Record<string, p5.Image> = {};

/**
 * Renders a static spirit sprite chosen via matchSprite().
 * Enlarges plants for visual balance.
 */
export function renderPlant(p: p5, spirit: Spirit) {
  const spritePath = matchSprite(spirit);
  if (!spritePath) return;

  // 只加载一次
  if (!spriteCache[spritePath]) {
    spriteCache[spritePath] = p.loadImage(spritePath);
  }

  const img = spriteCache[spritePath];
  if (!img || !img.width || !img.height) return;

  // 按类型控制整体视觉高度
  let baseHeight = 180;
  if (spirit.archetype === "plant") baseHeight = 280;
  if (spirit.archetype === "animal") baseHeight = 220;
  if (spirit.archetype === "cloud") baseHeight = 200;

  // growth 控制微调差异
  const scale = 0.8 + spirit.growth.branching * 0.4;

  const aspect = img.width / img.height;
  const targetHeight = baseHeight * scale;
  const targetWidth = targetHeight * aspect;

  // 绘制
  p.push();
  p.translate(spirit.x ?? 0, spirit.y ?? 0);
  p.imageMode(p.CENTER);
  p.noTint();
  p.image(img, 0, 0, targetWidth, targetHeight);
  p.pop();
}