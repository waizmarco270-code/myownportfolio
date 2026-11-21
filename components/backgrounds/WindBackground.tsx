'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function WindParticles({ count = 300 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 60;
       p[i * 3 + 1] = (Math.random() - 0.5) * 60;
       p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y += 0.005;
        ref.current.rotation.x += 0.001;
        ref.current.position.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 5;
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
      <pointsMaterial size={0.12} color="#34d399" transparent opacity={0.4} />
    </points>
  );
}

function WindWaves({ count = 30 }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
        mesh.current.children.forEach((child, i) => {
          child.position.x += 0.6; // High speed
          if (child.position.x > 20) {
            child.position.x = -20;
            child.position.y = (Math.random() - 0.5) * 15;
          }
        });
    }
  });

  return (
    <group ref={mesh}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, 0]}>
          <boxGeometry args={[Math.random() * 8 + 2, 0.03, 0.03]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Leaves({ count = 20 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float key={i} speed={5} rotationIntensity={3} floatIntensity={3}>
           <mesh position={[(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20]}>
              <planeGeometry args={[0.2, 0.3]} />
              <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.8} />
           </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function WindBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <color attach="background" args={['#010c06']} />
        <ambientLight intensity={0.6} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        <Sparkles count={300} scale={40} size={4} speed={3} color="#34d399" />
        <WindParticles />
        <WindWaves />
        <Leaves />
      </Canvas>
    </div>
  );
}
