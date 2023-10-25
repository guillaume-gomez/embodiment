import * as THREE from 'three';
import { useMemo } from 'react';
import {  useThree } from '@react-three/fiber';
import { CustomRect, heightRect, widthRect, centerRect } from "../utils";

interface BorderProps {
  position: [number, number, number];
  geometry:THREE.BoxGeometry;
  material: THREE.MeshStandardMaterial;
  meshProps?: JSX.IntrinsicElements['mesh'];
}

function BorderRect({ position, geometry, material, meshProps }: BorderProps) {
  return (
    <mesh
      material={material}
      geometry={geometry}
      position={position}
      {...meshProps}
    />
  )
}

export default BorderRect;