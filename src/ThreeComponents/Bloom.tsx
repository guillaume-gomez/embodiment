import * as THREE from 'three';
import { useMemo } from 'react';
import { Effects as EffectsComposer } from '@react-three/drei';
import { extend, useThree } from '@react-three/fiber';
import { UnrealBloomPass } from 'three-stdlib';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: any // ???
    }
  }
}

extend({ UnrealBloomPass });


function Bloom() {
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
      <renderPass scene={scene} camera={camera} />
      <unrealBloomPass args={[aspect, 0.4, 1, 0]} />
    </EffectsComposer>
  );
}

export default Bloom;