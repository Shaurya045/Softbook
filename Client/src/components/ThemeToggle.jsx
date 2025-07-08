import React, { useContext } from "react";
import { Context } from "../context/Context";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(Context);

  // Colors for icons and backgrounds to ensure visibility in both themes
  const trackBg = theme === "light" ? "bg-gray-200" : "bg-gray-700";
  const knobBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const knobShadow = "shadow";
  const sunIconColor = theme === "light" ? "text-yellow-500" : "text-yellow-400";
  const moonIconColor = theme === "light" ? "text-gray-500" : "text-yellow-300";
  const trackSunColor = theme === "light" ? "text-yellow-400" : "text-yellow-300";
  const trackMoonColor = theme === "light" ? "text-gray-500" : "text-yellow-200";

  return (
    <div className="flex items-center justify-start cursor-pointer gap-[12px] p-[8px_10px]">
      <button
        onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
        className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${trackBg}`}
        aria-label="Toggle theme"
      >
        <span
          className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${theme === "light" ? "translate-x-0" : "translate-x-6"} ${knobBg} ${knobShadow}`}
        >
          {theme === "light" ? (
            <FaSun size={18} className={sunIconColor} />
          ) : (
            <FaMoon size={18} className={moonIconColor} />
          )}
        </span>
        {/* Track icons */}
        <span className={`absolute left-2 top-2 ${trackSunColor}`}>
          <FaSun size={14} />
        </span>
        <span className={`absolute right-2 top-2 ${trackMoonColor}`}>
          <FaMoon size={14} />
        </span>
      </button>
      <p className="max-[900px]:hidden">Dark/Light</p>
    </div>
  );
}

export default ThemeToggle;
