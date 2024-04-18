import { useRef, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds, useBounds } from '@react-three/drei';
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3D";
import { CustomRect3D } from "./hooks/use3DMondrian";
import Scanline from "./ThreeComponents/Scanline";
import ShapeBounds, { ExternalActionInterface } from "./ThreeComponents/ShapeBounds";

interface MondrianThreeJsProps {
  shapeSizes: [number, number, number];
  thickness: number;
  customRects3D: CustomRect3D[];
  handleGenerate: () => void;
}

function ThreejsRenderer({
  shapeSizes,
  thickness,
  customRects3D,
  handleGenerate
} : MondrianThreeJsProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    toggleFullscreen,
    isFullscreenEnabled
  } = useFullscreen({ target: canvasContainerRef });
  const groupRef = useRef<ExternalActionInterface| null>(null);

  useEffect(() => {
    if(!groupRef.current) {
      return;
    }
    groupRef.current.recenter();
  }, [customRects3D]);


  return (
    <div ref={canvasContainerRef} className="w-full h-full">
      <div className={`self-start relative ${isFullscreenEnabled ? "" : "hidden"}`}>
        <button onClick={handleGenerate} className="btn btn-outline absolute z-10 top-6 left-1">
          Generate
        </button>
      </div>
      <Canvas
        camera={{ position: [0,0, 1.75], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={() => {
          toggleFullscreen();
          groupRef.current.recenter();
        }}
      >
        <color attach="background" args={['#06092c']} />
        <Suspense fallback={null}>
          <Stage preset="rembrandt" intensity={1} environment="studio">
            <Bounds fit clip observe margin={2}>
              <ShapeBounds ref={groupRef}>
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
             </ShapeBounds>
             </Bounds>
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