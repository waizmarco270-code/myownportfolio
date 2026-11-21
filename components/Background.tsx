'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;
const INITIAL_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  INITIAL_POSITIONS[i * 3] = (Math.random() - 0.5) * 10;
  INITIAL_POSITIONS[i * 3 + 1] = (Math.random() - 0.5) * 10;
  INITIAL_POSITIONS[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={INITIAL_POSITIONS} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#991b1b"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-neutral-950">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/50 to-neutral-950" />
    </div>
  );
}
