function PollResults({ results, highlightAnswer = null }) {
  if (!results) return null;

  return (
    <div className="w-full">
      <div className="mb-6 bg-[#F2F2F2] p-4 rounded-md">
        <p className="text-base font-semibold text-[#373737]">
          {results.question}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {results.options.map((option) => {
          const isHighlighted = highlightAnswer === option.index;
          const isCorrect = option.isCorrect;

          return (
            <div
              key={option.index}
              className={`p-4 rounded-md border-2 transition-all
                bg-white
                ${isCorrect ? "bg-[#F2F2F2]" : ""}
                ${isCorrect ? "border-[#5767D0]" : "border-transparent"}
                ${isHighlighted ? "border-[#4F0DCE]" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isHighlighted ? "border-[#4F0DCE]" : "border-[#6E6E6E]"}
                    `}
                  >
                    {isHighlighted && (
                      <div className="w-3 h-3 bg-[#4F0DCE] rounded-full" />
                    )}
                  </div>

                  <span className="text-[#373737] text-base">
                    {option.text}
                  </span>
                </div>

                <span className="text-xl font-bold text-[#4F0DCE]">
                  {option.percentage}%
                </span>
              </div>

              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#F2F2F2]">
                <div
                  className={`h-full rounded-full transition-all`}
                  style={{
                    width: `${option.percentage}%`,
                    background:
                      isCorrect
                        ? "linear-gradient(90deg, #5767D0 0%, #7765DA 100%)"
                        : "linear-gradient(90deg, #4F0DCE 0%, #7765DA 100%)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PollResults;
