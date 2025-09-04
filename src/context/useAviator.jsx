import { useContext } from "react";
import { AviatorContext } from "./AviatorProvider";

export const useAviator = () => useContext(AviatorContext);
