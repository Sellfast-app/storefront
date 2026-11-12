export function getContrastingTextColor(hexColor: string): "#111827" | "#FFFFFF" {
  const normalized = hexColor.replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((value) => value + value).join("")
    : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return "#FFFFFF";

  const channels = [0, 2, 4].map((offset) => parseInt(expanded.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast > whiteContrast ? "#111827" : "#FFFFFF";
}
