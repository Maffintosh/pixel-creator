const isEdge = (penSize: number, dy: number, dx: number): boolean => {
  return (
    (dy === 0 && dx === 0) ||
    (dy === 0 && dx === penSize - 1) ||
    (dy === penSize - 1 && dx === 0) ||
    (dy === penSize - 1 && dx === penSize - 1)
  );
};

export { isEdge };
