import { useState } from 'react'; 
import { CustomRect, findIntersectionInXLeft, findIntersectionInYTop } from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
  title: "bottom" | "left" | "top";
}

function use3DMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    const mondrianRects = generate(canvasWidth, canvasHeight, nbIterations);

    let mondrianLeftRects = findIntersectionInXLeft(0, mondrianRects);
    /*generateMondrian(
      {x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"},
      xPad,
      yPad,
      mondrianLeftRects,
      0
    );

    let mondrianTopRects = findIntersectionInYTop(0, mondrianRects);
    generateMondrian(
      {x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"},
      xPad,
      yPad,
       mondrianTopRects,
      0
    );*/

    const mondrians : Mondrian[] = [
      { rects: mondrianRects, title: "bottom" },
      { rects: mondrianRects, title: "left" },
      { rects: mondrianRects, title: "top" }
    ];
    setMondrians(mondrians);
  }


  return { generate: generate3D, mondrians };

}

export default use3DMondrian;