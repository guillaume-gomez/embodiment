import { useRef, useState } from "react";
import use3DMondrian from "./hooks/use3DMondrian";
import MondrianThreeJs from "./MondrianThreeJs";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const PROJECT_NAME : string = "Embodiment";
const GITHUB_REPOSITORY_URL : string = "http://github.io/guillaume-gomez/embodiment";

function App() {
  const { generate, mondrianXY, mondrianYZ, mondrianZX } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
  const thickness = 25;
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  //console.log(mondrianXY.rects)

  return (
    <div className="flex flex-col gap-2 items-center h-screen">
      <Navbar
        projectTitle={PROJECT_NAME}
        githubRepositoryUrl={GITHUB_REPOSITORY_URL}
      />
    <div className="grow flex flex-col gap-3">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
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
      <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
      </div>
    </div>
      <Footer />
    </div>
  )
}

export default App;