// Enhanced AutoRefresh.tsx

import React, { useEffect, useState } from "react";

interface AutoRefreshProps {
  intervalInMinutes: number;
  warningTimeInMinutes?: number; // Time before refresh to warn the user
}

const AutoRefresh: React.FC<AutoRefreshProps> = ({
  intervalInMinutes,
  warningTimeInMinutes = 5,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(warningTimeInMinutes * 60);

  useEffect(() => {
    const intervalInMs = intervalInMinutes * 60 * 1000;
    const warningTimeInMs = warningTimeInMinutes * 60 * 1000;

    const timer = setTimeout(() => {
      setShowWarning(true);
    }, intervalInMs - warningTimeInMs);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [intervalInMinutes, warningTimeInMinutes]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg">
      <p>Your session will refresh in {timeLeft} seconds.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Refresh Now
      </button>
    </div>
  );
};

export default AutoRefresh;
