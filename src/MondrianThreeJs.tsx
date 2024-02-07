import { useRef, useState, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage } from '@react-three/drei';
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3D";
import { CustomRect3D } from "./hooks/use3DMondrian";
import Scanline from "./ThreeComponents/Scanline";

interface MondrianThreeJsProps {
  shapeSizes: [number, number, number];
  thickness: number;
  customRects3D: CustomRect3D[];
}

function MondrianThreeJs({
  thickness,
  customRects3D,
} : MondrianThreeJsProps ): React.ReactElement {
  const canvasActionsRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const {
    toggleFullscreen,
    isFullscreenEnabled
  } = useFullscreen({ target: canvasActionsRef });

  useEffect(() => {
    if(!isFullscreenEnabled) {
          setWidth(500);
          setHeight(500);
        } else {
          setWidth(window.innerWidth);
          setHeight(window.innerHeight);
        }
  }, [isFullscreenEnabled])


  return (
    <Canvas
      ref={canvasActionsRef}
      camera={{ position: [0,0, 1.75], fov: 75, far: 5, aspect: window.innerWidth / window.innerHeight }}
      dpr={window.devicePixelRatio}
      shadows
      onDoubleClick={toggleFullscreen}
      style={{ width, height }}
    >
      <color attach="background" args={['#06092c']} />
      <Suspense fallback={null}>
        <Stage
          environment={null}
        >
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
        </Stage>
        <Scanline />
      </Suspense>
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="black" axisHeadScale={1} />
      </GizmoHelper>
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default MondrianThreeJs;