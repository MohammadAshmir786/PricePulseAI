import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import {
  PerspectiveCamera,
  Float,
  Environment,
  Sphere,
  Box,
  Torus,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// Simple Floating Sphere
function FloatingSphere({ position, color = "#ff7b5f", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[0.6 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={0.25}
          speed={1.2}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.6}
          precision="lowp"
        />
      </Sphere>
    </Float>
  );
}

// Simple Box
function SoftBox({ position, color = "#ffb4a2", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <Box
        ref={meshRef}
        args={[0.8 * scale, 0.8 * scale, 0.8 * scale]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.5}
        />
      </Box>
    </Float>
  );
}

// Simple Ring
function SoftRing({ position, color = "#ffc7c7", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.8}>
      <Torus
        ref={meshRef}
        args={[0.5 * scale, 0.15 * scale, 16, 32]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.15}
          transparent
          opacity={0.5}
        />
      </Torus>
    </Float>
  );
}

// Main Light Theme Scene
function LightThemeScene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />

      {/* Simple Clean Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ffccb3" />
      <pointLight position={[5, -3, 5]} intensity={0.3} color="#ffd9b3" />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Minimal Effects */}
      <Sparkles
        count={40}
        scale={12}
        size={0.8}
        speed={0.2}
        opacity={0.25}
        color="#ffd700"
      />

      {/* Left Side - Only 3 objects */}
      <FloatingSphere position={[-7, 2, -5]} color="#ffb4a2" scale={0.8} />
      <SoftBox position={[-8, -1, -4]} color="#ffd6a5" scale={0.7} />
      <SoftRing position={[-7.5, 0, -6]} color="#ffc7c7" scale={0.7} />

      {/* Right Side - Only 3 objects */}
      <FloatingSphere position={[7, 1, -5]} color="#a8dadc" scale={0.9} />
      <SoftBox position={[8, -2, -4]} color="#ffe4d6" scale={0.8} />
      <SoftRing position={[7.5, 0.5, -6]} color="#ffd9b3" scale={0.8} />

      {/* Top Accents - Only 3 objects */}
      <FloatingSphere position={[0, 5, -7]} color="#f1c40f" scale={0.5} />
      <SoftBox position={[-3, 4, -6]} color="#d4a5ff" scale={0.5} />
      <SoftBox position={[3, 4.5, -6]} color="#a8e6cf" scale={0.5} />
    </>
  );
}

// Main Component
export default function ThreeLightThemeBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <LightThemeScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
