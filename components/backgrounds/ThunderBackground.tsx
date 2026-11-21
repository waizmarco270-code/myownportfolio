'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Lightning({ count = 12 }) {
  const mesh = useRef<THREE.Group>(null);
  const flash = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.children.forEach((child, i) => {
        if (Math.random() > 0.98) {
          child.visible = true;
          if (flash.current) flash.current.intensity = 10;
          const duration = 50 + Math.random() * 100;
          setTimeout(() => { if(child) child.visible = false; if(flash.current) flash.current.intensity = 0; }, duration);
        }
      });
    }
  });

  return (
    <group ref={mesh}>
      <pointLight ref={flash} intensity={0} color="#facc15" distance={50} />
      {Array.from({ length: count }).map((_, i) => {
        const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
        return (
          <group key={i} rotation={rotation as any} visible={false}>
            {/* Main Bolt */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 20, 0.08]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            {/* Glow bolt */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 20, 0.15]} />
              <meshBasicMaterial color="#facc15" transparent opacity={0.4} />
            </mesh>
            {/* Branching branches */}
            {Array.from({ length: 3 }).map((_, j) => (
              <mesh key={j} position={[1, 5 - j * 4, 0]} rotation={[0, 0, 0.8]}>
                <boxGeometry args={[0.04, 6, 0.04]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function PlasmaSpheres({ count = 8 }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float key={i} speed={4} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 10]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#facc15" />
            <pointLight intensity={2} distance={5} color="#facc15" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function ThunderBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <color attach="background" args={['#080601']} />
        <ambientLight intensity={0.2} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={3} />
        <Sparkles count={400} scale={40} size={10} speed={4} color="#facc15" />
        <Lightning />
        <PlasmaSpheres />
      </Canvas>
    </div>
  );
}
