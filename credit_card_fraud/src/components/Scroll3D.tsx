import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Environment, ContactShadows, Loader, useGLTF, Center } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

const CreditCardModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/credit_card.glb');
  const { scrollYProgress } = useScroll();
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0.5, Math.PI * 2.5]);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smoothly follow mouse + Scroll + Idle Float
    groupRef.current.position.y = Math.sin(t) * 0.08;
    groupRef.current.rotation.x = rotationX.get() + mouse.current.y * 0.2 + t * 0.05;
    groupRef.current.rotation.y = rotationY.get() + mouse.current.x * 0.2 + t * 0.1;
    groupRef.current.position.z = 0;
  });

  return (
    <group ref={groupRef} scale={0.485} position={[4.0, 0, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.15}
          color="#a5b4fc"
          fillOpacity={0.5}
        >
          SECURED BY AI
        </Text>
      </Float>
    </group>
  );
};

const Scroll3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, height: '100vh' }}>
      <Canvas 
        shadows 
        gl={{ antialias: true, alpha: true }} 
        camera={{ position: [0, 0, 15], fov: 35 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#6366f1" />
        <spotLight 
          position={[-10, 20, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={4} 
          color="#a855f7" 
          castShadow 
        />
        
        <React.Suspense fallback={null}>
          <Environment preset="city" />
          <CreditCardModel />
          <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2.5} far={6} />
        </React.Suspense>
      </Canvas>
      <Loader />
    </div>
  );
};

// Pre-load the model
useGLTF.preload('/models/credit_card.glb');

export default Scroll3D;
