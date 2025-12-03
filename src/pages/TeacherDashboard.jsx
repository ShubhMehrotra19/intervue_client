import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import socketService from "../services/socket";
import { setCurrentPoll, setResults } from "../store/storeComponent/pollComponent";
import { setStudents } from "../store/storeComponent/studentComponent";
import { addMessage, setMessages } from "../store/storeComponent/chatComponent";
import TeacherForm from "../components/teacherForm";
import ChatPopup from "../components/ChatPopup";

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="white" className="mr-1">
    <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
    <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const Badge = () => (
  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-linear-to-r from-[#7765DA] to-[#4F0DCE] text-white text-sm font-semibold mb-4">
    <StarIcon />
    Intervue Poll
  </div>
);

const ResultBar = ({ option, index, isHighest }) => {
  const barRef = useRef(null);
  const prevPercentage = useRef(0);

  useEffect(() => {
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { width: `${prevPercentage.current}%` },
        { 
          width: `${option.percentage}%`, 
          duration: 0.6, 
          ease: "power2.out" 
        }
      );
      prevPercentage.current = option.percentage;
    }
  }, [option.percentage]);

  return (
    <div
      className={`relative flex items-center w-full h-14 rounded-lg border overflow-hidden ${
        isHighest ? "border-[#7765DA] bg-[#F2F2F2]" : "border-[#F2F2F2] bg-[#F2F2F2]"
      }`}
    >
      <div className="absolute left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[15px] font-bold text-[#7765DA] shadow-sm z-10">
        {index + 1}
      </div>

      <div className="absolute inset-0 flex items-center pl-16 pr-16 z-1">
        <span className="text-sm font-medium text-[#373737] truncate">
          {option.text}
        </span>
      </div>

      <div
        ref={barRef}
        className="absolute inset-y-0 left-0 bg-[#5767D0] z-2"
        style={{ width: "0%" }}
      >
        <div className="w-full h-full flex items-center pl-16 pr-16">
          <span className="text-sm font-medium text-white truncate">
            {option.text}
          </span>
        </div>
      </div>

      <div className="absolute right-4 text-sm font-bold text-[#373737] z-10">
        {option.percentage}%
      </div>
    </div>
  );
};

function TeacherDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const { currentPoll, results } = useSelector((state) => state.poll);

  const contentRef = useRef(null);
  const pollCardRef = useRef(null);
  const formRef = useRef(null);
  const resultsContainerRef = useRef(null);

  useEffect(() => {
    if (role !== "teacher") {
      navigate("/");
      return;
    }

    socketService.connect();
    socketService.emit("teacher:join");

    const handlers = {
      "poll:current": (poll) => poll && dispatch(setCurrentPoll(poll)),
      "poll:new": (poll) => poll && dispatch(setCurrentPoll(poll)),
      "poll:results": (pollResults) => dispatch(setResults(pollResults)),
      "students:list": (studentsList) => dispatch(setStudents(studentsList)),
      "chat:history": (messages) => dispatch(setMessages(messages)),
      "chat:message": (message) => dispatch(addMessage(message)),
      error: (error) => {
        console.error("Socket error:", error);
        alert(error.message);
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socketService.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => {
        socketService.removeAllListeners(event);
      });
    };
  }, [role, navigate, dispatch]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [currentPoll?.isActive]);

  useEffect(() => {
    if (pollCardRef.current && currentPoll?.isActive) {
      gsap.fromTo(
        pollCardRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }, [currentPoll?.isActive]);

  useEffect(() => {
    if (resultsContainerRef.current && results) {
      const bars = resultsContainerRef.current.querySelectorAll('.result-bar');
      gsap.fromTo(
        bars,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [results]);

  const handleCreatePoll = (pollData) => {
    socketService.emit("poll:create", pollData);
  };

  const handleResetPoll = () => {
    if (pollCardRef.current) {
      gsap.to(pollCardRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          dispatch(setCurrentPoll(null));
          dispatch(setResults(null));
        }
      });
    } else {
      dispatch(setCurrentPoll(null));
      dispatch(setResults(null));
    }
  };

  const canCreateNewPoll = !currentPoll || !currentPoll.isActive;

  return (
    <div className="min-h-screen bg-white flex justify-start px-4 md:px-8 py-8">
      <div className="w-full flex justify-start">
        <div className="w-full max-w-5xl md:ml-20">
          {(!currentPoll || canCreateNewPoll) ? (
            <div ref={contentRef} className="flex flex-col items-start text-left space-y-6">
              <Badge />

              <h1 className="text-4xl md:text-5xl leading-tight text-[#373737] mb-2">
                <span className="font-normal">Let&apos;s</span>{" "}
                <span className="font-bold">Get Started</span>
              </h1>

              <p className="text-base text-[#6E6E6E] max-w-xl">
                You&apos;ll have the ability to create and manage polls, ask questions,
                and monitor your students&apos; responses in real-time.
              </p>

              <div ref={formRef} className="w-full max-w-2xl mt-4">
                <TeacherForm onSubmit={handleCreatePoll} />
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="flex flex-col items-start w-full mt-10 space-y-6">
              <div className="flex w-full justify-end">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-[#7765DA] to-[#4F0DCE] text-white text-sm font-semibold shadow-[0_8px_24px_rgba(119,101,218,0.35)] hover:-translate-y-0.5 transition"
                  onClick={() => navigate("/teacher/history")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View Poll history
                </button>
              </div>

              <div className="flex items-center gap-3 w-full mb-2">
                <h2 className="text-xl font-semibold text-[#373737] m-0">Question</h2>
              </div>

              <div ref={pollCardRef} className="w-full rounded-xl border border-[#F2F2F2] bg-white overflow-hidden">
                <div className="h-14 flex items-center px-6 bg-[#373737] text-white text-sm font-semibold">
                  {currentPoll?.question}
                </div>

                <div ref={resultsContainerRef} className="flex flex-col gap-3 p-6 bg-white">
                  {(results
                    ? results.options
                    : currentPoll.options.map((opt) => ({ text: opt, percentage: 0 }))
                  ).map((opt, idx, arr) => {
                    const maxPercentage = Math.max(...arr.map((o) => o.percentage || 0));
                    const isHighest = results && opt.percentage === maxPercentage && maxPercentage > 0;

                    return (
                      <div key={idx} className="result-bar">
                        <ResultBar option={opt} index={idx} isHighest={isHighest} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full flex justify-end">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2 h-12 rounded-full bg-[#7765DA] text-white text-sm font-semibold hover:bg-[#5767D0] transition"
                  onClick={handleResetPoll}
                >
                  + Ask a new question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {currentPoll && currentPoll.isActive && <ChatPopup />}
    </div>
  );
}

export default TeacherDashboard;