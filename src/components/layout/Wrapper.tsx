import { ReactNode } from "react";
import { getCursor } from "../../util/helpers/getCursor";

interface WrapperProps {
  children: ReactNode;
  isGrab: boolean;
  isGrabbing: boolean;
}
export default function Wrapper({
  children,
  isGrab,
  isGrabbing,
}: WrapperProps) {
  return (
    <div
      className={`w-[150%] h-[150vh] flex justify-center items-center bg-slate-600 ${getCursor("wrapper", isGrab, isGrabbing)}`}
    >
      {children}
    </div>
  );
}
