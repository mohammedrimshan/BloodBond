import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return <>{children}</>;
};
