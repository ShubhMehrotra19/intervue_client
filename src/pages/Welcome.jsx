import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const roleCards = [
  {
    id: "student",
    title: "I'm a Student",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
  },
  {
    id: "teacher",
    title: "I'm a Teacher",
    description: "Submit answers and view live poll results in real-time."
  }
];

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
    <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
    <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RoleCard = ({ role, isSelected, onClick }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isSelected]);

  const containerClass = isSelected
    ? "p-[3px] rounded-2xl bg-gradient-to-r from-[#7765DA] to-[#1D68BD]"
    : "border-2 border-gray-200 rounded-2xl";

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`${containerClass} cursor-pointer transition-shadow duration-200 hover:shadow-md`}
    >
      <div className="bg-white rounded-2xl p-6 text-left min-h-[140px] flex flex-col items-start justify-start">
        <h3 className="mb-2 font-semibold text-xl text-gray-900">{role.title}</h3>
        <p className="text-base font-normal leading-[1.4] text-[#454545]">
          {role.description}
        </p>
      </div>
    </div>
  );
};

function Welcome() {
  const [selectedRole, setSelectedRole] = useState(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 },
        "-=0.3"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    if (selectedRole) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  }, [selectedRole]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-[800px] w-full text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center justify-center w-[134px] h-[31px] gap-[7px] px-[9px] text-sm font-semibold leading-none rounded-2xl bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white mx-auto"
        >
          <StarIcon />
          Intervue Poll
        </div>

        <h1 ref={titleRef} className="text-3xl font-semibold mt-6">
          Welcome to the <strong>Live Polling System</strong>
        </h1>

        <p ref={subtitleRef} className="text-gray-600 mt-4 mb-10">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {roleCards.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onClick={() => setSelectedRole(role.id)}
            />
          ))}
        </div>

        <button
          ref={buttonRef}
          disabled={!selectedRole}
          className={`w-[233.93px] h-[57.58px] cursor-pointer rounded-[34px] p-0 text-white text-base font-semibold flex items-center justify-center mx-auto bg-linear-to-r from-[#8F64E1] to-[#1D68BD] transition-transform duration-200 ${
            selectedRole ? "hover:-translate-y-0.5" : "opacity-100 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Welcome;