import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Borders from "./ThreeComponents/Borders";
import ColoredBox from "./ThreeComponents/ColoredBox";
import CustomRect3DRenderer from "./ThreeComponents/CustomRect3DRenderer";
import { CustomRect, centerRect, CustomRect3D, centerRect3d } from "./utils";

interface MondrianConfig {
 rects: CustomRect[];
 rotation: [number, number, number];
 position: [number, number, number];
}

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  rectsXY: CustomRect[];
  rectsYZ: CustomRect[];
  rectsZX: CustomRect[];
  customRects3D: CustomRect3D[];
  toggleFullScreen: (target: EventTarget) => void;
}


function MondrianThreeJs({
  width,
  height,
  thickness,
  rectsXY,
  rectsYZ,
  rectsZX,
  customRects3D,
  toggleFullScreen
} : MondrianThreeJsProps ): React.ReactElement {
  const [depthBorder, _setDepthBorder] = useState<number>(0.1);
  const [hasBorder, _setHasBorder] = useState<boolean>(true);
  const [hasColor, _setHasColor] = useState<boolean>(true);
  const depth = 0.15;

  const mondrianConfigs : MondrianConfig[] = [
    { rects: rectsXY, rotation: [-Math.PI/2,0,0], position: [0,-0.5 - depth/2 ,0] },
    { rects: rectsYZ, rotation: [0,Math.PI/2,0], position: [-0.5 - depth/2,0,0] },
    { rects: rectsZX, rotation: [0,0,-2*Math.PI], position: [0,0,-0.5 - depth/2] }
  ]

  function computePosition(rect: CustomRect) : [number, number, number] {
    const [x, y] = centerRect(rect);
    /*
      -0.5 and 0.5 in position are here to center the shape
      Offset of 1 in z to make sure the shapes are visible
    */
    return [
      (rect.x1 + x)/ width -0.5,
      -(rect.y1 +y)/height + 0.5,
      0
    ];
  }

  function computeVolumePosition(rect3d : CustomRect3D) : [number, number, number] {
    const [x, y, z] = centerRect3d(rect3d);
    /*
      -0.5 and 0.5 in position are here to center the shape
      Offset of 1 in z to make sure the shapes are visible
    */
    return [
      (rect3d.x1 + x)/ width -0.5,
      -(rect3d.y1 +y)/height + 0.5,
      -(rect3d.z1 + z)/ width - 0.5
    ];
  }

  return (
    <Canvas
      camera={{ position: [-0.15, 0.15, 1.5], fov: 75, far: 5 }}
      dpr={window.devicePixelRatio}
      style={{width, height }}
      onDoubleClick={(event: any) => {
        // trick to override canvas background color
        event.target.style.background="#313131";
        toggleFullScreen(event.target)
      }}
    >
      <color attach="background" args={[0x797979]} />
      {
        mondrianConfigs.map( ({rects, rotation, position}) =>
          <group position={position} rotation={rotation}>
          { hasBorder && <Borders rects={rects} thickness={thickness} depth={depthBorder} /> }
          {
            hasColor && rects.map((rect, index) => {
              return (
                <ColoredBox
                  key={index}
                  rect={rect}
                  thickness={thickness}
                  depth={depth}
                  meshProps={{position: computePosition(rect)}}
                />
              );
            })
          }
          {
            customRects3D.map((rect3d, index) => {
              return (
                <CustomRect3DRenderer
                  key={index}
                  customRect3D={rect3d}
                  thickness={thickness}
                  meshProps={{position: computeVolumePosition(rect3d)}}
                />
              );
            })
          }
          </group>

        )
      }
      <ambientLight args={[0xffffff]} intensity={0.5} position={[0, 0.5, 0.5]} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default MondrianThreeJs;