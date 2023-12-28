import { useEffect } from "react";
import { usePreviousDifferent } from "rooks";
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect3D } from "../utils";


interface CustomRect3DRendererProps {
  customRect3D: CustomRect3D;
  thickness: number;
}

function length(axis1: number, axis2: number) : number {
    return Math.abs(axis2 - axis1);
}

export function widthRect({x1, x2}: CustomRect3D) : number {
    return length(x2, x1);
}

export function heightRect({y1, y2} : CustomRect3D) : number {
    return length(y2, y1);
}

export function depthRect({z1, z2} : CustomRect3D) : number {
    return length(z2, z1);
}

export function centerRect(rect : CustomRect3D) : [number, number, number] {
    return [ widthRect(rect)/ 2, heightRect(rect) / 2, depthRect(rect) / 2 ];
}


function CustomRect3DRenderer({customRect3D, thickness, meshProps}: CustomRect3DRendererProps) {
  const { size: { width, height } } = useThree();
  const previousValueColor = usePreviousDifferent(customRect3D.color);
  const spring = useSpring({
    from: { color: previousValueColor },
    to  : { color: customRect3D.color },
    config: {
      duration: 500,
    },
    reset: true,
  });

  const depth = width;
  const widthGeometry = (widthRect(customRect3D) - thickness)/width;
  const heightGeometry = (heightRect(customRect3D) - thickness)/height;
  const depthGeometry = (depthRect(customRect3D) - thickness)/depth;

  const [xMiddle, yMiddle, zMiddle] = centerRect(customRect3D);


  return (
    <mesh
      position={[
        (customRect3D.x1 + xMiddle)/width,
        (customRect3D.y1 + yMiddle)/height,
        (customRect3D.z1 + zMiddle)/depth
      ]}
    >
      <boxGeometry args={[widthGeometry,heightGeometry, depthGeometry]} />
      <animated.meshStandardMaterial color={spring.color} wireframe={true}/>

    </mesh>
  )
}

export default CustomRect3DRenderer;