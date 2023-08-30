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

  function ruleABC(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") {
    const candidate = sample(rects);
    const newRects = splitRectsControlled(candidate, xPad, yPad, direction);

    if(newRects.length === 0) {
      return rects;
    }

    const rectsWithoutCandidate = rects.filter(rect =>
      rect.x1 !== candidate.x1 ||
      rect.x2 !== candidate.x2 ||
      rect.y1 !== candidate.y1 ||
      rect.y2 !== candidate.y2
    );

    return [...rectsWithoutCandidate, ...newRects];
  }

  function ruleA(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleABC(xPad, yPad, rects, "horizontal");
  }

  function ruleB(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleABC(xPad, yPad, rects, "vertical");
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

    let rectsA = ruleA(xPad, yPad, initRect);
    setMondrianXY({...mondrianXY, rects: [...rectsA] });
    setMondrianZX({...mondrianZX, rects: [...rectsA] });

    let rectsB = ruleB(xPad, yPad, initRect);
    setMondrianYZ({...mondrianYZ, rects: [...rectsB]});



    //ruleB(xPad, yPad, initRect);
    //ruleC(xPad, yPad, initRect);
  }


  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX };

}

export default use3DMondrian;