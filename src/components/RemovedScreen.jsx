function RemovedScreen() {
  const handleReload = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 animate-fadeIn">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#7565DA] to-[#4F0DCE] text-white px-4 py-2 rounded-full mb-6">
          <span>📊</span>
          <span className="font-semibold text-sm">Intervue Poll</span>
        </div>

        <div className="text-7xl mb-6 animate-pulse">🚫</div>

        <h1 className="text-2xl font-semibold text-[#4F0DCE] mb-3">
          You've been Kicked out!
        </h1>

        <p className="text-[#6E6E6E] mb-8">
          Looks like the teacher removed you from the poll system.  
          Please try again sometime.
        </p>

        <button
          onClick={handleReload}
          className="bg-linear-to-r from-[#7765DA] to-[#4F0DCE] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default RemovedScreen;
