import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}
export default function Wrapper({ children }: WrapperProps) {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-600">
      {children}
    </div>
  );
}
