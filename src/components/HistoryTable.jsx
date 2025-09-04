import React from "react";
import { useAviator } from "../context/useAviator";

const HistoryTable = () => {
  const { history } = useAviator();

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1a0d0b] via-[#24120d] to-[#140906] text-white h-[250px] flex flex-col border border-[#5a2216]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff9a3c] via-[#ff5a2b] to-[#ff2d00] px-4 py-2 text-xs font-bold flex items-center justify-between tracking-wider">
        <span>📜 HISTORY</span>
        <span className="text-[11px] opacity-80">
          Last {history.length} Rounds
        </span>
      </div>

      {/* Table */}
      <div
        className="w-full overflow-x-auto"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <div className="min-w-[500px] sm:min-w-[600px]">
          {/* Headings */}
          <div className="grid grid-cols-6 text-[11px] font-semibold text-gray-300 px-4 py-2 border-b border-[#5a2216] bg-[#2b130f]">
            <span className="text-center">TIME</span>
            <span className="text-center">ROUND</span>
            <span className="text-center">BETS</span>
            <span className="text-center">STAKE</span>
            <span className="text-center">CRASH</span>
            <span className="text-center">RESULT</span>
          </div>

          {/* Rows */}
          <div
            className="overflow-y-auto max-h-[190px]"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            <style>
              {`
                /* Chrome, Safari and Edge */
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {history.length > 0 ? (
              history.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 text-[10px] sm:text-[11px] text-center px-2 sm:px-4 py-2 border-b border-[#2e1410] hover:bg-[#3a1a14] transition-all duration-150"
                >
                  <span className="text-[#ffdcbf]">
                    {new Date(row.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[#ffc39e]">{row.id}</span>
                  <span className="text-[#ffdcbf]">{row.bets.length}</span>
                  <span className="text-[#ffdfc7]">
                    {row.bets.reduce((s, a) => s + (a.amount || 0), 0)} PKR
                  </span>
                  <span className="text-[#ff8c66] font-bold">
                    {row.crashAt}x
                  </span>
                  <span
                    className={
                      row.resolved.reduce(
                        (s, r) => s + (r.result - r.stake),
                        0
                      ) >= 0
                        ? "text-green-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {row.resolved.reduce((s, r) => s + (r.result - r.stake), 0)}{" "}
                    PKR
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-[13px]">
                <p>No rounds yet — start the game to see history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
