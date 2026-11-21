'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function WaterRipple() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = -Math.PI / 2 + Math.sin(time * 0.2) * 0.05;
        mesh.current.position.y = -10 + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <planeGeometry args={[200, 200, 100, 100]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        wireframe 
        transparent 
        opacity={0.15}
      />
    </mesh>
  );
}

function Bubbles({ count = 40 }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
        mesh.current.children.forEach((child, i) => {
          child.position.y += 0.05;
          child.position.x += Math.sin(state.clock.getElapsedTime() + i) * 0.01;
          if (child.position.y > 15) {
            child.position.y = -15;
            child.position.x = (Math.random() - 0.5) * 30;
          }
        });
    }
  });

  return (
    <group ref={mesh}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 10]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Plankton({ count = 200 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 50;
       p[i * 3 + 1] = (Math.random() - 0.5) * 50;
       p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.position.y += Math.sin(state.clock.getElapsedTime() * 0.2) * 0.005;
        ref.current.rotation.y += 0.001;
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
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.5} />
    </points>
  );
}

export default function WaterBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 5, 25], fov: 75 }}>
        <color attach="background" args={['#010712']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 20, 10]} color="#60a5fa" intensity={4} />
        <fog attach="fog" args={['#010712', 10, 40]} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        <Sparkles count={300} scale={40} size={2} speed={0.5} color="#3b82f6" />
        <WaterRipple />
        <Bubbles />
        <Plankton />
      </Canvas>
    </div>
  );
}
