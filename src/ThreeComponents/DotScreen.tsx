import * as THREE from 'three';
import { useMemo } from 'react';
import { Effects as EffectsComposer } from '@react-three/drei';
import { extend, useThree } from '@react-three/fiber';
import { BlendFunction } from "postprocessing";
import { EffectComposer, DotScreen } from "@react-three/postprocessing";

function DotScreenEffect() {
  const { size, scene, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);

  return (
    <EffectsComposer
      multisamping={8}
      renderIndex={1}
      disableGamma
      disableRenderPass
    >
      <DotScreen
            angle={Math.PI * 0.5} // angle of the dot pattern
            scale={1.0} // scale of the dot pattern
          />
    </EffectsComposer>
  );
}

export default DotScreenEffect;