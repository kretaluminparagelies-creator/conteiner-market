/**
 * @file ContainerSceneGLB.tsx
 * @description Canvas wrapper for Sketchfab GLB container model
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ContainerModelGLB } from "@/components/container/ContainerModelGLB";
import { sketchfabModel } from "@/lib/constants/sketchfab";

type ContainerSceneGLBProps = {
  doorsOpen?: boolean;
};

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2.4, 1.06, 1]} />
      <meshBasicMaterial color="#e07030" wireframe />
    </mesh>
  );
}

export function ContainerSceneGLB({ doorsOpen = false }: ContainerSceneGLBProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{
        position: [...sketchfabModel.cameraPosition],
        fov: sketchfabModel.cameraFov,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(sketchfabModel.canvasBackground, 1);
      }}
      style={{ width: "100%", height: "100%", background: sketchfabModel.canvasBackground }}
    >
      <color attach="background" args={[sketchfabModel.canvasBackground]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[8, 10, 6]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, 4, -5]} intensity={0.6} color="#4ab0e8" />
      <pointLight position={[0, 2, 4]} intensity={0.8} color="#e07030" />
      <Suspense fallback={<LoadingFallback />}>
        <ContainerModelGLB doorsOpen={doorsOpen} />
      </Suspense>
    </Canvas>
  );
}
