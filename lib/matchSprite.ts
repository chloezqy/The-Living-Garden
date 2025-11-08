import { Spirit } from "../types";

// 🌿 简单 hash → 稳定 index
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

// 你的 plant 图片数量
const PLANT_COUNT = 19;

/**
 * 🌿 临时统一：所有 spirit（plant / animal / cloud）都使用 plant 系列图片
 */
export function matchSprite(spirit: Spirit): string {
  const { archetype, traits, motionStyle } = spirit;

  // 用 spirit 的 archetype + traits + motionStyle 生成稳定 hash
  const key = `${archetype}_${traits.sort().join("_")}_${motionStyle}`;
  const hash = Math.abs(hashCode(key));

  // 保证结果 1～19 之间
  const index = (hash % PLANT_COUNT) + 1;

  // ✅ 统一返回 plant 图
  return `/plant-${index}.png`;
}