'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function Rocks({ count = 25 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float key={i} speed={0.8} rotationIntensity={2} floatIntensity={1}>
          <mesh position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15]}>
            <dodecahedronGeometry args={[Math.random() * 1.5 + 0.5, 0]} />
            <meshStandardMaterial color="#78350f" roughness={1} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Dust({ count = 300 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 60;
       p[i * 3 + 1] = (Math.random() - 0.5) * 60;
       p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.position.x -= 0.02;
        ref.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#d97706" transparent opacity={0.3} />
    </points>
  );
}

function InnerCore() {
  return (
    <mesh position={[0, -20, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 20, 20]} />
      <meshStandardMaterial color="#451a03" wireframe transparent opacity={0.2} />
    </mesh>
  );
}

export default function EarthBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <color attach="background" args={['#0a0601']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[20, 20, 20]} color="#fbbf24" intensity={3} />
        <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={0.2} />
        <Sparkles count={150} scale={50} size={5} speed={0.5} color="#b45309" />
        <Rocks />
        <Dust />
        <InnerCore />
      </Canvas>
    </div>
  );
}
