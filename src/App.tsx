import { useState, useMemo } from "react";
import MondrianThreeJs from "./MondrianThreeJs";
import use3DMondrian from "./hooks/use3DMondrian";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Range from "./components/Range";
import CutInActionForm from "./components/CutInActionForm";
import Select from "./components/Select";

const githubRepositoryUrl = "https://github.com/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const { generate, customRects3D, customRects3DStack, width, height, random, setRandom } = use3DMondrian();
  const [numberOfIteration, setNumberOfIteration] = useState<number>(10);
  const [thickness, setThickness] = useState<number>(25);
  const [customRects3DStackIndex, setCustomRects3DStackIndex] = useState<number>(-1);
  const selectedCustomRects3D = useMemo(() => {
      if(customRects3DStackIndex < 0) {
        return customRects3D;
      } else {
        return customRects3DStack[customRects3DStackIndex].customRects3D;
      }
    },
    [customRects3D, customRects3DStack, customRects3DStackIndex]
  );

  return (
    <div className="flex flex-col gap-2 items-center h-screen">
        <Navbar
          projectTitle={projectName}
          githubRepositoryUrl={githubRepositoryUrl}
        />
      <div className="flex flex-col gap-3">
        <CutInActionForm onChange={() => {}} maxCoord={500} />
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Options</h2>
            <div className="flex flex-col gap-3">
              <Range
                label="Random"
                float
                min={0}
                max={1}
                value={random}
                step={0.01}
                onChange={(value) => setRandom(value)}
              />
              <Range
                label="Thickness"
                min={0}
                max={100}
                value={thickness}
                step={1}
                onChange={(value) => setThickness(value)}
              />
              <Select
                label="History"
                value={selectedCustomRects3D}
                onChange={(value) => setCustomRects3DStackIndex(value)}
                options={
                  customRects3DStack.map(
                    customRect3DItem => ({label: `Action ${customRect3DItem.position} - ${customRect3DItem.action}`, value: customRect3DItem.position })
                  )
                }
              />
            </div>
          </div>
        </div>
        <Range
          label="Number of Iterations"
          value={numberOfIteration}
          min={1}
          max={20}
          step={1}
          onChange={(value) => setNumberOfIteration(value)}
        />
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Render</h2>
            <div className="flex flex-row">
              <MondrianThreeJs
                width={width}
                height={height}
                thickness={thickness}
                customRects3D={selectedCustomRects3D}
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