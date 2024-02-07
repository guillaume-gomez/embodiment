import { useRef, Suspense } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage } from '@react-three/drei';
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3D";
import { CustomRect3D } from "./hooks/use3DMondrian";
import Scanline from "./ThreeComponents/Scanline";

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  customRects3D: CustomRect3D[];
}

function MondrianThreeJs({
  width,
  height,
  thickness,
  customRects3D,
} : MondrianThreeJsProps ): React.ReactElement {
  const canvasActionsRef = useRef<HTMLCanvasElement>(null);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: canvasActionsRef });


  return (
    <Canvas
      ref={canvasActionsRef}
      camera={{ position: [0,0, 1.75], fov: 75, far: 5 }}
      dpr={window.devicePixelRatio}
      shadows
      style={{width, height }}
      onDoubleClick={(event: any) => {
        // trick to override canvas background color
        event.target.style.background="#06092c";
        toggleFullscreen()
      }}
    >
      <color attach="background" args={['#06092c']} />
      <Suspense fallback={null}>
        <Stage preset="rembrandt" intensity={1} environment="studio">
          <group
            position={[-0.5, -0.5, -0.5]}
          >
            {
            customRects3D.map((customRect3D, index) => {
              return (
                <CustomRect3DRenderer
                  key={index}
                  customRect3D={customRect3D}
                  thickness={thickness}
                />
              );
            })
           }
         </group>
        <Scanline />
        </Stage>
      </Suspense>
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="black" axisHeadScale={1} />
      </GizmoHelper>
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default MondrianThreeJs;