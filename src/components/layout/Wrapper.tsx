import { type ReactNode, forwardRef } from "react";
import { getCursor } from "../../util/helpers/getCursor";

interface WrapperProps {
  children: ReactNode;
  isGrab: boolean;
  isGrabbing: boolean;
}
export default forwardRef<HTMLDivElement, WrapperProps>(function Wrapper(
  { children, isGrab, isGrabbing }: WrapperProps,
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-screen h-screen overflow-scroll bg-slate-600 ${getCursor("wrapper", isGrab, isGrabbing)}`}
    >
      <div className="w-[150vw] h-[150vh] flex justify-center items-center">
        {children}
      </div>
    </div>
  );
});
