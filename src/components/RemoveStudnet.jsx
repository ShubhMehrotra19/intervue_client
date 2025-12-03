function RemovedStudent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-10">
      <div className="text-center max-w-[700px]">
        
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#7565D9] to-[#5E46CC] text-white px-5 py-2 rounded-full text-[14px] font-semibold leading-none mb-12 tracking-[0.5px]">
          <span className="text-[14px]">✦</span>
          Intervue Poll
        </div>

        <h1 className="text-6xl font-bold text-[#1A1A1A] mb-6 leading-[1.2] tracking-[-0.5px] font-inter md:text-[56px]">
          You've been Kicked out!
        </h1>

        <p className="text-[16px] text-[#666666] leading-[1.6] font-normal m-0">
          Looks like the teacher had removed you from the poll system.  
          Please try again sometime.
        </p>
      </div>
    </div>
  );
}

export default RemovedStudent;
