import { useThree } from '@react-three/fiber';
import { config } from '@react-spring/web';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect3D } from "../hooks/use3DMondrian";


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


interface CustomRect3DProps {
  customRect3D: CustomRect3D;
  thickness: number;
  wireframe?: boolean;
}

// hooks contains a lots of variables between the hooks
function CustomRect3D({ customRect3D, thickness, wireframe = false }: CustomRect3DProps) {
  const { size: { width, height } } = useThree();
  const depth = width;

  const spring = useSpring({
    from: { scale: 0,  },
    to  : { scale: 1 },
    config: {
      ...config.stiff,
      duration: 500,
      precision: 0.0001
    },
    reset: true,
  });

  const [xMiddle, yMiddle, zMiddle] = centerRect(customRect3D);
  const position = [
    (customRect3D.x1 + xMiddle)/width,
    (customRect3D.y1 + yMiddle)/height,
    (customRect3D.z1 + zMiddle)/depth
  ]

  const widthGeometry = (widthRect(customRect3D) - thickness)/width;
  const heightGeometry = (heightRect(customRect3D) - thickness)/height;
  const depthGeometry = (depthRect(customRect3D) - thickness)/depth;
  const geometry = [widthGeometry, heightGeometry, depthGeometry];



  return (
    <animated.mesh
      position={position}
      scale={spring.scale}
    >
      <boxGeometry args={geometry}  />
      <animated.meshStandardMaterial
        color={customRect3D.color}
        emisive={"#212121"}
        roughness={0.478}
        metalness={0.122}
        wireframe={wireframe}
        castShadow={true}
        receiveShadow={true}
      />
    </animated.mesh>
  )
}

export default CustomRect3D;