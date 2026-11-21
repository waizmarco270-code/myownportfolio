'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function IceCrystals({ count = 30 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
          <Icosahedron 
            position={[(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20]} 
            args={[Math.random() * 0.5 + 0.2, 0]}
          >
            <meshPhysicalMaterial 
              color="#bae6fd" 
              metalness={1} 
              roughness={0} 
              transmission={0.8}
              thickness={1}
              transparent 
              opacity={0.8}
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
}

function Blizzard({ count = 500 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 50;
       p[i * 3 + 1] = (Math.random() - 0.5) * 50;
       p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.position.y -= 0.15;
        ref.current.position.x += 0.08;
        ref.current.rotation.z += 0.001;
        if (ref.current.position.y < -15) {
           ref.current.position.y = 15;
           ref.current.position.x = -5;
        }
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
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

function Aurora() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 10, -20]} rotation={[0.5, 0, 0]}>
      <planeGeometry args={[100, 40]} />
      <meshBasicMaterial 
        color="#7dd3fc" 
        transparent 
        opacity={0.05} 
        wireframe
      />
    </mesh>
  );
}

export default function IceBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <color attach="background" args={['#010d14']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[-15, 15, 10]} color="#e0f2fe" intensity={3} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={500} scale={50} size={2} speed={2} color="#bae6fd" />
        <IceCrystals />
        <Blizzard />
        <Aurora />
      </Canvas>
    </div>
  );
}
