import { useState } from 'react'; 
import { CustomRect, findIntersectionInXLeft } from "../utils";
import useMondrian from "./useMondrian";

type TitleType = "bottom" | "right" | "top";

interface Mondrian {
  rects: CustomRect[];
  title: TitleType;
}

function use3DMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);
  const [history, setHistory] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    const mondrianRects = generate(canvasWidth, canvasHeight, nbIterations);

    const mondrianLeftRects = findIntersectionInXLeft(0, mondrianRects);
    let rects : CustomRect[] = [];
    let stackRects : CustomRect[] = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, ...mondrianLeftRects];
    let depth = 2;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }
    const mondrianLefts =  [...stackRects,...rects];


    const mondrians : Mondrian[] = [
      { rects: mondrianRects, title: "bottom" },
      { rects: mondrianLefts, title: "right" },
      /*{ rects: mondrianRects, title: "top" }*/
    ];
    setHistory(mondrians);
    setMondrians(mondrians);
  }

  function historyByTitle(selectedTitle: TitleType) : Mondrian[] {
    return history.filter(({title}) => selectedTitle === title);
  }


  return { generate: generate3D, mondrians, historyByTitle };

}

export default use3DMondrian;