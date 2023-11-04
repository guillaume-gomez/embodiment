import { useRef, useState } from "react";
import MondrianThreeJs from "./MondrianThreeJs";
import use3DMondrian, { HistoryType } from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const githubRepositoryUrl = "https://github.com/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const { generate, mondrianXY, mondrianYZ, mondrianZX, customRects3DData, historyByTitle } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [rendering3D, setRendering3D] = useState<boolean>(false);
  const [random, setRandom] = useState<number>(0.8);
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
        <div className="form-control">
          <span className="label-text">Random</span>
          <input
            type="range"
            min={0}
            max={1}
            value={random}
            step={0.01}
            className="range"
            onChange={(event) => setRandom(event.target.value)} />
        </div>
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
              <h2 className="card-title">Render</h2>
              <div className="flex flex-row">
                <MondrianThreeJs
                  width={width}
                  height={height}
                  thickness={thickness}
                  rectsXY={mondrianXY.rects}
                  rectsYZ={mondrianYZ.rects}
                  rectsZX={mondrianZX.rects}
                  customRects3DData={customRects3DData}
                  toggleFullScreen={toggleFullscreen}
                />
                <button className="btn btn-accent" onClick={() => generate(width, height)}>Generate</button>
              </div>

              <div>
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
                <button className="btn btn-accent" onClick={() => generate(width, height)}>Generate</button>
              </div>
            </div>
          </div>

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
                    thickness={Math.floor(thickness/10)}
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