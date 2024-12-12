import { useRef, Suspense, useEffect } from 'react';
import { useFullscreen } from "rooks";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport, Stage, Grid, Bounds } from '@react-three/drei';
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3D";
import { CustomRect3D } from "./hooks/use3DMondrian";
import Scanline from "./ThreeComponents/Scanline";
import FallBackLoader from "./ThreeComponents/FallBackLoader";
import ShapeBounds, { ExternalActionInterface } from "./ThreeComponents/ShapeBounds";

interface MondrianThreeJsProps {
  shapeSizes: [number, number, number];
  thickness: number;
  wireframe: boolean;
  customRects3D: CustomRect3D[];
  handleGenerate: () => void;
}

const SCALE = 1000;

function ThreejsRenderer({
  shapeSizes,
  thickness,
  wireframe,
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
    recenter()
  }, [customRects3D]);

  function recenter() {
    if(!groupRef.current) {
      return;
    }
    groupRef.current.recenter();
  }

  const [width, _height, depth] = shapeSizes;

  return (
    <div ref={canvasContainerRef} className="w-full h-full max-h-[92%]">
      <div className={`self-start relative ${isFullscreenEnabled ? "" : "hidden"}`}>
        <button onClick={handleGenerate} className="btn btn-outline absolute z-10 top-6 left-1">
          Generate
        </button>
      </div>
      <Canvas
        camera={{ position: [0,0.75, 1.5], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
        shadows
        onDoubleClick={() => {
          toggleFullscreen();
          recenter();
        }}
      >
        <color attach="background" args={['#06092c']} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage preset="rembrandt" adjustCamera={false} intensity={0.5} environment="studio">
            <Bounds fit clip observe margin={2}>
              <ShapeBounds ref={groupRef}>
                <group
                  scale={1/SCALE}
                  position={[-((width/2)/SCALE), 0, -(depth/2)/SCALE]}
                >
                  {
                  customRects3D.map((customRect3D, index) => {
                    return (
                      <CustomRect3DRenderer
                        key={index}
                        customRect3D={customRect3D}
                        thickness={thickness}
                        wireframe={wireframe}
                      />
                    );
                  })
                 }
               </group>
             </ShapeBounds>
             </Bounds>
             <Grid args={[50, 50]} position={[0,0,0]} cellColor='white' />
          </Stage>
          <Scanline />
        </Suspense>
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <OrbitControls makeDefault maxDistance={5} />
      </Canvas>
    </div>
  );
}

export default ThreejsRenderer;