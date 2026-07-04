/**
 * @file ContainerModelGLB.tsx
 * @description Plan A-GLB — Sketchfab shipping container (swap/fallback: ContainerModel3D.tsx)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { Center, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import {
  Color,
  MathUtils,
  MeshStandardMaterial,
  type Group,
  type Material,
  type Object3D,
} from "three";
import { sketchfabModel } from "@/lib/constants/sketchfab";

type ContainerModelGLBProps = {
  doorsOpen?: boolean;
};

function lerpAngle(current: number, target: number, t: number) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * Math.min(t, 1);
}

function hideBackgroundElements(root: Object3D) {
  root.traverse((object) => {
    if (/background|floor|ground|sky|plane|backdrop/i.test(object.name)) {
      object.visible = false;
    }
  });
}

function hideExtraContainers(root: Object3D) {
  root.traverse((object) => {
    if (sketchfabModel.hiddenNodes.some((name) => object.name.startsWith(name))) {
      object.visible = false;
    }
  });
}

function brightenMaterials(root: Object3D) {
  root.traverse((object) => {
    if (!("material" in object) || !object.material) return;

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material as Material];

    for (const material of materials) {
      if (material instanceof MeshStandardMaterial) {
        material.emissive = new Color("#2a4870");
        material.emissiveIntensity = 0.35;
        material.metalness = Math.min(material.metalness, 0.6);
        material.roughness = Math.max(material.roughness, 0.35);
      }
    }
  });
}

function ContainerModelInner({ doorsOpen = true }: ContainerModelGLBProps) {
  const groupRef = useRef<Group>(null);
  const initializedRef = useRef(false);
  const { invalidate } = useThree();
  const { scene } = useGLTF(sketchfabModel.path);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    hideExtraContainers(clone);
    hideBackgroundElements(clone);
    brightenMaterials(clone);
    return clone;
  }, [scene]);

  useEffect(() => {
    invalidate();
  }, [doorsOpen, invalidate]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const dt = Math.min(delta, sketchfabModel.maxFrameDelta);

    if (!initializedRef.current) {
      groupRef.current.rotation.y = sketchfabModel.faceCameraYaw;
      groupRef.current.rotation.x = 0;
      initializedRef.current = true;
      invalidate();
      return;
    }

    if (doorsOpen) {
      groupRef.current.rotation.y = lerpAngle(
        groupRef.current.rotation.y,
        sketchfabModel.faceCameraYaw,
        dt * sketchfabModel.faceCameraLerp,
      );
      groupRef.current.rotation.x = MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        dt * sketchfabModel.faceCameraLerp,
      );
    } else {
      groupRef.current.rotation.y += dt * sketchfabModel.rotationSpeed;
      groupRef.current.rotation.x = Math.sin(groupRef.current.rotation.y * 0.5) * 0.05;
    }

    invalidate();
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={model} scale={sketchfabModel.modelScale} />
      </Center>
    </group>
  );
}

export function ContainerModelGLB(props: ContainerModelGLBProps) {
  return <ContainerModelInner {...props} />;
}

useGLTF.preload(sketchfabModel.path);
