import { useState, useMemo } from "react";
import ThreeJsRenderer from "./ThreeJsRenderer";
import use3DMondrian from "./hooks/use3DMondrian";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Range from "./components/Range";
import CutInActionForm from "./components/CutInActionForm";
import Select from "./components/Select";
import CollapseCard from "./components/CollapseCard";
import CardBase from "./components/CardBase";

const githubRepositoryUrl = "https://github.com/guillaume-gomez/embodiment";
const projectName ="Embodiment";

function App() {
  const {
    generate,
    customRects3D,
    customRects3DStack,
    width,
    height,
    depth,
    random,
    setWidth,
    setHeight,
    setDepth,
    setRandom
  } = use3DMondrian();
  const [numberOfIteration, setNumberOfIteration] = useState<number>(10);
  const [chooseRandomMove, _setChooseRandomMove] = useState<boolean>(true);
  const [thickness, setThickness] = useState<number>(25);
  const [customRects3DStackIndex, setCustomRects3DStackIndex] = useState<number>(-1);
  const selectedCustomRects3D = useMemo(() => {
      if(customRects3DStackIndex < 0) {
        return customRects3D;
      } else if (customRects3DStackIndex > customRects3DStack.length) {
        return customRects3D;
      }
      else {
        return customRects3DStack[customRects3DStackIndex].customRects3D;
      }
    },
    [customRects3D, customRects3DStack, customRects3DStackIndex]
  );

  return (
    <div className="flex flex-col gap-2 h-screen items-center bg-gradient-to-tl from-fuchsia-900 to-indigo-900">
      <Navbar
        projectTitle={projectName}
        githubRepositoryUrl={githubRepositoryUrl}
      />
      <div className="flex md:flex-row flex-col gap-3 flex-grow">
        <div className="md:w-3/12">
          <CardBase title="Options">
            <div className="flex flex-col gap-3">
            <Range
                label="Random"
                float
                min={0.1}
                max={1}
                value={random}
                step={0.1}
                onChange={(value) => setRandom(value)}
              />
            <CollapseCard>
              {
                chooseRandomMove ?
                  <Range
                    label="Number of Iterations"
                    value={numberOfIteration}
                    min={1}
                    max={20}
                    step={1}
                    onChange={(value) => setNumberOfIteration(value)}
                  />
                  :
                  <CutInActionForm onChange={() => {}} maxCoord={500} />
              }
              <Select
                label="History"
                value={customRects3DStackIndex}
                onChange={(value) => setCustomRects3DStackIndex(value)}
                options={
                  customRects3DStack.map(
                    customRect3DItem => ({label: `Action ${customRect3DItem.position} - ${customRect3DItem.action}`, value: customRect3DItem.position })
                  )
                }
              />
              <Range
                label="Thickness"
                min={0}
                max={100}
                value={thickness}
                step={1}
                onChange={(value) => setThickness(value)}
              />
              <Range
                label="Width"
                min={100}
                max={1000}
                value={width}
                step={10}
                onChange={(value) => setWidth(value)}
              />
              <Range
                label="Height"
                min={100}
                max={1000}
                value={height}
                step={10}
                onChange={(value) => setHeight(value)}
              />
              <Range
                label="Depth"
                min={100}
                max={1000}
                value={depth}
                step={10}
                onChange={(value) => setDepth(value)}
              />
            </CollapseCard>
            <button className="btn btn-secondary" onClick={() => generate(numberOfIteration)}>Generate</button>
            </div>
          </CardBase>
        </div>
        <div className="md:w-9/12 h-full">
          <CardBase title="Render">
              <ThreeJsRenderer
                shapeSizes={[width, height, width]}
                thickness={thickness}
                customRects3D={selectedCustomRects3D}
                handleGenerate={() => generate(numberOfIteration)}
              />
              <button className="btn btn-secondary md:hidden" onClick={() => generate(numberOfIteration)}>Generate</button>
          </CardBase>
        </div>
      </div>
      <Footer githubRepositoryUrl={githubRepositoryUrl} />
    </div>
  )
}

export default App;