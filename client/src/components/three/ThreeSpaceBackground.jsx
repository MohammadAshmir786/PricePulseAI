import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useMemo } from "react";
import {
  PerspectiveCamera,
  Float,
  MeshDistortMaterial,
  Environment,
  Sphere,
  Box,
  Torus,
  Cylinder,
  Stars,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// Floating Product Box Component
function ProductBox({ position, scale = 1, rotation = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Box
        ref={meshRef}
        args={[1 * scale, 1 * scale, 1 * scale]}
        position={position}
      >
        <meshStandardMaterial
          color="#ff7b5f"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </Box>
    </Float>
  );
}

// Floating Shopping Bag/Tag Component
function ShoppingTag({ position, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <group ref={meshRef} position={position}>
        {/* Tag body */}
        <Box args={[1.2 * scale, 0.8 * scale, 0.1 * scale]}>
          <meshStandardMaterial
            color="#2d7ff9"
            metalness={0.6}
            roughness={0.3}
            envMapIntensity={0.8}
          />
        </Box>
        {/* Tag hole */}
        <Cylinder
          args={[0.12 * scale, 0.12 * scale, 0.15 * scale, 16]}
          position={[0.45 * scale, 0.25 * scale, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color="#1a5fd9"
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>
      </group>
    </Float>
  );
}

// Glowing Sphere/Orb
function GlowingSphere({ position, color = "#ff7b5f", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={2}>
      <Sphere ref={meshRef} args={[0.5 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          precision="lowp"
        />
      </Sphere>
    </Float>
  );
}

// Credit Card Component
function CreditCard({ position, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.8}>
      <Box
        ref={meshRef}
        args={[1.6 * scale, 1 * scale, 0.08 * scale]}
        position={position}
      >
        <meshStandardMaterial
          color="#1a1f3a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.2}
        />
      </Box>
    </Float>
  );
}

// Torus/Ring Component
function TorusRing({ position, color = "#ff7b5f", scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={2.5}>
      <Torus
        ref={meshRef}
        args={[0.6 * scale, 0.2 * scale, 16, 32]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={1}
        />
      </Torus>
    </Float>
  );
}

// Animated Particles Field
function ParticleField() {
  const particlesRef = useRef();
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={"#2d7ff9"}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Scene Component
function Scene() {
  return (
    <>
      {/* Camera with dynamic FOV */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
      <pointLight
        position={[-8, 5, -5]}
        intensity={0.5}
        color="#ff7b5f"
        distance={20}
      />
      <pointLight
        position={[8, -5, 5]}
        intensity={0.5}
        color="#2d7ff9"
        distance={20}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.3}
        color="#4169e1"
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Atmospheric Effects */}

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Sparkles
        count={100}
        scale={15}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#2d7ff9"
      />

      {/* 3D Scenery Elements */}
      <ParticleField />

      {/* Strategically positioned 3D Objects on edges */}
      {/* Left side */}
      <ProductBox position={[-7, 3, -3]} scale={0.7} rotation={[0.5, 0.5, 0]} />
      <ShoppingTag position={[-8, -2, -2]} scale={0.6} />
      <GlowingSphere position={[-7.5, -1, -4]} color="#2d7ff9" scale={0.8} />
      <TorusRing position={[-7, 1, -5]} color="#2d7ff9" scale={0.6} />

      {/* Right side */}
      <ProductBox
        position={[7.5, -2, -3]}
        scale={0.9}
        rotation={[0.2, 0.8, 0.3]}
      />
      <ShoppingTag position={[6.5, 3, -2]} scale={0.8} />
      <GlowingSphere position={[8, 1, -4]} color="#ff7b5f" scale={0.7} />
      <CreditCard position={[7, -0.5, -3]} scale={0.5} />
      <TorusRing position={[8.5, -3, -4]} color="#ff7b5f" scale={0.7} />

      {/* Top accents */}
      <GlowingSphere position={[0, 6, -6]} color="#f1c40f" scale={0.5} />
      <ProductBox
        position={[-3, 5, -5]}
        scale={0.5}
        rotation={[0.8, 0.2, 0.5]}
      />
      <ProductBox
        position={[3, 5.5, -5]}
        scale={0.6}
        rotation={[0.1, 0.4, 0.2]}
      />
    </>
  );
}

// Main Component
export default function ThreeSpaceBackground() {
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
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
