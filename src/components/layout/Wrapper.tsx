import { type ReactNode, forwardRef } from "react";
import { getCursor } from "../../util/helpers/getCursor";
import { useAppStateContext } from "../../store/AppStateContext";

interface WrapperProps {
  children: ReactNode;
}
export default forwardRef<HTMLDivElement, WrapperProps>(function Wrapper(
  { children }: WrapperProps,
  ref,
) {
  const { isGrab, isGrabbing } = useAppStateContext();
  return (
    <div
      ref={ref}
      className={`w-screen h-screen overflow-scroll bg-gray-600 ${getCursor("wrapper", isGrab, isGrabbing)}`}
    >
      <div className="w-[150vw] h-[150vh] flex justify-center items-center">
        {children}
      </div>
    </div>
  );
});
