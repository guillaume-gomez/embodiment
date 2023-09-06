import { useRef, useState } from "react";
import use3DMondrian from "./hooks/use3DMondrian";
import MondrianCanvas, { ExternalActionInterface } from "./MondrianCanvas";
import { useFullscreen } from "rooks";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  const { generate, mondrians } = use3DMondrian();
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const fullscreenContainerRef = useRef<Element>(null);
  const [width] = useState<number>(500);
  const [height] = useState<number>(500);
  const {
    toggleFullscreen,
  } = useFullscreen({ target: fullscreenContainerRef });

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(width,height, 4)}>Generate</button>
      <div className="flex flex-col gap-2">
        {
          mondrians.map((mondrian) =>
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
      <Footer />
    </div>
  )
}

export default App;
