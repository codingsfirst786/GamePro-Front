import { useState, useEffect } from "react";

const SpinWheel = ({ spinTrigger, onWin, onSpinState }) => {
  const bets = [
    "2x",
    "4x",
    "7x",
    "5x",
    "10x",
    "2x",
    "4x",
    "7x",
    "5x",
    "20x",
    "2x",
    "4x",
    "7x",
    "5x",
    "10x",
    "2x",
    "4x",
    "7x",
    "5x",
    "20x",
  ];

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);

  const sectionAngle = 360 / bets.length;
  const pointerAngle = 183;

  useEffect(() => {
    if (spinTrigger > 0) {
      spin();
    }
  }, [spinTrigger]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    onSpinState?.(true);

    const rotations = Math.floor(Math.random() * 6) + 5;

    const randomIndex = Math.floor(Math.random() * bets.length);

    const targetAngle =
      pointerAngle - (randomIndex * sectionAngle + sectionAngle / 2);

    const finalAngle = angle + rotations * 360 + targetAngle;

    setAngle(finalAngle);

    setTimeout(() => {
      setSpinning(false);
      onSpinState?.(false);

      const normalized = ((finalAngle % 360) + 360) % 360;

      const adjustedPointer = 183;
      const actualIndex = Math.floor(
        ((adjustedPointer - normalized + 360) % 360) / sectionAngle
      );

      setWinnerIndex(actualIndex);
      onWin?.(bets[actualIndex]);
    }, 5000);
  };

  return (
    <div className="relative w-[88%] h-[88%] rounded-full shadow-2xl overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{
          transform: `rotate(${angle}deg)`,
          transition: spinning
            ? "transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)"
            : "none",
        }}
      >
        {bets.map((bet, i) => {
          const startAngle = (i * sectionAngle * Math.PI) / 180;
          const endAngle = ((i + 1) * sectionAngle * Math.PI) / 180;
          const x1 = 200 + 200 * Math.cos(startAngle);
          const y1 = 200 + 200 * Math.sin(startAngle);
          const x2 = 200 + 200 * Math.cos(endAngle);
          const y2 = 200 + 200 * Math.sin(endAngle);

          const isWinner = i === winnerIndex;

          return (
            <g key={i}>
              <path
                d={`M200,200 L${x1},${y1} A200,200 0 0,1 ${x2},${y2} Z`}
                fill={i % 2 === 0 ? "#1b5e20" : "#2e7d32"}
              />
              {!spinning && isWinner && (
                <path
                  d={`M200,200 L${x1},${y1} A200,200 0 0,1 ${x2},${y2} Z`}
                  fill="url(#glowGradient)"
                  opacity="0.7"
                />
              )}
              <text
                x={200 + 155 * Math.cos((startAngle + endAngle) / 2)}
                y={200 + 155 * Math.sin((startAngle + endAngle) / 2)}
                fill="#fff"
                fontSize={bet === "20x" ? "18" : bet === "10x" ? "17" : "15"}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontWeight={isWinner ? "bold" : "normal"}
                transform={`
    rotate(${i * sectionAngle + sectionAngle / 2 - 90}, 
           ${200 + 155 * Math.cos((startAngle + endAngle) / 2)}, 
           ${200 + 155 * Math.sin((startAngle + endAngle) / 2)})
  `}
                style={{
                  filter:
                    !spinning && isWinner
                      ? "drop-shadow(0 0 8px #ffff33) drop-shadow(0 0 16px #ffeb3b) drop-shadow(0 0 24px #ffd600)"
                      : "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                }}
              >
                {bet}
              </text>
            </g>
          );
        })}

        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="yellow" stopOpacity="0.8" />
            <stop offset="100%" stopColor="orange" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>

      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 h-7 w-7 md:w-10 md:h-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-green-700 shadow-inner"></div>
    </div>
  );
};

export default SpinWheel;
