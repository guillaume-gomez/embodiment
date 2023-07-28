import { useRef, useState } from "react";
import use3DMondrian from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { customRectString } from "./utils";
import { useFullscreen } from "rooks";

function App() {
  const { generate, mondrians } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(250);
  const [height] = useState<number>(250);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
      {
        mondrians.map(mondrian =>
          (
            <div className="card bg-primary text-primary-content">
               <div className="card-body">
                <h2 className="card-title">Result</h2>
                <div className="mockup-code">
                  {
                    mondrian.rects.map(rects =>
                      (<pre>
                        <code>{customRectString(rects)}</code>
                      </pre>)
                    )
                  }
                </div>
                <div>
                   <MondrianCanvas
                      ref={canvasActionsRef}
                      width={width}
                      height={height}
                      thickness={2}
                      rects={mondrian.rects}
                      toggleFullScreen={toggleFullscreen}
                    />
                </div>
              </div>
            </div>
          )
        )
      }
    </div>
  )
}

export default App;
