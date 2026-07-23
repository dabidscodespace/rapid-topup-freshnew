'use client';

export default function ArcadeLoader({ message = "LOADING..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0118] overflow-hidden">
      {/* 1. Background CRT & Grid Effects */}
      <div className="absolute inset-0 retro-grid opacity-20" />
      <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0118_90%)]" />

      {/* 2. Game Boot Screen */}
      <div className="relative z-10 w-full max-w-lg px-4">
        {/* Outer Neon Glow */}
        <div className="absolute -inset-2 bg-[#00f0ff] opacity-10 blur-xl animate-pulse" />
        
        {/* The Game Screen */}
        <div 
          className="relative border-4 border-[#ff00de] bg-[#1a0b2e] p-8 md:p-10 text-center"
          style={{ 
            boxShadow: '8px 8px 0px 0px #00f0ff', 
            borderRadius: '0',
            fontFamily: "'Press Start 2P', cursive"
          }}
        >
          {/* Inner Screen Border & Scanlines */}
          <div className="absolute inset-3 border-2 border-[#ff00de]/30 pointer-events-none" />
          <div className="absolute inset-0 crt-overlay opacity-30 pointer-events-none" />

          {/* Game Title */}
          <div className="mb-8 relative z-10">
            <div className="font-pixel text-2xl md:text-3xl text-[#ff00de] mb-4">
              COINHUB
            </div>
            <div className="font-pixel text-lg md:text-xl text-[#00f0ff] mb-6">
              ARCADE
            </div>
          </div>

          {/* Pixel Art Game Logo */}
          <div className="relative z-10 mb-8">
            <div className="flex justify-center mb-4">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 mx-0.5 bg-[#fcee0a]"
                  style={{ 
                    animation: `pixelBlink 2s ease-in-out ${i * 0.15}s infinite`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
            <div className="h-12 w-32 mx-auto border-2 border-[#00f0ff] bg-[#0a0118] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-[#00f0ff]">
                <span className="text-2xl font-pixel">8-BIT</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center gap-1 mb-8 relative z-10">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-4 md:w-4 md:h-5 border-2 border-[#00f0ff] bg-[#0a0118] rounded-none"
                style={{ 
                  animation: `progressLoad 1.8s ease-in-out ${i * 0.1}s infinite`,
                  animationDelay: `${i * 0.1}s`
                }} 
              />
            ))}
          </div>

          {/* Terminal Prompt */}
          <div className="font-pixel text-[10px] md:text-xs text-[#00f0ff] tracking-widest relative z-10 flex items-center justify-center gap-2">
            <span className="animate-pulse">INSERT COIN</span>
            <span 
              className="inline-block w-2 h-4 md:w-3 md:h-5 bg-[#00f0ff]"
              style={{ animation: 'blink 0.8s step-end infinite' }} 
            />
          </div>
        </div>
      </div>

      {/* Custom Keyframes for Authentic Arcade Feel */}
      <style jsx>{`
        @keyframes pixelBlink {
          0%, 100% { background-color: #fcee0a; }
          50% { background-color: #00f0ff; }
        }
        @keyframes progressLoad {
          0%, 100% { 
            background-color: #0a0118; 
            border-color: #00f0ff; 
            transform: scale(1);
          }
          50% { 
            background-color: #fcee0a; 
            border-color: #fcee0a; 
            transform: scale(1.15);
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}