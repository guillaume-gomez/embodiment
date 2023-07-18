import { useState } from 'react'; 
import { CustomRect, findIntersectionInXLeft, findIntersectionInXRight } from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
}

function use3DMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;
    let accRects : CustomRect[] = [];



    const mondrianRects = generate(canvasWidth, canvasHeight, nbIterations);
    console.log(findIntersectionInXLeft(0, mondrianRects));
    console.log(findIntersectionInXRight(canvasWidth, mondrianRects));
    const mondrianLeftRects = generate(canvasWidth, canvasHeight, nbIterations);
    const mondrianTopRects = generate(canvasWidth, canvasHeight, nbIterations);

    const mondrians : Mondrian[] = [
      { rects: mondrianRects },
      { rects: mondrianLeftRects },
      { rects: mondrianTopRects }
    ];
    setMondrians(mondrians);
  }


  return { generate: generate3D, mondrians };

}

export default use3DMondrian;