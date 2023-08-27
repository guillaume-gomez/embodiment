import { useState } from 'react'; 
import { CustomRect, findIntersectionInXRight, differenceOnX, differenceOnY, findIntersectionInYBottom } from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
  title: "bottom" | "right" | "center";
}

function use3DMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    const mondrianCenter = generate(canvasWidth, canvasHeight, nbIterations);
    const mondrianRights = generateMondrianRight(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);
    const mondrianBottom = generateMondrianBottom(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);

    const mondrians : Mondrian[] = [
      { rects: mondrianCenter, title: "center" },
      { rects: mondrianRights, title: "right" },
      { rects: mondrianBottom, title: "bottom" }
    ];
    setMondrians(mondrians);
  }

  function generateMondrianSubDivision(
    stackRects: CustomRect[],
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    let depth = 2;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }

    return stackRects;
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
    stackRects = generateMondrianSubDivision(stackRects, xPad, yPad, nbIterations);
    return [...mondrianLeftRects, ...stackRects];
  }



  function generateMondrianBottom(
    mondrianRects: CustomRect[],
    canvasWidth: number,
    canvasHeight: number,
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    const mondrianBottomRects = moveToTop(findIntersectionInYBottom(canvasHeight, mondrianRects));

    let stackRects : CustomRect[] = mondrianBottomRects.map(mondrianBottomRect =>
      differenceOnY({x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, mondrianBottomRect)
    );
    stackRects = generateMondrianSubDivision(stackRects, xPad, yPad, nbIterations);

    return [...mondrianBottomRects, ...stackRects];
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