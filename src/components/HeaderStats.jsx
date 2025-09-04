import React from "react";

const HeaderStats = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white p-4 sm:p-5 rounded-t-xl flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between gap-4 sm:gap-6 px-4 sm:px-6 text-xs sm:text-sm font-semibold shadow-lg border-b border-orange-300">
      {" "}
      <div className="text-center">
        <div className="uppercase tracking-wider text-white/90">
          Number of bets
        </div>
        <div className="text-yellow-200 text-base">👥 1348</div>
      </div>
      <div className="text-center">
        <div className="uppercase tracking-wider text-white/90">Total bets</div>
        <div className="text-yellow-200 text-base">📊 471003.96 PKR</div>
      </div>
      <div className="text-center">
        <div className="uppercase tracking-wider text-white/90">
          Total winnings
        </div>
        <div className="text-yellow-200 text-base">🏆 0 PKR</div>
      </div>
    </div>
  );
};

export default HeaderStats;
