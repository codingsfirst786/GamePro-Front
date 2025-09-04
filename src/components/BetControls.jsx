import { useState } from "react";
import { useAviator } from "../context/useAviator";
import { FaTimes } from "react-icons/fa";

const BetControls = ({ compact }) => {
  const { placeBet, isRunning, placedBets } = useAviator(); // NEW: Add placedBets
  const amounts = [60, 300, 800, 2000, 8000, 30000];
  const [value, setValue] = useState("60");

  const handleChange = (e) => {
    if (/^\d*$/.test(e.target.value)) setValue(e.target.value);
  };

  const handleClear = () => setValue("");

  const handlePlace = () => {
    const ok = placeBet(Number(value));
    if (ok) {
      setValue("");
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-[#2a0b03] via-[#2f0f05] to-[#40120a] 
      p-2 sm:p-3 rounded-md shadow-md flex flex-col gap-2 sm:gap-3 
      text-[10px] sm:text-xs w-full border border-[#5a2b20] text-white`}
    >
      {/* Quick bet buttons + Place bet */}
      <div
        className={`flex flex-col sm:flex-row gap-2 w-full ${
          compact ? "py-1" : ""
        }`}
      >
        {/* Quick bets grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 flex-1 min-w-0">
          {amounts.map((amt, i) => (
            <button
              key={i}
              onClick={() => setValue(amt.toString())}
              disabled={isRunning}
              className={`py-[4px] sm:py-[6px] rounded border text-[10px] sm:text-xs transition-colors ${
                isRunning
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#3b1208] hover:bg-[#ff6600] text-white border-transparent hover:border-white"
              }`}
            >
              {amt}
            </button>
          ))}
        </div>

        {/* Place bet button */}
        <div className="w-full sm:w-[100px] flex-shrink-0">
          <button
            onClick={handlePlace}
            disabled={isRunning}
            className={`w-full h-full rounded py-[6px] sm:py-2 text-[11px] sm:text-xs 
            font-bold shadow tracking-wide text-center ${
              isRunning
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-[#ff6a00] to-[#ff2d00] hover:opacity-95 text-white"
            }`}
          >
            {isRunning ? "WAIT..." : "PLACE BET"}
            {!isRunning && (
              <div className="text-[7px] sm:text-[8px] font-normal">
                {placedBets.length > 0
                  ? "Round will start soon"
                  : "(next round)"}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Input + Autoplay */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {/* Input field */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            disabled={isRunning}
            className={`px-2 py-[4px] pr-6 rounded w-full text-[10px] sm:text-xs border outline-none ${
              isRunning
                ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                : "bg-[#2b1110] text-white border-[#55332a] focus:border-[#ff6a00]"
            }`}
          />
          {value && !isRunning && (
            <FaTimes
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs cursor-pointer hover:text-white"
              onClick={handleClear}
            />
          )}
        </div>

        {/* Autoplay button */}
        <button
          disabled={isRunning}
          className={`font-bold px-2 sm:px-3 py-[4px] sm:py-2 rounded text-[10px] sm:text-xs 
          tracking-wider border transition-colors ${
            isRunning
              ? "border-gray-600 text-gray-400 cursor-not-allowed"
              : "border-[#ff6a00] text-[#ff6a00] hover:bg-[#ff6a00] hover:text-white"
          }`}
        >
          AUTOPLAY
        </button>
      </div>
    </div>
  );
};

export default BetControls;
