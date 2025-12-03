function ParticipantsList({ students, onRemove, isTeacher }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 border border-[#F2F2F2]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-semibold text-[#373737]">Participants</h3>
        <span className="px-3 py-1 text-sm font-semibold bg-[#F2F2F2] text-[#373737] rounded-full">
          {students.length}
        </span>
      </div>

      <div>
        {students.length === 0 ? (
          <p className="text-center text-sm text-[#6E6E6E]">No students joined yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((s) => (
              <div
                key={s.socketId}
                className="flex justify-between items-center p-3 border border-[#F2F2F2] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5767D0] flex items-center justify-center text-white font-semibold">
                    {s.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="text-[#373737] font-medium">{s.name}</div>
                    <div className="text-sm">
                      {s.hasAnswered ? (
                        <span className="text-green-600 font-semibold">✓ Answered</span>
                      ) : (
                        <span className="text-[#6E6E6E]">Waiting...</span>
                      )}
                    </div>
                  </div>
                </div>

                {isTeacher && (
                  <button
                    onClick={() => onRemove(s.socketId)}
                    className="text-[#4F0DCE] text-lg font-bold hover:text-[#7765DA] transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantsList;
