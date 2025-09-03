import { useState, useEffect, useRef } from "react";
import DiceScene from "./DiceScene";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoMdRefreshCircle } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import "../Css/Dice.css";

const DiceGame = () => {
  const [dice, setDice] = useState([1, 1]);
  const [balance, setBalance] = useState(18304);
  const [betAmount, setBetAmount] = useState(320);
  const [selectedBet, setSelectedBet] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedControl, setSelectedControl] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const wrapperRef = useRef(null);
  const multipliers = { over: 2.3, equal: 5.8, under: 2.3 };

  const dummyHistory = [
    {
      date: "2025-09-01",
      bet: "Over",
      betAmount: 500,
      dice: [4, 5],
      result: "Win",
      amount: "+650",
    },
    {
      date: "2025-09-02",
      bet: "Equal",
      betAmount: 200,
      dice: [3, 4],
      result: "Win",
      amount: "+1160",
    },
    {
      date: "2025-09-03",
      bet: "Under",
      betAmount: 300,
      dice: [1, 2],
      result: "Loss",
      amount: "-300",
    },
    {
      date: "2025-09-04",
      bet: "Over",
      betAmount: 800,
      dice: [6, 2],
      result: "Loss",
      amount: "-800",
    },
  ];

  const [history, setHistory] = useState(dummyHistory);

  // --- AUTO SCALE TO FIT 89VH ---
  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const maxHeight = window.innerHeight * 0.89;
      setScale(Math.min(1, maxHeight / wrapperHeight));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetGame = () => {
    setDice([1, 1]);
    setBalance(18304);
    setBetAmount(320);
    setSelectedBet(null);
    setMessage("");
    setSelectedControl(null);
    setRolling(false);
    setHistory(dummyHistory);
  };

  const rollDice = () => {
    if (!selectedBet) return setMessage("Select a bet first!");
    if (betAmount > balance) return setMessage("Insufficient balance!");

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice([d1, d2]);
    setRolling(true);
    setMessage("🎲 Rolling...");

    setTimeout(() => {
      setRolling(false);
      const total = d1 + d2;
      let win = false;
      if (selectedBet === "over" && total > 7) win = true;
      if (selectedBet === "equal" && total === 7) win = true;
      if (selectedBet === "under" && total < 7) win = true;

      const today = new Date().toISOString().split("T")[0];
      if (win) {
        const wonAmount = betAmount * multipliers[selectedBet];
        setBalance((prev) => prev + wonAmount);
        setMessage(`YOU WON ${wonAmount.toFixed(0)} PKR`);

        setHistory((prev) => [
          {
            date: today,
            bet: selectedBet.charAt(0).toUpperCase() + selectedBet.slice(1),
            betAmount,
            dice: [d1, d2],
            result: "Win",
            amount: `+${wonAmount.toFixed(0)}`,
          },
          ...prev,
        ]);
      } else {
        setBalance((prev) => prev - betAmount);
        setMessage("You lost, try again!");

        setHistory((prev) => [
          {
            date: today,
            bet: selectedBet.charAt(0).toUpperCase() + selectedBet.slice(1),
            betAmount,
            dice: [d1, d2],
            result: "Loss",
            amount: `-${betAmount}`,
          },
          ...prev,
        ]);
      }
    }, 1500);
  };

  const handleMin = () => setBetAmount(20);
  const handleX2 = () => setBetAmount((prev) => prev * 2);
  const handleHalf = () => setBetAmount((prev) => Math.max(1, prev / 2));
  const handleMax = () => setBetAmount(balance);

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gradient-to-tr from-[#0c0f0f] via-[#0d1a16] to-[#0c0f0f] text-white py-6">
      <div
        ref={wrapperRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="w-full max-w-sm rounded-[2rem] p-4 my-4 flex flex-col items-center border border-[#10b981] bg-[#1b3026] shadow-[0_0_45px_#10b98166] backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex items-center justify-start w-full px-4 py-2 gap-4 mb-4">
          <button
            onClick={() => setShowInfo(true)}
            className="w-8 h-8 rounded-full bg-[#10b981] text-black text-xl font-extrabold shadow-[0_0_14px_#10b981aa] hover:scale-110 transition-transform"
          >
            ?
          </button>
          <div className="text-sm bg-[#111827] text-white border border-[#2f3e35] rounded-lg py-1 px-3 w-full text-center font-semibold tracking-wide">
            Select your odds
          </div>
        </div>

        {/* Dice */}
        <div className="flex gap-6 mb-6 border border-[#2d3e34] rounded-xl p-4 shadow-inner bg-[#192c23]">
          <DiceScene values={dice} rolling={rolling} />
        </div>

        {/* Bet options */}
        <div className="grid grid-cols-3 gap-3 mb-4 w-full">
          {["over", "equal", "under"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedBet(type)}
              className={`py-2 text-xs font-bold rounded-xl border-2 transition-all duration-200 border-[#facc15] tracking-wide shadow-md ${
                selectedBet === type
                  ? "bg-[#facc15] text-black shadow-[0_0_16px_#facc15cc] scale-105"
                  : "bg-transparent text-[#facc15] hover:bg-[#facc1533]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} 7
              <br />
              <span
                className={selectedBet === type ? "text-black" : "text-white"}
              >
                × {multipliers[type]}
              </span>
            </button>
          ))}
        </div>

        {/* Bet controls */}
        <div className="flex justify-between w-full gap-2 text-xs font-semibold mb-4">
          {["min", "x2", "x/2", "max"].map((ctrl) => (
            <button
              key={ctrl}
              onClick={() => {
                if (ctrl === "min") handleMin();
                if (ctrl === "x2") handleX2();
                if (ctrl === "x/2") handleHalf();
                if (ctrl === "max") handleMax();
                setSelectedControl(ctrl);
              }}
              className={`flex-1 px-2 py-2 rounded-xl transition-all duration-200 text-white font-bold tracking-wide ${
                selectedControl === ctrl
                  ? "bg-[#10b98133] ring-2 ring-[#10b981] shadow-[0_0_12px_#10b981aa]"
                  : "bg-[#111827] hover:bg-[#10b98122]"
              }`}
            >
              {ctrl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex gap-7 w-full items-center mb-4">
          <div className=" w-1/2 mx-auto text-center bg-[#111827] border-2 border-[#10b981] rounded-xl py-1.5 text-white text-sm font-bold shadow-[0_0_10px_#10b98188]">
            {betAmount} PKR
          </div>
          <div className="bg-[#10b981] w-1/2 text-black font-bold text-[9px] px-1 py-2 rounded-xl text-center shadow-[0_0_14px_#10b981aa]">
            {message ? `Result: ${message}` : "Waiting for roll..."}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-4 mb-4">
          <button
            onClick={() => setShowHistory(true)}
            title="Game History"
            className="w-10 h-10 bg-[#1f2937] border border-[#facc15] text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_14px_#facc15aa] transition-all"
          >
            <HiOutlineClipboardList size={18} />
          </button>

          <button
            onClick={rollDice}
            title="Roll Dice"
            className="w-12 h-12 bg-gradient-to-tr from-[#10b981] to-[#facc15] text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_40px_#10b981aa] hover:scale-110 transition-transform"
          >
            <FaPlay size={24} />
          </button>

          <button
            onClick={resetGame}
            title="Reset Game"
            className="w-10 h-10 bg-[#1f2937] border border-[#facc15] text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_14px_#facc15aa] transition-all"
          >
            <IoMdRefreshCircle size={20} />
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-[#10b981] rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <FaInfoCircle className="text-[#facc15] text-4xl mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2 text-[#10b981]">
              How to Play
            </h2>
            <p className="text-sm text-gray-200 mb-4">
              🎲 Bet on <span className="text-[#facc15]">Over</span> (sum &gt;
              7), <span className="text-[#facc15]">Under</span> (sum &lt; 7), or{" "}
              <span className="text-[#facc15]">Equal</span> (sum = 7). <br />
              Win according to the multiplier and grow your balance!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2 bg-gradient-to-r from-[#10b981] to-[#facc15] text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed top-8 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-[#facc15] rounded-2xl p-6 shadow-2xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-[#facc15]">
              🎲 Game History
            </h2>

            {/* Fixed scrollable area */}
            <div className="h-64 overflow-y-auto pr-2 custom-scroll space-y-2">
              {(showAllHistory ? history : history.slice(0, 5)).map(
                (h, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm shadow-md ${
                      h.result === "Win"
                        ? "bg-green-500/20 border border-green-400"
                        : "bg-red-500/20 border border-red-400"
                    }`}
                  >
                    <span className="text-xs text-gray-300">{h.date}</span>
                    <span className="font-bold">{h.bet}</span>
                    <span>Bet: {h.betAmount}</span>
                    <span>🎲 {h.dice.join(",")}</span>
                    <span
                      className={`font-bold ${
                        h.result === "Win" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {h.amount}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Show More / Show Less button */}
            {history.length > 5 && (
              <button
                onClick={() => setShowAllHistory((prev) => !prev)}
                className="mt-2 w-full py-2 bg-[#1f2937] text-[#facc15] border border-[#facc15] font-bold rounded-xl hover:bg-[#facc1533] transition-all"
              >
                {showAllHistory ? "Show Less" : "Show More"}
              </button>
            )}

            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full py-2 bg-gradient-to-r from-[#facc15] to-[#10b981] text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceGame;
