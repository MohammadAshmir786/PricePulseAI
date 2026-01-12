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
} from "@react-three/drei";
import { useTheme } from "../../context/ThemeContext.jsx";

// Floating Shopping Cube
function ShoppingCube({ position, color, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <Box ref={meshRef} args={[scale, scale, scale]} position={position}>
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={0.8}
        />
      </Box>
    </Float>
  );
}

// Glowing Orb
function GlowingOrb({ position, color, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.25}
          speed={1.2}
          roughness={0.3}
          metalness={0.6}
          precision="lowp"
        />
      </Sphere>
    </Float>
  );
}

// Floating Ring
function FloatingRing({ position, color, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={2}>
      <Torus
        ref={meshRef}
        args={[scale * 0.8, scale * 0.25, 16, 32]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </Torus>
    </Float>
  );
}

// Subtle animated particles
function ParticleField() {
  const count = 50;
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    particles.push([x, y, z]);
  }

  return (
    <group ref={meshRef}>
      {particles.map((pos, i) => (
        <Sphere key={i} args={[0.05, 8, 8]} position={pos}>
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Main Scene
function Scene({ theme }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={theme === "light" ? 0.6 : 0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "light" ? 0.8 : 0.6}
      />
      <pointLight
        position={[-10, -10, -5]}
        color="#ff7b5f"
        intensity={theme === "light" ? 0.4 : 0.3}
      />
      <pointLight
        position={[10, -10, -5]}
        color="#2d7ff9"
        intensity={theme === "light" ? 0.4 : 0.3}
      />

      <Environment preset={theme === "light" ? "sunset" : "night"} />

      {/* Floating Elements - Strategically placed for shop page */}
      <ShoppingCube position={[-6, 3, -5]} color="#ff7b5f" scale={0.8} />
      <ShoppingCube position={[6, -2, -6]} color="#2d7ff9" scale={1} />
      <ShoppingCube position={[-4, -3, -4]} color="#8b5cf6" scale={0.6} />

      <GlowingOrb position={[7, 2, -7]} color="#ff7b5f" scale={0.6} />
      <GlowingOrb position={[-7, -1, -6]} color="#2d7ff9" scale={0.5} />
      <GlowingOrb position={[3, 4, -8]} color="#8b5cf6" scale={0.4} />

      <FloatingRing position={[-5, 1, -5]} color="#ff7b5f" scale={0.7} />
      <FloatingRing position={[5, -3, -7]} color="#2d7ff9" scale={0.6} />

      {/* Additional depth elements */}
      <ShoppingCube position={[2, -4, -8]} color="#f59e0b" scale={0.5} />
      <GlowingOrb position={[-3, 3.5, -9]} color="#ec4899" scale={0.35} />

      {/* Subtle particle field in the background */}
      <ParticleField />
    </>
  );
}

export default function ThreeObjectsWithParticlesBackground() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  );
}
