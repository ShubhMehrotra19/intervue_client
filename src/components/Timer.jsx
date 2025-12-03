function Timer({ timeRemaining }) {
  if (timeRemaining === null || timeRemaining === undefined) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const color =
    timeRemaining <= 10
      ? "text-[#E53E3E] animate-pulse"
      : timeRemaining <= 30
      ? "text-[#F39C12]"
      : "text-[#373737]";

  return (
    <div className={`flex items-center gap-1 font-semibold transition ${color}`}>
      <span className="text-[18px]">⏱️</span>
      <span className="text-base font-mono min-w-[50px] text-center">
        {formatted}
      </span>
    </div>
  );
}

export default Timer;
