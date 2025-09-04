import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAviator } from "../context/useAviator";

const PlaneSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    className="w-14 h-14 fill-[#ff2d00] drop-shadow-[0_0_12px_rgba(255,45,0,0.8)]"
  >
    <path d="M640 256c0-17.7-14.3-32-32-32H379.3L313.5 64h-47L288 224H80L32 192H0l32 64L0 320h32l48-32h208l-21.5 160h47l65.8-160H608c17.7 0 32-14.3 32-32z" />
  </svg>
);

const GameArea = () => {
  console.log(motion);
  const {
    multiplier,
    isRunning,
    startRound,
    cashOutAll,
    placedBets,
    roundEnded,
  } = useAviator();

  const [progress, setProgress] = useState(0); // 0..100
  const [countdown, setCountdown] = useState(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const el = document.getElementById("game-container");
      if (el) {
        setContainerDimensions({
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Plane motion (progress from 0–100)
  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }

    if (
      isRunning &&
      trailPoints.length === 0 &&
      containerDimensions.width &&
      containerDimensions.height
    ) {
      setTrailPoints([{ x: 0, y: containerDimensions.height }]);
    }

    const cappedProgress = Math.min(multiplier * 8, 100);
    if (cappedProgress !== progress) {
      setProgress(cappedProgress);
      const t = cappedProgress / 100;
      const xSvg = t * containerDimensions.width;
      const ySvg = containerDimensions.height - t * containerDimensions.height;
      setTrailPoints((prev) => [...prev, { x: xSvg, y: ySvg }].slice(-200));
    }
  }, [
    trailPoints,
    isRunning,
    multiplier,
    progress,
    containerDimensions.width,
    containerDimensions.height,
  ]);

  // Countdown trigger
  useEffect(() => {
    if (
      !isRunning &&
      placedBets.length > 0 &&
      !countdownStarted &&
      !roundEnded
    ) {
      setCountdown(10);
      setCountdownStarted(true);
    }
  }, [isRunning, placedBets.length, countdownStarted, roundEnded]);

  // Countdown tick
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      startRound();
      setCountdown(null);
      setCountdownStarted(false);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, startRound]);

  // Clear after round fully ends
  useEffect(() => {
    if (!isRunning && placedBets.length === 0) {
      setCountdownStarted(false);
      setTrailPoints([]);
    }
  }, [isRunning, placedBets.length]);

  // Build SVG trail
  const getTrailPath = () => {
    if (trailPoints.length < 2) return "";
    let d = `M ${trailPoints[0].x} ${trailPoints[0].y}`;
    for (let i = 1; i < trailPoints.length; i++) {
      d += ` L ${trailPoints[i].x} ${trailPoints[i].y}`;
    }
    return d;
  };

  // Plane CSS coords: bottom grows upward, so to go UP we use (t*height)
  const t = progress / 100;
  const cappedT = Math.min(t, 1);
  const maxLeft = containerDimensions.width;
  const maxBottom = containerDimensions.height;

  const hasReachedMax = t >= 1;
  const planeLeft = isRunning
    ? hasReachedMax
      ? maxLeft
      : cappedT * containerDimensions.width
    : 20;

  const planeBottom = isRunning
    ? hasReachedMax
      ? maxBottom
      : cappedT * containerDimensions.height
    : -15;

  const planeRotation = cappedT * 45;

  return (
    <div
      id="game-container"
      className="flex-1 bg-gradient-to-br from-[#1e0a05] via-[#2b0f06] to-[#120604]
                 flex flex-col items-center justify-center text-white relative 
                 min-h-[260px] sm:min-h-[320px]
                 rounded-xl shadow-2xl overflow-hidden border border-[#5a2b20]"
    >
      {/* Multiplier */}
      <div className="absolute top-4 right-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#ffb86b] drop-shadow-xl">
        {multiplier.toFixed(2)}x
      </div>

      {/* Trail (starts exactly at bottom-left) */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="trailGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ff2d00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff6a00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        {trailPoints.length > 1 && (
          <path
            d={getTrailPath()}
            stroke="url(#trailGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_10px_rgba(255,80,0,0.8)]"
          />
        )}
      </svg>

      {/* Plane */}
      <motion.div
        className="absolute"
        style={{
          left: planeLeft,
          bottom: planeBottom,
          transformOrigin: "left bottom",
          rotate: isRunning ? (hasReachedMax ? 45 : planeRotation) : -30,
        }}
        animate={
          isRunning
            ? { x: 0, y: 0, transition: { duration: 0.15, ease: "linear" } }
            : { x: 0, y: 0 }
        }
      >
        <div className={isRunning ? "-rotate-[30deg]" : "rotate-0"}>
          <PlaneSVG />
        </div>
      </motion.div>

      {/* Countdown */}
      {!isRunning && countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-5xl font-extrabold text-[#ffd166] drop-shadow-lg">
            {countdown}
          </div>
        </div>
      )}

      {/* Cash Out */}
      {isRunning && (
        <div className="absolute bottom-6">
          <button
            onClick={cashOutAll}
            className="px-8 py-3 bg-gradient-to-r from-[#ffd166] to-[#ff6a00] rounded-lg font-extrabold shadow-lg text-[#3b1707] hover:scale-105 transition"
          >
            Cash Out
          </button>
        </div>
      )}
    </div>
  );
};

export default GameArea;
