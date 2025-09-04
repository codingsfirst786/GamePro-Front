import React, { createContext, useRef, useState, useEffect } from "react";

const AviatorContext = createContext(null);

export function AviatorProvider({ children }) {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [crashPoint, setCrashPoint] = useState(null);
  const [placedBets, setPlacedBets] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const intervalRef = useRef(null);
  const [currentBet, setCurrentBet] = useState(null);
  const [hasPlacedBets, setHasPlacedBets] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);

  // Load history with expiry check (20 mins)
  const loadHistory = () => {
    const saved = localStorage.getItem("aviator-history");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      const { data, timestamp } = parsed;

      const now = Date.now();
      const twentyMins = 20 * 60 * 1000;

      if (now - timestamp > twentyMins) {
        localStorage.removeItem("aviator-history");
        return [];
      }

      return data || [];
    } catch {
      localStorage.removeItem("aviator-history");
      return [];
    }
  };

  const [history, setHistory] = useState(loadHistory);

  // 🎲 Random crash generator
  const generateCrash = () => {
    const r = Math.random();
    const val = Math.max(1.5, Math.round(Math.pow(20, r) * 100) / 100);
    return Math.min(val, 50);
  };

  // 🚀 Start round
  const startRound = () => {
    if (isRunning || placedBets.length === 0 || roundEnded) return;
    const cp = generateCrash();
    setCrashPoint(cp);
    setMultiplier(1.0);
    setIsRunning(true);
    setRoundResults([]);
    setRoundEnded(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = Number((prev * 1.02 + 0.01).toFixed(2));
        if (next >= cp) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          setRoundEnded(true);
          finalizeRound(cp, false);
        }
        return next;
      });
    }, 100);
  };

  // ✅ Finalize round
  const finalizeRound = (crashAt, manualCashOut, betsOverride) => {
    const betsToResolve = betsOverride || placedBets;

    const round = {
      id: `CR${Date.now()}`,
      crashAt,
      bets: betsToResolve.map((b) => ({ ...b })),
      timestamp: new Date().toISOString(),
    };

    const resolved = round.bets.map((b) => {
      if (b.cashedAt) {
        return {
          ...b,
          result: Number((b.amount * b.cashedAt).toFixed(2)),
          stake: b.amount,
          cashed: true,
          manual: manualCashOut,
        };
      }
      return {
        ...b,
        result: 0,
        stake: b.amount,
        cashed: false,
        manual: false,
      };
    });

    const newHistory = [{ ...round, resolved }, ...history].slice(0, 100);
    setHistory(newHistory);

    // Save with new timestamp (reset expiry timer each update)
    localStorage.setItem(
      "aviator-history",
      JSON.stringify({ data: newHistory, timestamp: Date.now() })
    );

    // Store results for display until next round starts
    setRoundResults(resolved);

    // Reset placed bets for next round
    setPlacedBets([]);
  };

  // 💵 Cashout single bet
  const cashOut = (betId) => {
    setPlacedBets((prev) =>
      prev.map((b) =>
        b.id === betId && !b.cashedAt ? { ...b, cashedAt: multiplier } : b
      )
    );
  };

  // 💰 Cashout all bets (manual)
  const cashOutAll = () => {
    const snapshot = placedBets.map((b) =>
      !b.cashedAt ? { ...b, cashedAt: multiplier } : { ...b }
    );

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
    setRoundEnded(true);
    finalizeRound(multiplier, true, snapshot);
  };

  // 🎯 Place bet
  const placeBet = (amount) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return false;

    setRoundResults([]);
    setRoundEnded(false);

    const bet = {
      id: `B${Date.now()}${Math.floor(Math.random() * 999)}`,
      amount: Number(amount),
      cashedAt: null,
    };

    setPlacedBets((prev) => [bet, ...prev]);
    setCurrentBet(bet);
    setHasPlacedBets(true);
    return true;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <AviatorContext.Provider
      value={{
        multiplier,
        isRunning,
        crashPoint,
        startRound,
        placeBet,
        placedBets,
        cashOut,
        cashOutAll,
        history,
        currentBet,
        roundResults,
        hasPlacedBets,
        roundEnded,
      }}
    >
      {children}
    </AviatorContext.Provider>
  );
}

export { AviatorContext };
