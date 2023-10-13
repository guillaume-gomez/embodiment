import { useRef, useState } from "react";
import MondrianThreeJs from "./MondrianThreeJs";
import use3DMondrian, { HistoryType } from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const githubRepositoryUrl = "www.github.io/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const { generate, mondrianXY, mondrianYZ, mondrianZX, historyByTitle } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [rendering3D, setRendering3D] = useState<boolean>(true);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
  const thickness = 25;
  const [historyTitle, setHistoryTitle] = useState<HistoryType>("bottom");

  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  return (
    <div className="flex flex-col gap-2 items-center h-screen">
        <Navbar
          projectTitle={projectName}
          githubRepositoryUrl={githubRepositoryUrl}
        />
      <div className="flex flex-col gap-3">
        {
            rendering3D ?
              <div className="flex flex-row">
                <MondrianThreeJs
                  width={width}
                  height={height}
                  thickness={thickness}
                  rectsXY={mondrianXY.rects}
                  rectsYZ={mondrianYZ.rects}
                  rectsZX={mondrianZX.rects}
                  toggleFullScreen={() => {}}
                />
                <button className="btn btn-accent" onClick={() => generate(width, height)}>Generate</button>
              </div>
            :
              <div>
                <button className="btn btn-accent" onClick={() => generate(width, height)}>Generate</button>
                <div className="flex flex-row gap-2">
                    <div>
                      <p className="text-xl">YZ</p>
                      <MondrianCanvas
                        ref={canvasActionsRef}
                        width={width}
                        height={height}
                        thickness={Math.floor(thickness/10)}
                        rects={mondrianYZ.rects}
                        toggleFullScreen={toggleFullscreen}
                      />
                    </div>
                    <div>
                      <p className="text-xl">XY</p>
                      <MondrianCanvas
                        ref={canvasActionsRef}
                        width={width}
                        height={height}
                        thickness={Math.floor(thickness/10)}
                        rects={mondrianXY.rects}
                        toggleFullScreen={toggleFullscreen}
                      />
                    </div>
                    <div>
                      <p className="text-xl">ZX</p>
                      <MondrianCanvas
                        ref={canvasActionsRef}
                        width={width}
                        height={height}
                        thickness={Math.floor(thickness/10)}
                        rects={mondrianZX.rects}
                        toggleFullScreen={toggleFullscreen}
                      />
                    </div>
                </div>
              </div>
        }
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">History</h2>
            <select
              className="select select-primary w-full max-w-xs"
              onChange={(e) => setHistoryTitle(e.target.value as HistoryType)}
            >
              <option value="all">all</option>
              {
                ["bottom", "right", "top" ].map(title =>
                  <option value={title}>{title}</option>
                )
              }
            </select>
            {
              historyByTitle(historyTitle).map(mondrian =>
                <MondrianCanvas
                    ref={canvasActionsRef}
                    width={width}
                    height={height}
                    thickness={2}
                    rects={mondrian.rects}
                    toggleFullScreen={toggleFullscreen}
                  />
              )
            }
          </div>
        </div>
      </div>
      <Footer githubRepositoryUrl={githubRepositoryUrl} />
    </div>
  )
}

export default App;