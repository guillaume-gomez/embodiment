import { useState } from 'react'; 
import { CustomRect, heightRect, widthRect, randInt } from "../utils";

export const BlackColor = "#2b2b2b";
export const RedColor = "#e90018";
export const BlueColor = "#0e63b7";
export const YellowColor = "#f9da00";
export const WhiteColor = "white";

export type possibleColorsType = "#2b2b2b"|"#e90018"|"#0e63b7"|"#f9da00"|"white";

const possibleColors = [
    BlackColor,
    RedColor,
    BlueColor,
    YellowColor
]

const defaultColors = [
    WhiteColor,
    WhiteColor,
    WhiteColor,
    WhiteColor,
    ...possibleColors
];


function useMondrian() {
  const [rects, setRects] = useState<CustomRect[]>([]);
  const [colors, setColors] = useState<string[]>(defaultColors);

  function generateMondrian(
    xPad: number,
    yPad: number,
    nodes : CustomRect[]
  ) : CustomRect[] {
    let rects : CustomRect[] = [];
    let stackRects : CustomRect[] = nodes.slice();

    const stackRectsLength = stackRects.length;
    for(let index = 0; index < stackRectsLength; index++) {
      const rectToSplitCandidate = stackRects[index];
      const rectsArray = splitRects(rectToSplitCandidate, xPad, yPad);
      if(rectsArray.length === 2) {
        stackRects.push(...rectsArray);
      } else {
        rects.push(rectToSplitCandidate);
      }
    }
    stackRects.splice(0,stackRectsLength);

    return [...stackRects,...rects];
  }

  function splitRectsControlled(
    rect: CustomRect,
    xPad: number,
    yPad: number,
    direction: "vertical"| "horizontal") : [CustomRect, CustomRect] | [] {
      const { x1, x2, y1, y2 } = rect;

      if (direction === "horizontal") {
          const x = randInt(rect.x1 + xPad, rect.x2 - xPad);
          const r1 = { x1, y1, x2: x, y2, color: randomColor() };
          const r2 = { x1: x, y1, x2, y2, color: randomColor() };
          return [r1, r2];
      } else {
          const y = randInt(rect.y1 + yPad, rect.y2 - yPad);
          const r1 = { x1, y1, x2, y2: y, color: randomColor() };
          const r2 = { x1, y1: y, x2, y2, color: randomColor() };
          return [r1, r2];
      }
  }



  function splitRects(rect: CustomRect, xPad: number, yPad: number) : [CustomRect, CustomRect] | [] {
    // Check the rectangle is enough large and tall
    const width = widthRect(rect);
    const height = heightRect(rect);

    if (width < 2 * xPad || height < 2 * yPad) {
      return [];
    }

    return splitRectsControlled(rect, xPad, yPad, width > height ? "horizontal" : "vertical");
  }


  function generate(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    // magic number to avoid to little rects
    const xPad = canvasWidth * 0.05;
    const yPad = canvasHeight * 0.05;
    
    let rects : CustomRect[] = [];
    let stackRects : CustomRect[] = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}];
    let depth = 1;

    while(depth <= nbIterations) {
      stackRects = generateMondrian(xPad, yPad, stackRects);
      depth = depth + 1;
    }
    const results =  [...stackRects,...rects];
    setRects(results)
    return results;
  }

  function randomColor() {
    return colors[randInt(0, colors.length)];
  }

  function setHasBlack(hasBlack: boolean) {
    const newColors = 
      hasBlack ?
        defaultColors :
        [
          WhiteColor,
          WhiteColor,
          WhiteColor,
          WhiteColor,
          RedColor,
          BlueColor,
          YellowColor
        ]
   ;
    setColors(newColors);
  }

  return { generate, generateMondrian,  rects, setHasBlack, splitRectsControlled };

}

export default useMondrian;