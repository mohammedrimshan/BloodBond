/**
 * Loading.tsx
 * ─────────────────────────────────────────────────────────────
 * Cinematic entry loader using the Blood Donation Lottie animation.
 *
 * Sequence:
 *   0 s    → Lottie plays, loader visible
 *   2.5 s  → "BloodBond" brand text fades in
 *   3.4 s  → subtitle fades in (staggered)
 *   5.5 s  → whole loader fades out
 *   6.2 s  → onComplete() fires → main app renders
 */

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import bloodAnimation from "../../assets/Blood Donation.json";

type Phase = "play" | "text" | "fadeout";

type Props = {
  onComplete: () => void;
};

const Loading = ({ onComplete }: Props) => {
  const [phase, setPhase]     = useState<Phase>("play");
  const [opacity, setOpacity] = useState(1);
  const doneRef               = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"),    2500);
    const t2 = setTimeout(() => { setPhase("fadeout"); setOpacity(0); }, 5500);
    const t3 = setTimeout(finish, 6200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── styles ──────────────────────────────────────────────── */
  const shown = phase === "text";

  const wrapper: React.CSSProperties = {
    position:       "fixed",
    inset:          0,
    zIndex:         50,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    background:     "hsl(0 40% 96%)",   // soft peach
    opacity,
    transition:     "opacity 0.7s ease",
    pointerEvents:  phase === "fadeout" ? "none" : "all",
    gap:            "0px",
  };

  const lottieWrap: React.CSSProperties = {
    width:      "min(360px, 70vw)",
    height:     "min(360px, 70vw)",
    flexShrink: 0,
  };

  const brandWrap: React.CSSProperties = {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    marginTop:     "-16px",   // tuck up slightly under the animation
  };

  const titleStyle: React.CSSProperties = {
    fontFamily:    "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontSize:      "clamp(2.4rem, 7vw, 4.5rem)",
    fontWeight:    800,
    letterSpacing: "0.12em",
    lineHeight:    1,
    margin:        0,
    userSelect:    "none",
    opacity:       shown ? 1 : 0,
    transform:     shown ? "translateY(0) scale(1)" : "translateY(10px) scale(0.93)",
    transition:    "opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)",
    textShadow:    "0 3px 24px rgba(107,0,0,0.18)",
  };

  const lineStyle: React.CSSProperties = {
    width:           shown ? "56px" : "0px",
    height:          "2px",
    background:      "linear-gradient(90deg, transparent, hsl(0 70% 40%), transparent)",
    margin:          "10px 0 12px",
    transition:      "width 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s",
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily:    "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontSize:      "clamp(0.7rem, 1.8vw, 0.88rem)",
    fontWeight:    400,
    letterSpacing: "0.26em",
    color:         "hsl(0 15% 40%)",
    userSelect:    "none",
    margin:        0,
    opacity:       shown ? 1 : 0,
    transform:     shown ? "translateY(0)" : "translateY(8px)",
    transition:    "opacity 1.0s ease 0.9s, transform 1.0s ease 0.9s",
  };

  return (
    <div style={wrapper}>
      {/* Lottie animation */}
      <div style={lottieWrap}>
        <Lottie
          animationData={bloodAnimation}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Brand text */}
      <div style={brandWrap}>
        <h1 style={titleStyle}>
          <span style={{ color: "hsl(0 70% 40%)" }}>Blood</span>
          <span style={{ color: "hsl(0 15% 38%)" }}>Bond</span>
        </h1>

        {/* Decorative line */}
        <div style={lineStyle} />

        <p style={subtitleStyle}>Donate&nbsp;•&nbsp;Connect&nbsp;•&nbsp;Save&nbsp;Lives</p>
      </div>
    </div>
  );
};

export default Loading;
