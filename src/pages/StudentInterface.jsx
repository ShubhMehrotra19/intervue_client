import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import socketService from "../services/socket";
import { setName, setSocketId, setKicked } from "../store/storeComponent/userComponent";
import {
  setCurrentPoll,
  setResults,
  setHasAnswered,
  setSelectedAnswer,
  decrementTime,
} from "../store/storeComponent/pollComponent";
import { setStudents } from "../store/storeComponent/studentComponent";
import { addMessage, setMessages } from "../store/storeComponent/chatComponent";
import ChatPopup from "../components/ChatPopup";
import KickedOut from "../components/RemoveStudent";

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
    <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
    <path
      d="M16 3V5.5M14.75 4.25H17.25"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M17 6V7.5M16.25 6.75H17.75"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const Badge = () => (
  <div className="inline-flex items-center justify-center w-[134px] h-[31px] gap-[7px] px-[9px] text-[14px] font-semibold leading-none rounded-3xl bg-linear-to-r from-[#7565D9] to-[#4D0ACD] text-white mb-6">
    <StarIcon />
    Intervue Poll
  </div>
);

function StudentInterface() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    role,
    name: studentName,
    isKicked,
  } = useSelector((state) => state.user);
  const { currentPoll, results, hasAnswered, timeRemaining } = useSelector(
    (state) => state.poll
  );

  const [nameInput, setNameInput] = useState("");
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState(null);
  const [error, setError] = useState("");

  const contentRef = useRef(null);
  const submitButtonRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (role !== "student") {
      navigate("/");
      return;
    }

    socketService.connect();

    const handlers = {
      "student:joined": (data) => dispatch(setSocketId(data.socketId)),
      "poll:new": (poll) => {
        dispatch(setCurrentPoll(poll));
        dispatch(setHasAnswered(false));
        setLocalSelectedAnswer(null);
      },
      "poll:results": (pollResults) => dispatch(setResults(pollResults)),
      "students:list": (studentsList) => dispatch(setStudents(studentsList)),
      "chat:history": (messages) => dispatch(setMessages(messages)),
      "chat:message": (message) => dispatch(addMessage(message)),
      "student:kicked": () => dispatch(setKicked(true)),
      error: (err) => setError(err.message),
    };

    Object.entries(handlers).forEach(([e, fn]) => socketService.on(e, fn));

    return () => {
      Object.keys(handlers).forEach((e) => socketService.removeAllListeners(e));
    };
  }, [role, navigate, dispatch]);

  useEffect(() => {
    if (currentPoll?.isActive && !hasAnswered && timeRemaining > 0) {
      const t = setInterval(() => dispatch(decrementTime()), 1000);
      return () => clearInterval(t);
    }
  }, [currentPoll, hasAnswered, timeRemaining, dispatch]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [studentName, currentPoll, hasAnswered]);

  useEffect(() => {
    if (timerRef.current && timeRemaining <= 10 && timeRemaining > 0) {
      gsap.to(timerRef.current, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    }
  }, [timeRemaining]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError("Please enter your name");
      return;
    }
    dispatch(setName(nameInput.trim()));
    socketService.emit("student:join", nameInput.trim());
  };

  const handleAnswerSelect = (i) => {
    if (!currentPoll?.isActive || hasAnswered) return;
    setLocalSelectedAnswer(i);
  };

  const handleSubmitAnswer = () => {
    if (localSelectedAnswer === null || hasAnswered) return;

    if (submitButtonRef.current) {
      gsap.to(submitButtonRef.current, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () =>
          gsap.to(submitButtonRef.current, { scale: 1, duration: 0.1 }),
      });
    }

    socketService.emit("poll:answer", localSelectedAnswer);
    dispatch(setSelectedAnswer(localSelectedAnswer));
    dispatch(setHasAnswered(true));
  };

  if (isKicked) return <KickedOut />;

  if (!studentName)
    return (
      <div className="min-h-screen flex justify-center p-10 pt-20 bg-white">
        <div
          ref={contentRef}
          className="max-w-[500px] w-full mt-[60px] flex flex-col items-center justify-center text-center">
          <Badge />
          <h2 className="text-[36px] leading-[1.2] mb-2 text-gray-900">
            <span className="font-normal">Let&apos;s</span>{" "}
            <span className="font-bold">Get Started</span>
          </h2>
          <p className="text-[#9E9E9E] leading-normal max-w-[520px] mb-10">
            If you&apos;re a student, you&apos;ll be able to{" "}
            <strong>submit your answers</strong>, participate in live polls, and
            see how your responses compare with your classmates.
          </p>

          <form
            onSubmit={handleJoin}
            className="mt-10 w-full max-w-[400px] flex flex-col items-center">
            <label
              htmlFor="name"
              className="text-[14px] font-semibold text-gray-900 mb-1 w-full text-left">
              Enter your Name
            </label>

            <input
              id="name"
              className={`w-full px-[18px] py-3.5 text-[16px] rounded-lg outline-none placeholder:text-[#B8B8B8] transition-all
                ${
                  error
                    ? "border-red-500"
                    : "border-[#E5E5E5] focus:bg-[#FAFAFA] focus:border-[#D0D0D0]"
                }
                bg-[#F5F5F5]`}
              placeholder="Rahul Saini"
              maxLength={50}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              disabled={!nameInput.trim()}
              className="w-[170px] h-12 mt-6 text-white text-[16px] font-semibold rounded-3xl
              bg-linear-to-r from-[#8F64E1] to-[#5E4DBD] shadow-[0_4px_12px_rgba(143,100,225,0.3)]
              transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(143,100,225,0.4)]
              disabled:opacity-50 disabled:cursor-not-allowed">
              Continue
            </button>
          </form>
        </div>
      </div>
    );

  if (!currentPoll || !currentPoll.isActive)
    return (
      <div className="min-h-screen flex justify-center items-center p-10 bg-white">
        <div
          ref={contentRef}
          className="max-w-[500px] w-full mt-10 flex flex-col items-center text-center">
          <Badge />
          <div className="w-10 h-10 rounded-full border-[3px] border-[rgba(108,92,231,0.1)] border-t-[#6C5CE7] animate-spin mb-6" />
          <h2 className="text-[28px] md:text-[36px] leading-[1.2] text-gray-900 whitespace-nowrap">
            Wait for the teacher to ask questions..
          </h2>
        </div>
        <ChatPopup />
      </div>
    );

  if (!hasAnswered)
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white p-5">
        <div ref={contentRef} className="w-full max-w-[700px] text-left">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-semibold text-[24px] text-[#222222]">
              Question 1
            </h2>

            <span
              ref={timerRef}
              className="text-[20px] font-semibold text-[#E53E3E] flex items-center gap-1.5">
              🕐 {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
              {String(timeRemaining % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-[#3a3a3a] text-white p-4 rounded-lg mb-6 text-[18px] font-semibold">
            {currentPoll.question}
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {currentPoll.options.map((opt, i) => (
              <OptionCard
                key={i}
                option={opt}
                index={i}
                isSelected={localSelectedAnswer === i}
                onClick={() => handleAnswerSelect(i)}
              />
            ))}
          </div>

          <button
            ref={submitButtonRef}
            onClick={handleSubmitAnswer}
            disabled={localSelectedAnswer === null}
            className={`w-[220px] h-12 text-[18px] font-semibold text-white rounded-3xl shadow-[0_4px_16px_rgba(108,92,231,0.12)]
              transition-all ${
                localSelectedAnswer === null
                  ? "bg-[#cccccc] cursor-not-allowed"
                  : "bg-linear-to-r from-[#6C5CE7] to-[#5E4DBD]"
              }`}>
            Submit
          </button>
        </div>
        <ChatPopup />
      </div>
    );

  const displayOptions = results
    ? results.options
    : currentPoll.options.map((t, i) => ({ text: t, index: i, percentage: 0 }));

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white p-5">
      <div ref={contentRef} className="w-full max-w-[700px]">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="font-semibold text-[24px] text-[#222222]">
            Question 1
          </h2>

          <span
            ref={timerRef}
            className="text-[20px] font-semibold text-[#E53E3E] flex items-center gap-1.5">
            🕐 {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
            {String(timeRemaining % 60).padStart(2, "0")}
          </span>
        </div>

        <div className="border-2 border-[#AF8FF1] rounded-xl overflow-hidden mb-8">
          <div className="bg-[#3a3a3a] text-white px-4 py-3 text-[18px] font-semibold">
            {currentPoll.question}
          </div>

          <div className="px-3 py-4">
            {displayOptions.map((opt) => (
              <ResultBar key={opt.index} option={opt} />
            ))}
          </div>
        </div>

        <p className="text-center text-[18px] font-semibold text-[#222222] mt-8">
          Wait for the teacher to ask a new question..
        </p>
      </div>
      <ChatPopup />
    </div>
  );
}

const OptionCard = ({ option, index, isSelected, onClick }) => {
  const r = useRef(null);
  const handle = () => {
    onClick();
    if (r.current)
      gsap.fromTo(
        r.current,
        { scale: 1 },
        { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 }
      );
  };

  return (
    <div
      ref={r}
      onClick={handle}
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200
      ${
        isSelected
          ? "bg-[#F0E6FF] border-2 border-[#6C5CE7]"
          : "bg-[#E8E8E8] border-2 border-transparent"
      }`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[16px] shrink-0
        ${
          isSelected
            ? "bg-linear-to-r from-[#6C5CE7] to-[#5E4DBD]"
            : "bg-[#999999]"
        }`}>
        {index + 1}
      </div>

      <span className="text-[18px] text-[#222222]">{option}</span>
    </div>
  );
};

const ResultBar = ({ option }) => {
  const r = useRef(null);

  useEffect(() => {
    if (r.current && option.percentage > 0)
      gsap.fromTo(
        r.current,
        { width: "0%" },
        { width: option.percentage + "%", duration: 0.8 }
      );
  }, [option.percentage]);

  return (
    <div className="mb-3 flex items-center relative">
      <div className="flex-1 h-11 bg-[#E8E8E8] rounded-md flex items-center relative overflow-hidden">
        {option.percentage > 0 && (
          <div
            ref={r}
            className="absolute left-0 top-0 h-full bg-[#6766D5] rounded-sm flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-sm bg-[#6766D5] flex items-center justify-center text-white font-bold text-[14px]">
              {option.index + 1}
            </div>
            <span className="font-medium text-[16px] text-white">
              {option.text}
            </span>
          </div>
        )}

        {option.percentage === 0 && (
          <div className="z-1 flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-sm bg-[#6766D5] flex items-center justify-center text-white font-bold text-[14px]">
              {option.index + 1}
            </div>
            <span className="font-medium text-[16px] text-[#222222]">
              {option.text}
            </span>
          </div>
        )}

        <span
          className={`mr-3 font-semibold text-[16px] z-2 ${
            option.percentage > 50 ? "text-white" : "text-[#222222]"
          }`}>
          {option.percentage}%
        </span>
      </div>
    </div>
  );
};

export default StudentInterface;
