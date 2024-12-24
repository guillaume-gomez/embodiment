import { useState, useMemo, useEffect } from "react";
import ThreeJsRenderer from "./ThreeJsRenderer";
import use3DMondrian from "./hooks/use3DMondrian";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Range from "./components/Range";
import CutInActionForm from "./components/CutInActionForm";
import Select from "./components/Select";
import Toggle from "./components/Toggle";
import CollapseCard from "./components/CollapseCard";
import CardBase from "./components/CardBase";
import heightIcon from "/iconmonstr-cursor-15.svg";
import widthIcon from "/iconmonstr-cursor-16.svg";
import depthIcon from "/iconmonstr-cursor-17.svg";
import randomIcon from "/iconmonstr-control-panel-6.svg";
import historyIcon from "/iconmonstr-layer-11.svg";
import iterationIcon from "/iconmonstr-layer-19.svg";
import thicknessIcon from "/iconmonstr-ruler-24.svg";
import wireframeIcon from "/iconmonstr-cube-6.svg";

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
  const [wireframe, setWireframe] = useState<boolean>(false);
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

  useEffect(() => {
    generate(numberOfIteration);
  }, [width, height, depth, thickness, numberOfIteration]);

  function computeSnapForSizes(axis: string, currentValue: number) : number {
    if(width === height && height === depth) {
      return width;
    }

    if(width === height)
    {
      return width;
    }

    if(height === depth) {
      return height;
    }

    if(width === height) {
      return width;
    }

    switch(axis) {
    case "width":
      return Math.abs(currentValue - height) < Math.abs(currentValue - depth) ? height: depth;
    case "height":
      return Math.abs(currentValue - width) < Math.abs(currentValue - depth) ? width: depth;
    case "depth":
      return Math.abs(currentValue - height) < Math.abs(currentValue - width) ? height: width;
    default:
      return 0;
    }
    return 0;
  }

  return (
    <div className="bg-gradient-to-tl from-fuchsia-900 to-blue-900">
      <div className="m-auto container flex flex-col gap-2 h-screen items-center">
        <Navbar
          projectTitle={projectName}
          githubRepositoryUrl={githubRepositoryUrl}
        />
        <div className="container p-2 flex md:flex-row flex-col gap-3 flex-grow">
          <div className="lg:w-3/12 md:w-4/12">
            <CardBase title="Options">
              <div className="flex flex-col gap-3">
              <Range
                  label="Random"
                  float
                  min={0.1}
                  max={1}
                  value={random}
                  svgIcon={randomIcon}
                  step={0.1}
                  snap={0.7}
                  onChange={(value) => setRandom(value)}
                />
              <CollapseCard>
                {
                  chooseRandomMove ?
                    <Range
                      label="Number of Cuts"
                      value={numberOfIteration}
                      svgIcon={iterationIcon}
                      min={1}
                      max={20}
                      step={1}
                      snap={10}
                      onChange={(value) => setNumberOfIteration(value)}
                    />
                    :
                    <CutInActionForm onChange={() => {}} maxCoord={500} />
                }
                <Toggle
                  label="Wireframe"
                  svgIcon={wireframeIcon}
                  value={wireframe}
                  toggle={() => setWireframe(!wireframe)}
                />
                <Range
                  label="Thickness"
                  min={0}
                  max={100}
                  value={thickness}
                  svgIcon={thicknessIcon}
                  snap={25}
                  step={1}
                  onChange={(value) => setThickness(value)}
                />
                <Range
                  label="Width"
                  min={100}
                  max={2000}
                  value={width}
                  svgIcon={widthIcon}
                  snap={computeSnapForSizes('width', width)}
                  step={10}
                  onChange={(value) => setWidth(value)}
                />
                <Range
                  label="Height"
                  min={100}
                  max={2000}
                  value={height}
                  svgIcon={heightIcon}
                  snap={computeSnapForSizes('height', height)}
                  step={10}
                  onChange={(value) => setHeight(value)}
                />
                <Range
                  label="Depth"
                  min={100}
                  max={2000}
                  value={depth}
                  svgIcon={depthIcon}
                  snap={computeSnapForSizes('depth', depth)}
                  step={10}
                  onChange={(value) => setDepth(value)}
                />
                <Select
                  label="History"
                  svgIcon={historyIcon}
                  value={customRects3DStackIndex}
                  onChange={(value) => setCustomRects3DStackIndex(value)}
                  options={
                    customRects3DStack.map(
                      customRect3DItem => ({label: `Action ${customRect3DItem.position} - ${customRect3DItem.action}`, value: customRect3DItem.position })
                    )
                  }
                />
              </CollapseCard>
              <button className="hidden md:block btn btn-secondary" onClick={() => generate(numberOfIteration)}>Generate</button>
              </div>
            </CardBase>
          </div>
          <div className="lg:w-9/12 md:w-8/12 h-full">
            <CardBase title="Render">
                <ThreeJsRenderer
                  shapeSizes={[width, height, depth]}
                  thickness={thickness}
                  wireframe={wireframe}
                  customRects3D={selectedCustomRects3D}
                  handleGenerate={() => generate(numberOfIteration)}
                />
                <button className="btn btn-secondary md:hidden" onClick={() => generate(numberOfIteration)}>Generate</button>
            </CardBase>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App;