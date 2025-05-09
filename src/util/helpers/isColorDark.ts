const getBrightness = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return 0.299 * r + 0.587 * g + 0.114 * b;
};

const isInsideCursor = (
  r: number,
  c: number,
  baseRow: number,
  baseCol: number,
  size: number,
) => {
  return (
    r >= baseRow && r < baseRow + size && c >= baseCol && c < baseCol + size
  );
};

const isColorDark = (hex: string): boolean => {
  const fullHex =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;

  return getBrightness(fullHex) < 128;
};

const getContrastingColor = (hex: string): string => {
  return isColorDark(hex) ? "#fff" : "#000";
};

export { getContrastingColor, getBrightness, isInsideCursor };
