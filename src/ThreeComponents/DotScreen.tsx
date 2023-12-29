import * as THREE from 'three';
import { useMemo } from 'react';
import { BlendFunction } from "postprocessing";
import { EffectComposer, DotScreen } from "@react-three/postprocessing";

function DotScreenEffect() {
  return (
    <EffectComposer>
      <DotScreen
        blendFunction={BlendFunction.NORMAL}
        angle={Math.PI * 0.25}
        scale={1}
      />
    </EffectComposer>
  );
}

export default DotScreenEffect;