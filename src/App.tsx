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
    <div className="flex flex-col gap-2 items-center h-screen">
      <Navbar
        projectTitle={import.meta.env.VITE_PROJECT_NAME}
        githubRepositoryUrl={import.meta.env.VITE_GITHUB_REPOSITORY_URL}
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
      <Footer />
    </div>
  )
}

export default App;
