"use client";

import { useId } from "react";

type Pose = "wave" | "box" | "thumbsup" | "delivery";

/**
 * Robot3D
 * A single mascot component that replaces the old flat, single-color SVGs.
 * "3D" here is achieved with layered gradients (a lit side + a shaded side),
 * a soft ground shadow, a glass-like eye highlight, and real motion:
 *  - the whole body gently floats (bobs up and down + tiny rotation)
 *  - the head has a slow idle sway
 *  - eyes blink on an interval
 *  - the "wave" pose animates an arm back and forth
 * All motion is pure CSS (see the keyframes in globals.css), so it's cheap,
 * works with SSR, and respects prefers-reduced-motion automatically.
 */
export default function Robot3D({
  pose = "wave",
  className = "",
  floaty = true,
}: {
  pose?: Pose;
  className?: string;
  floaty?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");

  const bodyGradId = `robotBody-${uid}`;
  const headGradId = `robotHead-${uid}`;
  const limbGradId = `robotLimb-${uid}`;
  const glossId = `robotGloss-${uid}`;
  const shadowId = `robotShadow-${uid}`;

  return (
    <div
      className={`robot3d-float ${floaty ? "" : "robot3d-static"} ${className}`}
      style={{ display: "inline-block" }}
    >
      <svg viewBox="0 0 220 280" className="h-full w-full overflow-visible" fill="none">
        <defs>
          {/* Lit-to-shadow body gradient: gives the plastic shell real volume */}
          <linearGradient id={bodyGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9f2f8" />
            <stop offset="45%" stopColor="#8fd3e3" />
            <stop offset="100%" stopColor="#3f8fa6" />
          </linearGradient>
          <linearGradient id={headGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f8fc" />
            <stop offset="50%" stopColor="#a8dde8" />
            <stop offset="100%" stopColor="#5aa6ba" />
          </linearGradient>
          <linearGradient id={limbGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#bfe8f1" />
            <stop offset="100%" stopColor="#5aa6ba" />
          </linearGradient>
          {/* Glossy highlight blob used on the head + torso for a "realistic" sheen */}
          <radialGradient id={glossId} cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1c2b30" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1c2b30" stopOpacity="0" />
          </radialGradient>
          <filter id={`ds-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1c2b30" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ground contact shadow — animates width/opacity in sync with the float */}
        <ellipse
          className="robot3d-shadow"
          cx="110"
          cy="262"
          rx="52"
          ry="10"
          fill={`url(#${shadowId})`}
        />

        <g filter={`url(#ds-${uid})`}>
          {/* body group sways gently */}
          <g className="robot3d-sway" style={{ transformOrigin: "110px 150px" }}>
            {/* antenna */}
            <path d="M110 22V6" stroke="#2B5566" strokeWidth="4" strokeLinecap="round" />
            <circle cx="110" cy="6" r="5" fill="#F7941D" stroke="#2B5566" strokeWidth="2" className="robot3d-blip" />

            {/* head */}
            <rect x="60" y="24" width="100" height="86" rx="26" fill={`url(#${headGradId})`} stroke="#2B5566" strokeWidth="4" />
            <rect x="60" y="24" width="100" height="86" rx="26" fill={`url(#${glossId})`} />

            {/* eyes (blink via scaleY keyframe) */}
            <g className="robot3d-blink" style={{ transformOrigin: "85px 64px" }}>
              <circle cx="85" cy="64" r="10" fill="#fff" stroke="#2B5566" strokeWidth="3" />
              <circle cx="85" cy="64" r="3.4" fill="#2B5566" />
            </g>
            <g className="robot3d-blink" style={{ transformOrigin: "135px 64px" }}>
              <circle cx="135" cy="64" r="10" fill="#fff" stroke="#2B5566" strokeWidth="3" />
              <circle cx="135" cy="64" r="3.4" fill="#2B5566" />
            </g>
            <path d="M88 88q22 12 44 0" stroke="#2B5566" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* torso */}
            <rect x="85" y="106" width="50" height="70" rx="16" fill={`url(#${bodyGradId})`} stroke="#2B5566" strokeWidth="4" />
            <rect x="85" y="106" width="50" height="70" rx="16" fill={`url(#${glossId})`} opacity="0.6" />
            <circle cx="110" cy="140" r="9" fill="#fff" opacity="0.35" />

            {/* legs */}
            <rect x="76" y="176" width="22" height="50" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
            <rect x="122" y="176" width="22" height="50" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />

            {/* pose-specific arms / props */}
            {pose === "wave" && (
              <>
                <rect x="130" y="112" width="18" height="46" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
                <g className="robot3d-wave" style={{ transformOrigin: "60px 118px" }}>
                  <path d="M60 118 Q30 96 40 60" stroke="#2B5566" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle cx="40" cy="57" r="8" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
                </g>
              </>
            )}

            {pose === "box" && (
              <>
                <rect x="60" y="112" width="18" height="46" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
                <rect x="130" y="112" width="18" height="46" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
                <g className="robot3d-nod" style={{ transformOrigin: "55px 128px" }}>
                  <path
                    d="M60 130 L20 152 L2 128 L38 108 Z"
                    fill="#F7941D"
                    stroke="#2B5566"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path d="M2 128 L38 108" stroke="#c9720a" strokeWidth="2" opacity="0.6" />
                </g>
              </>
            )}

            {pose === "thumbsup" && (
              <>
                <g className="robot3d-wave" style={{ transformOrigin: "70px 130px" }}>
                  <path d="M70 130 L38 108 L46 150 Z" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" strokeLinejoin="round" />
                </g>
                <g className="robot3d-nod" style={{ transformOrigin: "150px 130px" }}>
                  <path d="M150 130 L182 108 L174 150 Z" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" strokeLinejoin="round" />
                </g>
              </>
            )}

            {pose === "delivery" && (
              <>
                <rect x="130" y="112" width="18" height="46" rx="9" fill={`url(#${limbGradId})`} stroke="#2B5566" strokeWidth="4" />
                <g className="robot3d-wave" style={{ transformOrigin: "55px 130px" }}>
                  <path
                    d="M65 150 L15 172 L32 202 L82 180 Z"
                    fill="#F7941D"
                    stroke="#2B5566"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </g>
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
