import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Borders from "./ThreeComponents/Borders";
import ColoredBox from "./ThreeComponents/ColoredBox";
import { CustomRect, centerRect } from "./utils";
import { possibleColorsType, BlackColor, RedColor, BlueColor, YellowColor, WhiteColor } from "./hooks/useMondrian";

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  rects: CustomRect[];
  toggleFullScreen: (target: EventTarget) => void;
}

function randomBetween(min: number, max: number) : number {
  return Math.random() * (max - min + 1) + min;
}


function MondrianThreeJs({width , height, thickness, rects, toggleFullScreen} : MondrianThreeJsProps ): React.ReactElement {
  const [depthBorder, setDepthBorder] = useState<number>(0.1);
  const [hasBorder, setHasBorder] = useState<boolean>(true);

  function computePosition(rect: CustomRect) : [number, number, number] {
    const [x, y] = centerRect(rect);
    /*
      -0.5 and 0.5 in position are here to center the shape
      Offset of 1 in z to make sure the shapes are visible
    */
    return [
      (rect.x1 + x)/ width -0.5,
      -(rect.y1 +y)/height + 0.5,
      Math.random() * 0.02
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
      { hasBorder && <Borders rects={rects} thickness={thickness} depth={depthBorder} /> }
      {
        rects.map((rect, index) => {
          return (
            <ColoredBox
              key={index}
              rect={rect}
              thickness={thickness}
              depth={0.15}
              meshProps={{position: computePosition(rect)}}
            />
          );
        })
      }
      <ambientLight args={[0xffffff]} intensity={0.5} position={[0, 0.5, 0.5]} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default MondrianThreeJs;