import { HSV } from "../../store/SelectedToolContext";

export default function hsvToCss({ h, s, v }: HSV): string {
  return `hsl(${h}, ${s * 100}%, ${v * 50}%)`;
}
