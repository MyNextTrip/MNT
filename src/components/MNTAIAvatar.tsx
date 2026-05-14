"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function AvatarCore({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.z = time * 0.3;
      // React to speaking with scale pulse
      const scale = isSpeaking ? 1.2 + Math.sin(time * 10) * 0.1 : 1.2;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -time * 0.3;
      outerRef.current.rotation.x = time * 0.2;
    }
  });

  return (
    <group>
      {/* Inner Glowing Core */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#003B95"
          speed={isSpeaking ? 5 : 2}
          distort={0.4}
          radius={1}
          emissive="#0060ff"
          emissiveIntensity={isSpeaking ? 2 : 0.5}
        />
      </Sphere>

      {/* Outer Holographic Ring */}
      <Sphere ref={outerRef} args={[1.5, 64, 64]}>
        <MeshWobbleMaterial
          color="#D4AF37"
          speed={1}
          factor={0.4}
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Atmospheric Particles */}
      <pointLight position={[10, 10, 10]} intensity={1} color="#0060ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
    </group>
  );
}

export default function MNTAIAvatar({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <React.Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <AvatarCore isSpeaking={isSpeaking} />
          </Float>

          <Environment preset="city" />
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </React.Suspense>
      </Canvas>
      
      {/* HUD Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 border border-primary/20 rounded-full animate-ping opacity-10" />
        <div className="absolute w-72 h-72 border-2 border-primary/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
