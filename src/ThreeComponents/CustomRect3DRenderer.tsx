import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect3D, heightRect, widthRect, depthRect } from "../utils";


interface CustomRect3DRendererProps {
  customRect3D: CustomRect3D;
  thickness: number;
}

function CustomRect3DRenderer({customRect3D, thickness, meshProps}: CustomRect3DRendererProps) {
  const { size: { width, height } } = useThree();
  const depth = width;
  const widthGeometry = (customRect3D.x2 - customRect3D.x1)/width;
  const heightGeometry = (customRect3D.y2 - customRect3D.y1)/height;
  const depthGeometry = (customRect3D.z2 - customRect3D.z1)/depth;

  return (
    <mesh position={[customRect3D.x1/width, customRect3D.y1/height, customRect3D.z1/depth]} >
      <boxGeometry args={[widthGeometry,heightGeometry, depthGeometry]} />
      <meshStandardMaterial color={customRect3D.color} wireframe={true}/>
    </mesh>
  )
}

export default CustomRect3DRenderer;