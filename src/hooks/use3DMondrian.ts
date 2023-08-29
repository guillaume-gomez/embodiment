import { useState } from 'react'; 
import { CustomRect } from "../utils";
import useMondrian from "./useMondrian";
import { sample } from "lodash";

interface Mondrian {
  rects: CustomRect[];
  title: "bottom" | "right" | "left";
}


function use3DMondrian() {
  const {  generateMondrian, generate, splitRectsControlled } = useMondrian();
  const [ mondrianXY, setMondrianXY] = useState<Mondrian>({title: "bottom", rects: []});
  const [ mondrianYZ, setMondrianYZ] = useState<Mondrian>({title: "right", rects: []});
  const [ mondrianZX, setMondrianZX] = useState<Mondrian>({title: "left", rects: []});

  function ruleA(xPad: number, yPad: number, rects: CustomRect[]) {
    const candidate = sample(rects);
    const newRects = splitRectsControlled(candidate, xPad, yPad, "horizontal");
    setMondrianXY({...mondrianXY, rects: [...mondrianXY.rects, ...newRects] })
    setMondrianYZ({...mondrianYZ, rects: [...mondrianYZ.rects, ...newRects] })
  }

  function ruleB(xPad: number, yPad: number, rects: CustomRect[]) {
    const candidate = sample(rects);
    const newRects
     = splitRectsControlled(candidate, xPad, yPad, "horizontal");
    setMondrianYZ({...mondrianXY, rects: [...mondrianYZ.rects, ...newRects] })
  }

  function ruleC(xPad: number, yPad: number, rects: CustomRect[]) {
    const candidate = sample(rects);
    const newRects = splitRectsControlled(candidate, xPad, yPad, "horizontal");
    setMondrianZX({...mondrianXY, rects: [...mondrianZX.rects, ...newRects] })
  }

  function ruleD() {

  }


  function ruleE() {

  }

  function ruleF() {

  }

  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    //const mondrianXYRects = generate(canvasWidth, canvasHeight, nbIterations);
    //setMondrianXY({ ...mondrianXY, rects: mondrianXYRects });

    /*const mondrianLeftRects = findIntersectionInXLeft(0, mondrianRects);
    let rects : CustomRect[] = [];
    let stackRects : CustomRect[] = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, ...mondrianLeftRects];
    let depth = 2;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }
    const mondrianLefts =  [...stackRects,...rects];*/

    const initRect = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}]

    ruleA(xPad, yPad, initRect);
    ruleB(xPad, yPad, initRect);
    ruleC(xPad, yPad, initRect);
  }


  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX };

}

export default use3DMondrian;