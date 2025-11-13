import { useEffect, useState } from "react";

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-fade-in">
      <div className="relative">
        {/* Animated Circle */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          
          {/* Animated icons orbit */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            {/* Scissors icon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-3d">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            {/* Leaf icon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-3d">
              <svg className="w-5 h-5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3.5s' }}>
            {/* Plant icon */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-primary-light rounded-full flex items-center justify-center shadow-3d">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>

          {/* Center logo text */}
          <div className="relative z-10 text-center">
            <div className="text-2xl font-display font-bold gradient-primary bg-clip-text text-transparent animate-pulse">
              Seasons
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">
              Loading...
            </div>
          </div>
        </div>

        {/* Floating dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};
