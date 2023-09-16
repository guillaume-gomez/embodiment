import { useRef, useState } from "react";
import use3DMondrian from "./hooks/use3DMondrian";
import MondrianThreeJs from "./MondrianThreeJs";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  const { generate, mondrianXY, mondrianYZ, mondrianZX } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  //console.log(mondrianXY.rects)

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
      <div className="flex flex-row gap-2">
          <MondrianCanvas
            ref={canvasActionsRef}
            width={width}
            height={height}
            thickness={2}
            rects={mondrianYZ.rects}
            toggleFullScreen={toggleFullscreen}
          />
          <MondrianCanvas
            ref={canvasActionsRef}
            width={width}
            height={height}
            thickness={2}
            rects={mondrianXY.rects}
            toggleFullScreen={toggleFullscreen}
          />
          <MondrianCanvas
            ref={canvasActionsRef}
            width={width}
            height={height}
            thickness={2}
            rects={mondrianZX.rects}
            toggleFullScreen={toggleFullscreen}
          />
      </div>
      <MondrianThreeJs
        width={width}
        height={height}
        thickness={5}
        rectsXY={mondrianXY.rects}
        rectsYZ={mondrianYZ.rects}
        rectsZX={mondrianZX.rects}
        toggleFullScreen={() => {}}
      />
      <Footer />
    </div>
  )
}

export default App;