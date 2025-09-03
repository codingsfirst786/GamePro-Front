import { useEffect, useState } from "react";
import SpinWheel from "./SpinWheel";
import { FaTimes, FaDice } from "react-icons/fa";

const Wheelgame = () => {
  const [userBalance, setUserBalance] = useState(5000);
  const [betAmount, setBetAmount] = useState("");
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [placedBet, setPlacedBet] = useState(0);
  const [selectedBetType, setSelectedBetType] = useState(null);
  const [showBetTypeOverlay, setShowBetTypeOverlay] = useState(false);

  const betAmounts = [20, 100, 300, 800, 3000, 10000];
  const betTypes = ["2x", "4x", "5x", "7x", "10x", "20x"];

  const handleBetTypeClick = (type) => {
    setSelectedBetType(type);
    setShowBetTypeOverlay(false);
    setWinner(null);
    setShowGlow(false);
  };

  const handleBetAmountClick = (amount) => {
    if (!selectedBetType) return;
    const currentBet = parseInt(betAmount) || 0;
    if (amount <= userBalance) {
      const totalBet = currentBet + amount;
      setBetAmount(totalBet.toString());
      setUserBalance((prev) => prev - amount);
    } else {
      alert("Not enough balance for this bet!");
    }
  };

  const handleInputChange = (e) => {
    if (!selectedBetType) return;
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const newBet = parseInt(value) || 0;

      if (newBet > userBalance + (parseInt(betAmount) || 0)) {
        return;
      }

      setUserBalance((prev) => prev + (parseInt(betAmount) || 0) - newBet);

      setBetAmount(value);
    }
  };

  const placeBet = () => {
    if (!selectedBetType) {
      alert("Select a bet type first!");
      return;
    }
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      alert("Enter a valid bet amount!");
      return;
    }

    setPlacedBet(bet);
    setBetAmount("");
    setSpinTrigger((prev) => prev + 1);
    setWinner(null);
    setShowGlow(false);
  };

  useEffect(() => {
    if (!spinning && winner !== null && placedBet > 0 && selectedBetType) {
      setShowGlow(true);

      // Only apply winnings if the selected bet type matches the winner
      if (winner === selectedBetType) {
        const multiplier = parseInt(winner.replace("x", "")) || 1;
        const winnings = placedBet * multiplier;
        setUserBalance((prev) => prev + winnings);
      }

      setPlacedBet(0);
    }
  }, [spinning, winner, placedBet, selectedBetType]);

  return (
    <div className="relative min-h-screen p-4 sm:p-6 md:p-8 text-white font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/spin bg9.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* Spin Wheel */}
        <div className="relative w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 mb-6 sm:mb-8 md:mb-10 flex items-center justify-center">
          {/* Outer Ring Image */}
          <img
            src="/spin ring.png"
            alt="Outer Ring"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] object-contain z-30"
          />

          {/* Inner Wheel */}
          <div className="relative -top-1 left-0.5 md:left-1 lg:-top-2 -rotate-2 w-[100%] h-[100%] rounded-full flex items-center justify-center z-20">
            <SpinWheel
              spinTrigger={spinTrigger}
              onWin={(val) => setWinner(val)}
              onSpinState={setSpinning}
            />
          </div>

          {/* Fixed Pointer */}
          {winner !== null && showGlow && (
            <div className="absolute top-1/2 left-6 -translate-y-1/2 rotate-180 z-30">
              <div className="w-[35px] h-[44px] bg-yellow-400 opacity-60 blur-xl rounded-md" />
            </div>
          )}

          {/* Bet type buttons - top right */}
          <div className="hidden md:flex absolute top-2 -right-24 flex-col gap-2 z-30">
            {betTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleBetTypeClick(type)}
                className={`px-3 py-2 rounded-lg font-semibold border-2 ${
                  selectedBetType === type
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-green-600 text-white border-green-500"
                } hover:scale-105 transition-transform duration-200`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="md:hidden absolute top-3 -right-9 z-40">
            <button
              onClick={() => setShowBetTypeOverlay(true)}
              title="Select Bet Type"
              className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <FaDice size={28} />
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        {showBetTypeOverlay && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-5 relative">
              {/* Close Icon */}
              <button
                onClick={() => setShowBetTypeOverlay(false)}
                className="absolute top-3 right-3 text-white hover:text-red-500 transition-colors duration-200 text-xl"
              >
                <FaTimes />
              </button>

              {/* Title */}
              <h2 className="text-center text-white text-xl font-bold tracking-wide drop-shadow-lg">
                Choose Bet Type
              </h2>

              {/* Bet Type Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {betTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBetTypeClick(type)}
                    className={`px-3 py-2 rounded-xl font-bold text-lg border-2 transition-transform duration-200 hover:scale-110 hover:shadow-neon ${
                      selectedBetType === type
                        ? "bg-yellow-400 text-black border-yellow-400 shadow-neon"
                        : "bg-green-700 border-green-800 text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Winner display */}
        <div className="text-lg sm:text-xs font-bold text-yellow-400 animate-bounce z-20 relative">
          🎉 Winner: {winner || "--"}
        </div>

        {/* Bet Amount Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-20 relative">
          {betAmounts.map((amount, idx) => (
            <button
              key={idx}
              onClick={() => handleBetAmountClick(amount)}
              disabled={!selectedBetType} // disabled until bet type selected
              className={`bg-green-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 rounded-xl shadow-md border border-green-500 hover:scale-105 hover:shadow-lg transition-transform duration-200 text-sm sm:text-base md:text-lg ${
                !selectedBetType ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>

        {/* Bet Input + Place Bet */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-20 relative">
          <input
            type="text"
            value={betAmount}
            onChange={handleInputChange}
            placeholder="Enter your bet"
            disabled={!selectedBetType} // disabled until bet type selected
            className={`w-full sm:w-44 md:w-64 lg:w-72 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base md:text-lg font-semibold text-center bg-black border-2 border-green-500 text-white shadow-sm focus:outline-none ${
              !selectedBetType ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <button
            onClick={placeBet}
            disabled={!selectedBetType} // disabled until bet type selected
            className={`w-full bg-green-600 text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl shadow-md border border-green-500 hover:scale-105 hover:shadow-lg transition-transform duration-200 text-sm sm:text-base md:text-lg ${
              !selectedBetType ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Place a Bet
          </button>
        </div>

        {/* Account Balance */}
        <div className="bg-green-600 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl shadow-md border border-green-500 text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-20 relative">
          Balance: ₹{userBalance}
        </div>
      </div>
    </div>
  );
};

export default Wheelgame;
