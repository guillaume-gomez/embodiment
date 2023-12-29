import { useState } from "react";
import MondrianThreeJs from "./MondrianThreeJs";
import use3DMondrian from "./hooks/use3DMondrian";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const githubRepositoryUrl = "https://github.com/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const { generate, customRects3D, width, height } = use3DMondrian();
  const [random, setRandom] = useState<number>(0.8);
  const [numberOfIteration, setNumberOfIteration] = useState<number>(10);
  const thickness = 25;

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
            onChange={(event) => setRandom(parseFloat(event.target.value))} />
        </div>
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Render</h2>
            <div className="flex flex-row">
              <MondrianThreeJs
                width={width}
                height={height}
                thickness={thickness}
                customRects3D={customRects3D}
              />
              <button className="btn btn-accent" onClick={() => generate(numberOfIteration)}>Generate</button>
            </div>
          </div>
        </div>
      </div>
      <Footer githubRepositoryUrl={githubRepositoryUrl} />
    </div>
  )
}

export default App;