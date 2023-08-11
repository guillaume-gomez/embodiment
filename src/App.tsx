import { useRef, useState } from "react";
import use3DMondrian from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { customRectString, findIntersectionInXLeft, findIntersectionInYTop } from "./utils";
import { useFullscreen } from "rooks";

function App() {
  const { generate, mondrians } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(350);
  const [height] = useState<number>(350);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 5)}>Generate</button>
      {
        mondrians.map((mondrian, index) =>
          (
            <div className="card bg-primary text-primary-content">
               <div className="card-body">
                <h2 className="card-title">{mondrian.title}</h2>
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
                <div className="mockup-code">
                  {
                    mondrian.rects.map(rect =>
                      (
                        <pre>
                          <code>{customRectString(rect)}</code>
                        </pre>
                      )
                    )
                  }
                </div>
                {
                  index > 0 &&
                  <>
                    {
                      mondrian.title === "left" && <div className="mockup-code">
                        {
                          findIntersectionInXLeft(0, mondrians[0].rects).map(rect =>
                            (
                              <pre>
                                <code>{customRectString(rect)}</code>
                              </pre>
                            )
                          )
                        }
                      </div>
                    }
                    {
                      mondrian.title === "top" && <div className="mockup-code">
                      {
                        findIntersectionInYTop(0, mondrians[0].rects).map(rect =>
                          (
                            <pre>
                              <code>{customRectString(rect)}</code>
                            </pre>
                          )
                        )
                      }
                      </div>
                    }
                  </>
                }
              </div>
            </div>
          )
        )
      }
    </div>
  )
}

export default App;
