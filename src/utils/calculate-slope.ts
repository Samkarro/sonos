export const barHeightCalculator = (
  value: number,
  CANVAS_HEIGHT: number,
): number => {
  const normalized = value / 255;
  const curved = Math.pow(normalized, 4);
  const calculated = 2 + curved * (CANVAS_HEIGHT * 0.8);

  return Math.min(calculated, CANVAS_HEIGHT);
};
