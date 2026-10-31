"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";

type PointerState = { x: number; y: number };

function Particles({
  count,
  animate,
  pointer,
}: {
  count: number;
  animate: boolean;
  pointer: React.RefObject<PointerState>;
}) {
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const red = Math.random() < 0.55;
      colors[i * 3] = red ? 0.776 : 0.6; // R
      colors[i * 3 + 1] = red ? 0.133 : 0.6; // G
      colors[i * 3 + 2] = red ? 0.153 : 0.6; // B
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!animate) return;
    const t = tilt.current;
    const s = spin.current;
    if (!t || !s) return;
    s.rotation.y += delta * 0.04;
    const k = Math.min(1, delta * 2.5);
    t.rotation.x += (-pointer.current.y * 0.3 - t.rotation.x) * k;
    t.rotation.y += (pointer.current.x * 0.4 - t.rotation.y) * k;
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

/** Partikel cahaya 3D yang bereaksi halus terhadap gerakan mouse. */
export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef);
  const reduce = useReducedMotion();
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const [count] = useState(() => (window.innerWidth < 768 ? 220 : 420));

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        // Berhenti merender saat di luar layar; satu frame statis bila reduced-motion.
        frameloop={reduce ? "demand" : inView ? "always" : "never"}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <Particles count={count} animate={!reduce} pointer={pointer} />
      </Canvas>
    </div>
  );
}
