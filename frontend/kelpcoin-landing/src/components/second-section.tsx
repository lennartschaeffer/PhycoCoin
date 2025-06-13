export default function SecondSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-800 to-slate-600 py-20 md:py-40 overflow-hidden min-h-[60vh] md:min-h-[80vh]">
      {/* Kelp Forest Animation - Hidden on small screens, visible on medium+ */}
      <div className="hidden md:block absolute bottom-0 right-[5%] lg:right-[10%] w-60 lg:w-80 h-72 lg:h-96 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute bottom-0 w-8 lg:w-10 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-full animate-sway origin-bottom ${
              i === 0
                ? "left-0 h-64 lg:h-80 animate-sway-delay-0"
                : i === 1
                  ? "left-12 lg:left-16 h-56 lg:h-72 animate-sway-delay-1"
                  : i === 2
                    ? "left-24 lg:left-32 h-72 lg:h-96 animate-sway-delay-2"
                    : i === 3
                      ? "left-36 lg:left-48 h-60 lg:h-80 animate-sway-delay-3"
                      : "left-48 lg:left-64 h-68 lg:h-88 animate-sway-delay-4"
            }`}
            style={{
              borderRadius: "20px 20px 50% 50%",
            }}
          >
            {/* Kelp Leaves */}
            {[...Array(2)].map((_, leafIndex) => (
              <div
                key={leafIndex}
                className={`absolute w-5 lg:w-6 h-6 lg:h-8 bg-green-600 rounded-full animate-leaf-float ${
                  leafIndex === 0 ? "top-[25%] -left-1" : "top-[55%] -right-1"
                }`}
                style={{
                  animationDelay: `${leafIndex * 0.5}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Kelp Decoration */}
      <div className="md:hidden absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none">
        <div className="absolute bottom-0 right-4 w-6 h-24 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full animate-sway origin-bottom"></div>
        <div
          className="absolute bottom-0 right-12 w-5 h-20 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full animate-sway origin-bottom"
          style={{ animationDelay: "-1s" }}
        ></div>
        <div
          className="absolute bottom-0 right-20 w-6 h-28 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full animate-sway origin-bottom"
          style={{ animationDelay: "-2s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-5 relative z-10 flex items-center min-h-[40vh] md:min-h-[60vh]">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 max-w-full md:max-w-2xl animate-fade-in-up text-center md:text-left leading-tight">
            A Micro Carbon Marketplace for Coastal Communities
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl animate-fade-in-up text-center md:text-left opacity-90">
            Connecting local seaweed farmers with businesses to create a sustainable, community-driven carbon economy.
          </p>
        </div>
      </div>
    </section>
  )
}
