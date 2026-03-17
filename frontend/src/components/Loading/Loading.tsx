import { useEffect, useState } from "react";

interface Drop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
}

type Props = {
  onComplete: () => void;
};

const Loading = ({ onComplete }: Props) => {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // Generate falling blood drops
    const generatedDrops: Drop[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 6,
      size: 10 + Math.random() * 12,
      opacity: 0.2 + Math.random() * 0.3,
      drift: -30 + Math.random() * 60,
    }));

    setDrops(generatedDrops);

    const timer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-peach flex items-center justify-center overflow-hidden z-50">
      {/* Falling blood drops */}
      <div className="absolute inset-0 pointer-events-none">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="absolute top-[-10%] bg-burgundy rounded-[50%_50%_50%_50%/60%_60%_40%_40%] animate-fall"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 1.3}px`,
              opacity: drop.opacity,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
              transform: `translateX(${drop.drift}px)`,
            }}
          />
        ))}
      </div>

      {/* BloodBond Title */}
      <div className="relative text-center">
        <h1 className="text-5xl font-extrabold tracking-widest animate-pulse">
          <span className="text-burgundy">Blood</span>
          <span className="text-muted-foreground">Bond</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Donate • Connect • Save Lives
        </p>
      </div>
    </div>
  );
};

export default Loading;
