"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const MAX_PARTICLES = 18;

export function CursorParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarsePointer || prefersReducedMotion) {
      return undefined;
    }

    let id = 0;
    let lastFrame = 0;

    function handlePointerMove(event: PointerEvent) {
      const now = window.performance.now();
      if (now - lastFrame < 32) {
        return;
      }
      lastFrame = now;

      const nextParticle = {
        id: id++,
        x: event.clientX,
        y: event.clientY,
        size: 5 + Math.random() * 7
      };

      setParticles((items) => [...items.slice(-MAX_PARTICLES + 1), nextParticle]);
      window.setTimeout(() => {
        setParticles((items) => items.filter((item) => item.id !== nextParticle.id));
      }, 720);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (particles.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="cursor-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size
          }}
        />
      ))}
    </div>
  );
}
