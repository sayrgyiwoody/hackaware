export default function ProgressBar({
  message,
}: {
  message: { scanProgress: number };
}) {
  return (
    <div className="ml-11 mt-2">
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-xl p-5 max-w-[85%] shadow-2xl">
        {/* Header with animated icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-white/20 animate-spin" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-ping" />
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cybersecurity Security Analysis
            </span>
          </div>
          <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30">
            {message.scanProgress}%
          </div>
        </div>

        {/* Innovative Progress Bar */}
        <div className="relative mb-4">
          <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${message.scanProgress || 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              <div className="absolute right-0 top-0 w-2 h-full bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
          {/* Floating progress indicator */}
          <div
            className="absolute top-0 w-1 h-3 bg-white rounded-full shadow-lg transition-all duration-500"
            style={{
              left: `${Math.max(0, Math.min(95, message.scanProgress || 0))}%`,
            }}
          />
        </div>

        {/* Enhanced Status Messages */}
        <div className="space-y-2">
          {(message.scanProgress || 0) > 15 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <span className="text-green-400 font-medium">
                HTTP Security Headers
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent" />
              <span className="text-green-300 text-[10px]">SECURE</span>
            </div>
          )}

          {(message.scanProgress || 0) > 30 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <span className="text-blue-400 font-medium">
                Third-party Trackers
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent" />
              <span className="text-blue-300 text-[10px]">DETECTED</span>
            </div>
          )}

          {(message.scanProgress || 0) > 45 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              </div>
              <span className="text-yellow-400 font-medium">
                JavaScript Vulnerabilities
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
              <span className="text-yellow-300 text-[10px]">SCANNING</span>
            </div>
          )}

          {(message.scanProgress || 0) > 60 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              </div>
              <span className="text-purple-400 font-medium">
                SSL/TLS Configuration
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent" />
              <span className="text-purple-300 text-[10px]">VERIFIED</span>
            </div>
          )}

          {(message.scanProgress || 0) > 75 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <span className="text-cyan-400 font-medium">
                Privacy Compliance
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
              <span className="text-cyan-300 text-[10px]">ANALYZED</span>
            </div>
          )}

          {(message.scanProgress || 0) > 95 && (
            <div className="flex items-center gap-3 text-xs animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center animate-spin">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              <span className="text-transparent bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text font-medium">
                Generating response...
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-400/50 via-violet-400/50 to-transparent animate-pulse" />
              <div className="flex gap-1">
                <div
                  className="w-1 h-1 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1 h-1 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1 h-1 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Neural network visualization at bottom */}
        <div className="mt-4 pt-3 border-t border-gray-600/30">
          <div className="flex items-center justify-center gap-2 opacity-60">
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-gradient-to-t from-cyan-500/30 to-blue-500/30 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    height: `${Math.random() * 16 + 8}px`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              AI URL Realtime Scanning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
