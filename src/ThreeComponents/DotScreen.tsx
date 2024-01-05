import { BlendFunction } from "postprocessing";
import { EffectComposer, DotScreen, } from "@react-three/postprocessing";

function DotScreenEffect() {
  return (
    <EffectComposer>
      <DotScreen
        blendFunction={BlendFunction.NORMAL}
        angle={Math.PI * 0.5}
        scale={1}
      />
    </EffectComposer>
  );
}

export default DotScreenEffect;