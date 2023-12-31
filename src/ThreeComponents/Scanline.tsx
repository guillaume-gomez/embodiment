import { EffectComposer, Scanline } from "@react-three/postprocessing";

function ScanlineEffect() {
  return (
    <EffectComposer>
      <Scanline  density={1.25} scrollSpeed={0.00}/>
    </EffectComposer>
  );
}

export default ScanlineEffect;