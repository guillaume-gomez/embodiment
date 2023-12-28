//import { useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect3D, heightRect, widthRect, depthRect } from "../utils";


interface CustomRect3DRendererProps {
  customRect3D: CustomRect3D;
  thickness: number;
  meshProps: JSX.IntrinsicElements['mesh'];
}

function CustomRect3DRenderer({customRect3D, thickness, depth, meshProps}: CustomRect3DRendererProps) {
  const { size: { width, height } } = useThree();

  const position = meshProps.position.slice();
  const widthGeometry = (widthRect(customRect3D) - thickness)/ width;
  const heightGeometry = (heightRect(customRect3D) - thickness)/ height;
  const depthGeometry = (depthRect(customRect3D) - thickness) / width; //width or height


  return (
    <mesh position={position as any} >
      <boxGeometry args={[widthGeometry, heightGeometry, depthGeometry]} />
      <meshStandardMaterial color={customRect3D.color} wireframe={true}/>
    </mesh>
  )
}

export default CustomRect3DRenderer;