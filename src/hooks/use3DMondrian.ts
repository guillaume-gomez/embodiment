import { useState } from 'react'; 
import { CustomRect } from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
}

function use3DMondrian() {
  const { generate: generateMondrian } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const mondrianRects = generateMondrian(canvasWidth, canvasHeight, nbIterations);
    const mondrian2Rects = generateMondrian(canvasWidth, canvasHeight, nbIterations);
    const mondrian3Rects = generateMondrian(canvasWidth, canvasHeight, nbIterations);

    const mondrians : Mondrian[] = [
      { rects: mondrianRects },
      { rects: mondrian2Rects },
      { rects: mondrian3Rects }
    ];
    setMondrians(mondrians);
  }


  return { generate, mondrians };

}

export default use3DMondrian;