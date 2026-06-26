import React from 'react';
import { Sky, Stars, Cloud, Environment, ContactShadows } from '@react-three/drei';
import { Player } from './Player';

export const Scene = () => {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1.5} />
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 100, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
      />
      
      {/* Ground - Sci-Fi/Urban Hybrid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.8} />
      </mesh>

      <gridHelper args={[2000, 100, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />

      {/* Neons/Buildings */}
      {Array.from({ length: 40 }).map((_, i) => (
        <group key={i} position={[(Math.random() - 0.5) * 400, 0, (Math.random() - 0.5) * 400]}>
          <mesh position={[0, 15, 0]} castShadow>
            <boxGeometry args={[12, 30, 12]} />
            <meshStandardMaterial color="#0f172a" emissive="#1e293b" />
          </mesh>
          <mesh position={[7, 15, 0]}>
            <boxGeometry args={[0.2, 28, 12.2]} />
            <meshStandardMaterial color={['#fbbf24', '#22c55e', '#ef4444'][i % 3]} emissive={['#fbbf24', '#22c55e', '#ef4444'][i % 3]} emissiveIntensity={5} />
          </mesh>
        </group>
      ))}

      {/* Lixão items */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={`trash-${i}`} position={[(Math.random() - 0.5) * 100, 0.5, (Math.random() - 0.5) * 100]} castShadow>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}

      <Player />
      
      <ContactShadows opacity={0.4} scale={200} blur={1} far={40} resolution={256} color="#000" />
    </>
  );
};
