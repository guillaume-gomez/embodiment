import { useState } from 'react'; 
import { CustomRect, findIntersectionInXRight, differenceOnX, differenceOnY, findIntersectionInYBottom } from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
  title: "bottom" | "right" | "top";
}

function use3DMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    const mondrianRects = generate(canvasWidth, canvasHeight, nbIterations);
    const mondrianRights = generateMondrianRight(mondrianRects, canvasWidth, canvasHeight, xPad, yPad, nbIterations);
    const mondrianTop = generateMondrianTop(mondrianRects, canvasWidth, canvasHeight, xPad, yPad, nbIterations);



    const mondrians : Mondrian[] = [
      { rects: mondrianRects, title: "bottom" },
      { rects: mondrianRights, title: "right" },
      { rects: mondrianTop, title: "top" }
    ];
    setMondrians(mondrians);
  }

  function generateMondrianRight(
    mondrianRects: CustomRect[],
    canvasWidth: number,
    canvasHeight: number,
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    const mondrianLeftRects = moveToLeft(findIntersectionInXRight(canvasWidth, mondrianRects));

    let stackRects : CustomRect[] = mondrianLeftRects.map(mondrianLeftRect =>
      differenceOnX({x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, mondrianLeftRect)
    );
    let depth = 2;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }

    return [...mondrianLeftRects, ...stackRects];
  }

  function generateMondrianTop(
    mondrianRects: CustomRect[],
    canvasWidth: number,
    canvasHeight: number,
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    const mondrianTopRects = moveToTop(findIntersectionInYBottom(canvasHeight, mondrianRects));

    let stackRects : CustomRect[] = mondrianTopRects.map(mondrianTopRect =>
      differenceOnY({x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, mondrianTopRect)
    );
    let depth = 2;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }

    return [...mondrianTopRects, ...stackRects];
  }

  function moveToLeft(rightRects: CustomRect[]): CustomRect[] {
    return rightRects.map(rightRect =>
      ({ x1: 0, x2: (rightRect.x2 - rightRect.x1), y1: rightRect.y1, y2: rightRect.y2, color: rightRect.color })
    )
  }

  function moveToTop(bottomRects: CustomRect[]): CustomRect[] {
    return bottomRects.map(bottomRect =>
      ({ x1: bottomRect.x1, x2: bottomRect.x2, y1: 0, y2: (bottomRect.y2 - bottomRect.y1), color: bottomRect.color })
    )
  }


  return { generate: generate3D, mondrians };

}

export default use3DMondrian;