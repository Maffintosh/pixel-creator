const getCursor = (
  target: string,
  isGrab: boolean,
  isGrabbing: boolean,
): string => {
  switch (target) {
    case "wrapper":
      if (isGrabbing) {
        return "cursor-grabbing";
      } else if (isGrab) {
        return "cursor-grab";
      } else {
        return "cursor-default";
      }
    case "canvas":
      if (isGrabbing) {
        return "cursor-grabbing";
      } else if (isGrab) {
        return "cursor-grab";
      } else {
        return "cursor-crosshair";
      }
    default:
      return "";
  }
};

export { getCursor };
