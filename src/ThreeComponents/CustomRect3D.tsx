import { usePreviousDifferent } from "rooks";
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
  const previousValueColor = usePreviousDifferent(customRect3D.color);

  const [xMiddle, yMiddle, zMiddle] = centerRect(customRect3D);
  const position : [number, number, number] = [
    (customRect3D.x1 + xMiddle),
    (customRect3D.y1 + yMiddle),
    (customRect3D.z1 + zMiddle)
  ]
  const previousValuePosition = usePreviousDifferent(position);

  const spring = useSpring({
    from: { color: previousValueColor, position: previousValuePosition },
    to  : { color: customRect3D.color, position },
    config: {
      tension: 250,
      friction: 20,
      precision: 0.0001
    },
    reset: true,
  });


  const widthGeometry = (widthRect(customRect3D) - thickness);
  const heightGeometry = (heightRect(customRect3D) - thickness);
  const depthGeometry = (depthRect(customRect3D) - thickness);
  const geometry : [number, number, number] = [widthGeometry, heightGeometry, depthGeometry];


  return (
    <animated.mesh
      position={spring.position as any}
    >
      <boxGeometry args={geometry} />
      <animated.meshStandardMaterial
        color={spring.color as unknown as string}
        emissive={"#212121"}
        roughness={0.478}
        metalness={0.122}
        wireframe={wireframe}
      />
    </animated.mesh>
  )
}

export default CustomRect3D;