/**
 * Generate a random number
 * @param {number} min The minimum number
 * @param {number} max The maximum number
 * @returns {number} Random number between min and max
 */
export const getRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};
