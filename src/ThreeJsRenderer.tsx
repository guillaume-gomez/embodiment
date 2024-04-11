import { useRef, useState, Suspense } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid } from '@react-three/drei';
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3D";
import { CustomRect3D } from "./hooks/use3DMondrian";
import Scanline from "./ThreeComponents/Scanline";

interface MondrianThreeJsProps {
  shapeSizes: [number, number, number];
  thickness: number;
  customRects3D: CustomRect3D[];
}

function ThreejsRenderer({
  shapeSizes,
  thickness,
  customRects3D,
} : MondrianThreeJsProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: canvasContainerRef });


  return (
    <div ref={canvasContainerRef} className="w-full h-full">
      <Canvas
        camera={{ position: [0,0, 1.75], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={toggleFullscreen}
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
                    shapeSizes={shapeSizes}
                    customRect3D={customRect3D}
                    thickness={thickness}
                  />
                );
              })
             }
           </group>
          </Stage>
          <Scanline />
          <Grid args={[10, 10]} position={[0,-0.5,0]} cellColor='white' />
        </Suspense>
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

export default ThreejsRenderer;