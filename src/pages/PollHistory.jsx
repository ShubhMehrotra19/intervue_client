import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socketService from "../services/socket";

function PollHistory() {
  const navigate = useNavigate();
  const [pollHistory, setPollHistory] = useState([]);

  const calcPercentage = (votes, options) => {
    const total = options.reduce((a, b) => a + b.votes, 0);
    return total ? Math.round((votes / total) * 100) : 0;
  };

  useEffect(() => {
    socketService.connect();
    socketService.emit("poll:history:request");

    socketService.on("poll:history", (history) => {
      const formatted = history.map((poll) => ({
        id: poll.id,
        question: poll.question,
        options: poll.options.map((opt) => ({
          text: opt.text,
          percentage: calcPercentage(opt.votes, poll.options),
        })),
      }));
      setPollHistory(formatted);
    });

    return () => socketService.removeAllListeners("poll:history");
  }, []);

  return (
    <div className="min-h-screen bg-white px-10 py-12">
      <div className="max-w-[900px] w-full pl-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#7765DA] hover:text-[#5E4DBD] transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-[48px] leading-tight mb-12 text-[#373737]">
          <span className="font-normal">View</span>{" "}
          <span className="font-bold">Poll History</span>
        </h1>

        {pollHistory.map((poll, pIndex) => (
          <div key={poll.id} className="mb-20">
            <h2 className="text-[24px] font-semibold text-[#373737] mb-6">
              Question {pIndex + 1}
            </h2>

            <div className="border-2 border-[#E8E8E8] rounded-xl bg-white max-w-[600px] w-full overflow-hidden">
              <div className="bg-[#555555] text-white px-6 py-4 text-[16px] font-medium">
                {poll.question}
              </div>

              <div className="px-5 py-5">
                {poll.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                    <div className="flex-1 flex items-center border-2 border-[#E8E8E8] rounded-lg h-[52px] relative overflow-hidden bg-white">
                      {opt.percentage > 0 && (
                        <div
                          className="absolute top-0 left-0 h-full bg-[#7765DA] flex items-center gap-3 pl-4 pr-4 text-white z-[2]"
                          style={{ width: `${opt.percentage}%` }}
                        >
                          <div className="w-7 h-7 rounded-full bg-white text-[#7765DA] font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <span className="text-[16px] font-medium">{opt.text}</span>
                        </div>
                      )}

                      {opt.percentage === 0 && (
                        <div className="relative z-[1] flex items-center gap-3 pl-4">
                          <div className="w-7 h-7 rounded-full bg-white border border-[#7765DA] text-[#7765DA] font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <span className="text-[16px] font-medium text-[#373737]">
                            {opt.text}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-[16px] font-bold min-w-[50px] text-right text-[#373737]">
                      {opt.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {pollHistory.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6E6E6E] text-[16px] mb-6">No poll history available yet.</p>

            <button
              onClick={() => navigate("/create-poll")}
              className="bg-gradient-to-r from-[#8F64E1] to-[#5E4DBD] text-white px-6 py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition"
            >
              Create Your First Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollHistory;