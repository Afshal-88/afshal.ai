"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { X_BOX, X_POLYS } from "./xShape";

const S = 1 / 110; // logo px -> scene units
const cx = X_BOX.x + X_BOX.w / 2, cy = X_BOX.y + X_BOX.h / 2;

function XMark() {
  const group = useRef<THREE.Group>(null);
  const geos = useMemo(() => X_POLYS.map((poly) => {
    const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2((x - cx) * S, -(y - cy) * S)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 3 });
    g.translate(0, 0, -0.3);
    return g;
  }), []);
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);

  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const t = state.clock.elapsedTime;
    const tx = state.pointer.y * -0.35 + Math.sin(t * 0.6) * 0.06;
    const ty = state.pointer.x * 0.55 + Math.sin(t * 0.4) * 0.25;
    g.rotation.x += (tx - g.rotation.x) * Math.min(1, dt * 3);
    g.rotation.y += (ty - g.rotation.y) * Math.min(1, dt * 3);
    g.position.y = Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group}>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color="#ffd400" metalness={0.35} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 380, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - 0.5) * 16; a[i * 3 + 1] = (Math.random() - 0.5) * 10; a[i * 3 + 2] = -2 - Math.random() * 8; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.01; });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.025} color="#edeae3" transparent opacity={0.55} sizeAttenuation /></points>;
}

/** The Star X "X" in 3D, turning toward the pointer, over a slow star field. Pauses when off screen. */
export default function StarX3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} eventSource={typeof document !== "undefined" ? document.body : undefined} eventPrefix="client">
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#fff3b0" />
        <pointLight position={[0, 0, 3]} intensity={6} distance={8} color="#ffffff" />
        <Stars />
        <XMark />
      </Canvas>
    </div>
  );
}
