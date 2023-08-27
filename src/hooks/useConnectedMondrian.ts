import { useState } from 'react'; 
import {
  CustomRect,
  findIntersectionInXRight,
  findIntersectionInXLeft,
  differenceOnX,
  differenceOnY,
  findIntersectionInYBottom,
  findIntersectionInYTop
} from "../utils";
import useMondrian from "./useMondrian";

interface Mondrian {
  rects: CustomRect[];
  title: "top"| "left" | "bottom" | "right" | "center";
}

function useConnectedMondrian() {
  const {  generateMondrian, generate } = useMondrian();
  const [ mondrians, setMondrians] = useState<Mondrian[]>([]);


  function generate3D(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;

    const mondrianCenter = generate(canvasWidth, canvasHeight, nbIterations);
    const mondrianLeft = generateMondrianLeft(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);
    const mondrianRight = generateMondrianRight(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);
    const mondrianBottom = generateMondrianBottom(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);
    const mondrianTop = generateMondrianTop(mondrianCenter, canvasWidth, canvasHeight, xPad, yPad, nbIterations);


    const mondrians : Mondrian[] = [
      { rects: mondrianTop, title: "top" },
      { rects: mondrianLeft, title: "left" },
      { rects: mondrianCenter, title: "center" },
      { rects: mondrianRight, title: "right" },
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

  function generateMondrianLeft(
    mondrianRects: CustomRect[],
    canvasWidth: number,
    canvasHeight: number,
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    const mondrianRightRects = moveToRight(findIntersectionInXLeft(0, mondrianRects), canvasWidth);

    let stackRects : CustomRect[] = mondrianRightRects.map(mondrianRightRect =>
      differenceOnX({x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, mondrianRightRect)
    );
    stackRects = generateMondrianSubDivision(stackRects, xPad, yPad, nbIterations);
    return [...mondrianRightRects, ...stackRects];
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

  function generateMondrianTop(
    mondrianRects: CustomRect[],
    canvasWidth: number,
    canvasHeight: number,
    xPad: number,
    yPad: number,
    nbIterations: number
  ) {
    const mondrianTopRects = moveToBottom(findIntersectionInYTop(0, mondrianRects), canvasHeight);

    let stackRects : CustomRect[] = mondrianTopRects.map(mondrianTopRect =>
      differenceOnY({x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}, mondrianTopRect)
    );
    stackRects = generateMondrianSubDivision(stackRects, xPad, yPad, nbIterations);

    return [...mondrianTopRects, ...stackRects];
  }

  function moveToLeft(rightRects: CustomRect[]): CustomRect[] {
    return rightRects.map(rightRect =>
      ({ x1: 0, x2: (rightRect.x2 - rightRect.x1), y1: rightRect.y1, y2: rightRect.y2, color: rightRect.color })
    )
  }

  function moveToRight(leftRects: CustomRect[], xMax: number): CustomRect[] {
    return leftRects.map(leftRect =>
      ({ x1: (xMax - (leftRect.x2 - leftRect.x1)), x2: xMax, y1: leftRect.y1, y2: leftRect.y2, color: leftRect.color })
    )
  }

  function moveToTop(bottomRects: CustomRect[]): CustomRect[] {
    return bottomRects.map(bottomRect =>
      ({ x1: bottomRect.x1, x2: bottomRect.x2, y1: 0, y2: (bottomRect.y2 - bottomRect.y1), color: bottomRect.color })
    )
  }

  function moveToBottom(topRects: CustomRect[], yMax: number): CustomRect[] {
    return topRects.map(topRect =>
      ({ x1: topRect.x1, x2: topRect.x2, y1: (yMax - (topRect.y2 - topRect.y1)), y2: yMax, color: topRect.color })
    )
  }


  return { generate: generate3D, mondrians };

}

export default useConnectedMondrian;