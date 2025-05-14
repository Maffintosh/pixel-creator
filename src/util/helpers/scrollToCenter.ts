export const scrollToCenter = (
  wrapperRef: React.RefObject<HTMLDivElement | null>,
) => {
  if (wrapperRef.current) {
    const wrapper = wrapperRef.current;

    const x = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
    const y = (wrapper.scrollHeight - wrapper.clientHeight) / 2;

    wrapper.scrollLeft = x;
    wrapper.scrollTop = y;
  }
};
