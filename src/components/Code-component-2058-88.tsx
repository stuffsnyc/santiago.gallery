import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleDelay: number;
}

export function GalaxyBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate random stars
    const generateStars = () => {
      const starCount = 150; // Reduced for better performance
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleDelay: Math.random() * 5
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Galaxy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-slate-950/30 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-950/60" />
      
      {/* Nebula effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-radial from-indigo-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow delay-2000" />
      
      {/* Stars layer 1 - Far stars (small, slow) */}
      <div className="absolute inset-0">
        {stars.slice(0, 50).map((star) => (
          <div
            key={`far-${star.id}`}
            className="absolute rounded-full bg-black/40 dark:bg-white/60 animate-twinkle animate-float-slow"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 0.5}px`,
              height: `${star.size * 0.5}px`,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Stars layer 2 - Medium stars (medium speed) */}
      <div className="absolute inset-0">
        {stars.slice(50, 100).map((star) => (
          <div
            key={`medium-${star.id}`}
            className="absolute rounded-full bg-black/60 dark:bg-white/80 animate-twinkle animate-float-medium"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 0.8}px`,
              height: `${star.size * 0.8}px`,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${3 + Math.random() * 1.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Stars layer 3 - Close stars (large, fast) */}
      <div className="absolute inset-0">
        {stars.slice(100, 150).map((star) => (
          <div
            key={`close-${star.id}`}
            className="absolute rounded-full bg-black/80 dark:bg-white/90 animate-twinkle animate-float-fast shadow-sm shadow-black/20 dark:shadow-white/20"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars - occasional */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-px h-px bg-black dark:bg-white rounded-full animate-shooting-star opacity-0"
          style={{
            top: '20%',
            left: '10%',
            animationDelay: '5s',
            animationDuration: '1.5s'
          }}
        />
        <div 
          className="absolute w-px h-px bg-black dark:bg-white rounded-full animate-shooting-star opacity-0"
          style={{
            top: '60%',
            right: '20%',
            animationDelay: '12s',
            animationDuration: '1.2s'
          }}
        />
        <div 
          className="absolute w-px h-px bg-black dark:bg-white rounded-full animate-shooting-star opacity-0"
          style={{
            top: '30%',
            right: '40%',
            animationDelay: '20s',
            animationDuration: '1.8s'
          }}
        />
      </div>
    </div>
  );
}