const getCursor = (
  context: string,
  isGrab: boolean,
  isGrabbing: boolean,
): string => {
  switch (context) {
    case "wrapper":
      if (!isGrab) return "cursor-default";
      return isGrabbing ? "cursor-grabbing" : "cursor-grab";
    case "canvas":
      if (!isGrab) return "cursor-crosshair";
      return isGrabbing ? "cursor-grabbing" : "cursor-grab";
    default:
      return "";
  }
};

export { getCursor };
