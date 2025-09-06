interface GalaxyImageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function GalaxyImageWrapper({ 
  children, 
  className = ""
}: GalaxyImageWrapperProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Transparent background that reveals the main galaxy background behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/15 to-slate-950/30 dark:from-indigo-950/40 dark:via-purple-950/25 dark:to-slate-950/60">
        {/* Twinkling stars */}
        <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white/40 dark:bg-white/60 rounded-full animate-twinkle animate-float-slow" />
        <div className="absolute top-[60%] left-[70%] w-0.5 h-0.5 bg-white/50 dark:bg-white/70 rounded-full animate-twinkle animate-float-medium delay-1000" />
        <div className="absolute top-[80%] left-[20%] w-1.5 h-1.5 bg-white/30 dark:bg-white/50 rounded-full animate-twinkle animate-float-slow delay-2000" />
        <div className="absolute top-[30%] left-[80%] w-0.5 h-0.5 bg-white/60 dark:bg-white/80 rounded-full animate-twinkle animate-float-fast delay-500" />
        <div className="absolute top-[50%] left-[10%] w-1 h-1 bg-white/40 dark:bg-white/60 rounded-full animate-twinkle animate-float-medium delay-1500" />
        
        {/* Shooting star */}
        <div className="absolute w-px h-px bg-white rounded-full animate-shooting-star opacity-0" style={{ top: '25%', left: '15%' }} />
      </div>
      
      {/* Subtle overlay to enhance the galaxy effect visibility through PNGs */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-purple-950/5 to-slate-950/15 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-slate-950/25 pointer-events-none" />
      
      {/* Image content - positioned above the transparent background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}