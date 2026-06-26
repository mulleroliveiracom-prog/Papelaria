import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { energy, updateEnergy, chaosMode } = useGameStore();
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  
  // Game loop controls
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = chaosMode ? 0.8 : 0.4;
    const rotationSpeed = 2;
    
    // Simple flight logic
    // We'll simulate keys if we don't have KeyboardControls yet, but let's assume standard wasd for now
    // Actually, for mobile, we will need touch controls. I'll implement a simple auto-forward for now.
    
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(meshRef.current.quaternion);
    
    // Auto-forward
    meshRef.current.position.addScaledVector(forward, speed);
    
    // Descent gravity
    meshRef.current.position.y -= 0.05 * delta;

    // Movement limits
    if (meshRef.current.position.y < 0.5) meshRef.current.position.y = 0.5;
    if (meshRef.current.position.y > 50) meshRef.current.position.y = 50;

    // Energy drain
    updateEnergy(-0.01);
  });

  return (
    <group ref={meshRef} position={[0, 10, 0]}>
      {/* Visual representation of the Urubu */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Wings */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <PerspectiveCamera makeDefault position={[0, 3, 6]} fov={90} />
    </group>
  );
};
