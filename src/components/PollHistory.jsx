import PollResults from "./PollResults";

function PollHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-[#6E6E6E]">No poll history available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      {history.map((poll, index) => (
        <div
          key={poll.id}
          className="pb-6 mb-6 border-b border-[#F2F2F2] last:border-b-0 last:mb-0"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#373737]">
              Question {history.length - index}
            </h3>
            <span className="text-sm text-[#6E6E6E]">
              {new Date(poll.endTime).toLocaleString()}
            </span>
          </div>

          <PollResults results={poll} />

          <div className="mt-4 pt-4 border-t border-[#F2F2F2]">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-[#6E6E6E]">Total Participants:</span>
              <span className="font-semibold text-[#4F0DCE]">
                {poll.participants?.length || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PollHistory;
