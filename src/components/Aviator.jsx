import { AviatorProvider } from "../context/AviatorProvider";
import BetControls from "./BetControls";
import GameArea from "./GameArea";
import HeaderStats from "./HeaderStats";
import HistoryTable from "./HistoryTable";
import UserBets from "./UserBets";

const AviatorPage = () => {
  return (
    <AviatorProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#1a0806] via-[#220d0a] to-[#120604] text-white">
        {/* Header */}
        <HeaderStats />

        {/* Main content */}
        <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Main Game + Bet Controls + History */}
            <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6 order-1 lg:order-none">
              {/* Game Area */}
              <GameArea />

              {/* Bet Controls (double) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                <BetControls compact />
                <BetControls compact />
              </div>

              {/* History Table */}
              <HistoryTable />
            </div>

            {/* Sidebar: User Bets */}
            <div className="lg:col-span-1 order-2 lg:order-none">
              <UserBets />
            </div>
          </div>
        </div>
      </div>
    </AviatorProvider>
  );
};

export default AviatorPage;
