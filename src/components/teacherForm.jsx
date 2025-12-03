import { useState } from "react";

function PollCreationForm({ onSubmit = () => {} }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [error, setError] = useState("");

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleCorrectToggle = (index) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: "", isCorrect: false }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    if (options.some((o) => !o.text.trim())) {
      setError("Please fill all options");
      return;
    }

    onSubmit({
      question,
      options: options.map((o) => o.text),
      correctAnswer: options.findIndex((o) => o.isCorrect),
      timeLimit,
    });

    setQuestion("");
    setOptions([
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ]);
    setTimeLimit(60);
    setError("");
  };

  return (
    <div className="flex flex-col gap-10 pb-32">
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-base font-semibold text-[#373737]">
            Enter your question
          </label>

          <div className="relative flex items-center gap-1 bg-[#F2F2F2] border border-[#6E6E6E]/40 px-3 py-1.5 rounded-md">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="bg-transparent focus:outline-none text-sm text-[#5767D0] pr-6 appearance-none">
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>

            <svg className="w-3 h-3 absolute right-2 pointer-events-none" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#5767D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
            placeholder="Type your question..."
            maxLength={100}
            className="w-full min-h-[140px] p-4 bg-[#F2F2F2] border border-[#6E6E6E]/40 rounded-md text-[#373737] text-base leading-tight focus:bg-white focus:border-[#5767D0] outline-none"
          />
          <div className="absolute bottom-2 right-3 text-sm text-[#6E6E6E]">
            {question.length}/100
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-base font-semibold text-[#373737]">
            Edit Options
          </label>
          <span className="text-base font-semibold text-[#373737]">
            Is Correct?
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8F64E1] to-[#4E377B] flex items-center justify-center text-white font-semibold">
                {index + 1}
              </div>

              <input
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder="Enter option"
                className="flex-1 px-4 py-2 bg-[#F2F2F2] border border-[#6E6E6E]/40 rounded-md text-[#373737] text-base focus:bg-white focus:border-[#5767D0] outline-none"
              />

              <div className="flex gap-6">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectToggle(index)}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors ${option.isCorrect ? 'border-[#5767D0]' : 'border-[#6E6E6E]'}`}>
                    <span className={`w-2 h-2 rounded-full transition-colors ${option.isCorrect ? 'bg-[#5767D0]' : 'bg-transparent'}`} />
                  </span>
                  <span className="text-sm text-[#373737]">Yes</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <span className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors ${!option.isCorrect ? 'border-[#5767D0]' : 'border-[#6E6E6E]'}`}>
                    <span className={`w-2 h-2 rounded-full transition-colors ${!option.isCorrect ? 'bg-[#5767D0]' : 'bg-transparent'}`} />
                  </span>
                  <span className="text-sm text-[#373737]">No</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {options.length < 4 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-4 border-2 border-[#7765DA] text-[#7765DA] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#7765DA]/10 transition">
            + Add More Option
          </button>
        )}
      </div>

      {error && <p className="text-[#4F0DCE] text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        className="fixed bottom-10 right-10 w-44 h-14 text-white font-semibold text-lg rounded-full shadow-md bg-linear-to-r from-[#8F64E1] to-[#5E4DBD] hover:-translate-y-0.5 transition">
        Ask Question
      </button>
    </div>
  );
}

export default PollCreationForm;