import { useRef, useState } from "react";
import useConnectedMondrian from "./hooks/useConnectedMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";

function App() {
  const { generate, mondrians } = useConnectedMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  function computeClassName(index: number) {
    if(index === 0 || index === 4) {
      return "col-start-2 col-span-3";
    }

    return "";

  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 6)}>Generate</button>
      <div className="grid grid-cols-3 gap-2">
        {
          mondrians.map((mondrian, index) =>
            <div className={computeClassName(index)}>
              <MondrianCanvas
                ref={canvasActionsRef}
                width={width}
                height={height}
                thickness={2}
                rects={mondrian.rects}
                toggleFullScreen={toggleFullscreen}
              />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default App;
