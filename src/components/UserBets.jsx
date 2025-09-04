import { useAviator } from "../context/useAviator";

const UserBets = () => {
  const { placedBets, roundResults, isRunning, roundEnded } = useAviator();

  // Calculate total winnings and losses
  const totalWinnings = roundResults.reduce(
    (total, bet) => (bet.cashed ? total + bet.result : total),
    0
  );

  const totalLosses = roundResults.reduce(
    (total, bet) => (!bet.cashed ? total + bet.stake : total),
    0
  );

  const showActiveBets = isRunning || placedBets.length > 0;
  const showRoundResults =
    roundResults.length > 0 && roundEnded && placedBets.length === 0;

  return (
    <div className="rounded-xl shadow-lg overflow-hidden border border-[#5a2b20]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff6a00] via-[#ff3b00] to-[#ff2d00] text-white py-3 px-4 flex justify-between text-[11px] font-semibold tracking-wide">
        <div className="text-center">
          <div>👥 Bets</div>
          <div className="text-purple-200">
            {showActiveBets ? placedBets.length : roundResults.length}
          </div>
        </div>
        <div className="text-center">
          <div>📊 Stake</div>
          <div className="text-purple-200">
            {showActiveBets
              ? placedBets.reduce((s, b) => s + b.amount, 0)
              : roundResults.reduce((s, b) => s + b.stake, 0)}{" "}
            PKR
          </div>
        </div>
        <div className="text-center">
          <div>🏆 Winnings</div>
          <div className="text-purple-200">{totalWinnings} PKR</div>
        </div>
        <div className="text-center">
          <div>💔 Losses</div>
          <div className="text-purple-200">{totalLosses} PKR</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-[#1a0d0b] via-[#24120d] to-[#140906] text-white p-2 sm:p-4 overflow-y-auto h-[220px] sm:h-[350px] md:h-[500px]">
        <div className="grid grid-cols-4 text-center text-[10px] sm:text-[11px] text-gray-300 border-b border-[#5a2216] pb-1 sm:pb-2 mb-2">
          <span>USERID</span>
          <span>BET</span>
          <span>STATUS</span>
          <span>RESULT</span>
        </div>

        {/* Show active bets during game or between rounds */}
        {showActiveBets ? (
          placedBets.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-4 text-[10px] sm:text-[11px] py-2 sm:py-3 border-b border-[#2e1410] hover:bg-[#3a1a14] transition-colors duration-200 text-center"
            >
              <span className="text-[#ffdcbf]">
                ***{String(b.id).slice(-4)}
              </span>
              <span className="text-[#ffc39e]">{b.amount} PKR</span>
              <span
                className={
                  b.cashedAt
                    ? "text-green-400"
                    : isRunning
                    ? "text-yellow-300"
                    : "text-gray-400 text-[8px]"
                }
              >
                {b.cashedAt
                  ? `CASHED ${b.cashedAt.toFixed(2)}x`
                  : isRunning
                  ? "LIVE"
                  : "PENDING NEXT ROUND"}
              </span>
              <span className="text-[#ffdcbf]">
                {b.cashedAt
                  ? (b.amount * b.cashedAt).toFixed(2) + " PKR"
                  : isRunning
                  ? "—"
                  : (b.amount * 1).toFixed(2) + " PKR"}
              </span>
            </div>
          ))
        ) : /* Show round results after game ends when no new bets */
        showRoundResults ? (
          roundResults.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-4 text-[10px] sm:text-[11px] py-2 sm:py-3 border-b border-[#2e1410] hover:bg-[#3a1a14] transition-colors duration-200 text-center"
            >
              <span className="text-[#ffdcbf]">
                ***{String(b.id).slice(-4)}
              </span>
              <span className="text-[#ffc39e]">{b.stake} PKR</span>
              <span className={b.cashed ? "text-green-400" : "text-red-400"}>
                {b.cashed
                  ? `CASHED ${(b.result / b.stake).toFixed(2)}x`
                  : "CRASHED"}
              </span>
              <span className={b.cashed ? "text-green-400" : "text-red-400"}>
                {b.cashed
                  ? `+${b.result.toFixed(2)} PKR`
                  : `-${b.stake.toFixed(2)} PKR`}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400 text-[12px]">
            No active bets — place one!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBets;
