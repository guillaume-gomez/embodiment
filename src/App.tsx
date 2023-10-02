import { useRef, useState } from "react";
import use3DMondrian, { HistoryType } from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const githubRepositoryUrl = "www.github.io/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const { generate, mondrians, historyByTitle } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
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
      <div className="grow flex flex-col gap-3">
        <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
        <div className="flex flex-col gap-2">
          {
            mondrians.map((mondrian) =>
              <div>
                <p className="text-xl">{mondrian.title}</p>
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
      <div>
        <p className="text-xl">History</p>
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

      <Footer githubRepositoryUrl={githubRepositoryUrl} />
    </div>
  )
}

export default App;
