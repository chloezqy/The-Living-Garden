
import p5 from 'p5';

/**
 * Gets the primary color from a spirit's palette.
 * @param palette - Array of hex color strings.
 * @returns The first color in the palette or a default.
 */
export const getPrimaryColor = (palette: string[]): string => {
  return palette?.[0] || '#FFFFFF';
};

/**
 * Gets a random color from a spirit's palette.
 * @param p - The p5 instance.
 * @param palette - Array of hex color strings.
 * @returns A p5.Color object.
 */
export const getRandomPaletteColor = (p: p5, palette: string[]): p5.Color => {
    if (!palette || palette.length === 0) {
        return p.color(255);
    }
    const colorStr = palette[Math.floor(p.random(palette.length))];
    return p.color(colorStr);
};

/**
 * Calculates the average color from a list of palettes.
 * @param p - The p5 instance.
 * @param palettes - An array of color palettes (string arrays).
 * @returns A p5.Color object representing the average color.
 */
export const getAverageColor = (p: p5, palettes: string[][]): p5.Color => {
    let r = 0, g = 0, b = 0;
    let count = 0;

    palettes.forEach(palette => {
        if (palette && palette.length > 0) {
            const primaryColor = p.color(palette[0]);
            r += p.red(primaryColor);
            g += p.green(primaryColor);
            b += p.blue(primaryColor);
            count++;
        }
    });

    if (count === 0) {
        return p.color(20, 20, 40); // Default dark blue
    }

    return p.color(r / count, g / count, b / count);
}
