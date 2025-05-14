import { type Dispatch, type SetStateAction } from "react";

//SSA stands for Set State Action
export type SSA<T> = Dispatch<SetStateAction<T>>;
