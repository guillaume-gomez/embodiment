import * as THREE from 'three';
import { useMemo } from 'react';
import {  useThree } from '@react-three/fiber';
import { CustomRect, heightRect, widthRect, centerRect } from "../utils";
import Border from "./Border";

interface BorderRectProps {
  rect: CustomRect;
  thickness: number;
  depth: number;
  meshProps?: JSX.IntrinsicElements['mesh'];
}

const material = new THREE.MeshStandardMaterial( { color: 0x000000, opacity: 0.1, transparent:false } );

function BorderRect({rect, thickness, depth, meshProps}: BorderRectProps) {
  const { size: { width, height } } = useThree();
  const thicknessWidth = useMemo(() => thickness/width , [thickness, width]);
  const thicknessHeight = useMemo(() => thickness/height , [thickness, height]);
  const widthGeometry = useMemo(() => new THREE.BoxGeometry( widthRect(rect)/ width, thicknessHeight, depth ) , [rect, width, thicknessHeight, depth]);
  const heightGeometry = useMemo(() => new THREE.BoxGeometry( thicknessWidth, heightRect(rect) / height, depth ) , [rect, height, thicknessWidth, depth]);
  const [x, y] = useMemo(() => centerRect(rect), [rect]);

  return (
    <>
    <Border
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + x)/ width,
        -(rect.y1 + thicknessHeight)/height,
        depth/2
      ]
     }
      {...meshProps}
    />

    <Border
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + x)/ width ,
        -(rect.y2 + thicknessHeight)/height,
        depth/2
      ]
     }
      {...meshProps}
    />

    <Border
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x1 + thicknessWidth)/ width,
         -(rect.y1 + y)/height,
         depth/2
        
      ]
     }
      {...meshProps}
    />

    <Border
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x2 + thicknessWidth)/ width ,
        -(rect.y1 + y)/height,
        depth/2
      ]
     }
      {...meshProps}
    />
    </>

  )
}

export default BorderRect;