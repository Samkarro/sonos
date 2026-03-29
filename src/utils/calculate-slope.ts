export const barHeightCalculator = (
  value: number,
  CANVAS_HEIGHT: number,
): number => {
  const curved = Math.pow(value, 1.5);
  let calculated = 2 + curved * 12 * (CANVAS_HEIGHT * 0.8);
  if (calculated > CANVAS_HEIGHT) {
    calculated = CANVAS_HEIGHT;
  }
  return Math.min(calculated, CANVAS_HEIGHT);
};
