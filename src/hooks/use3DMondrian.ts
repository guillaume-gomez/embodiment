import { useState } from 'react'; 
import { CustomRect, randInt, heightRect, widthRect, isEqual, filterWithRest } from "../utils";
import { sample, flatten } from "lodash";

interface Mondrian {
  rects: CustomRect[];
  title: "bottom" | "right" | "left";
}

interface Line {
  direction: "vertical"|"horizontal";
  coord: number;
}


function use3DMondrian() {
  const [ mondrianXY, setMondrianXY] = useState<Mondrian>({title: "bottom", rects: []});
  const [ mondrianYZ, setMondrianYZ] = useState<Mondrian>({title: "right", rects: []});
  const [ mondrianZX, setMondrianZX] = useState<Mondrian>({title: "left", rects: []});

  function randomColor() {
    return sample(["#f9dFF0", "#f900F0", "#0F00FD", "#9DFF00", "#FFFF00", "#AAFF88"]);
  }

  function splitRectsControlled(
    rect: CustomRect,
    xPad: number,
    yPad: number,
    line: Line
    ) : [CustomRect, CustomRect] | [] {
      const { x1, x2, y1, y2 } = rect;

      if (line.direction === "vertical") {
          const x = line.coord;
          const r1 = { x1, y1, x2: x, y2, color: randomColor() };
          const r2 = { x1: x, y1, x2, y2, color: randomColor() };
          return [r1, r2];
      } else {
          const y = line.coord;
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


    if(width > height) {
      return splitRectsControlled(rect, xPad, yPad, {direction: "horizontal", coord: randInt(rect.x1 + xPad, rect.x2 - xPad)});
    } else {
      return splitRectsControlled(rect, xPad, yPad, {direction: "vertical", coord: randInt(rect.y1 + yPad, rect.y2 - yPad)});
    }
}

  function chunkRects(rects: CustomRect[], xPad: number, yPad: number, line: Line) : CustomRect[] {
    if(line.direction === "horizontal") {
      const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => line.coord >= rect.y1 && line.coord <= rect.y2);
      const rectsChunked = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(rectToBeChunk, xPad, yPad, {direction: "vertical", coord: line.coord })
      );
      return [...flatten(rectsChunked), ...others];
    } else {
      const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => rect => line.coord >= rect.x1 && line.coord <= rect.x2);
      const rectsChunked = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(rectToBeChunk,xPad, yPad, {direction: "horizontal", coord: line.coord })
      );
      return [...flatten(rectsChunked), ...others];
    }
  }

  function ruleABC(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") : [CustomRect[], Line] {
    const candidate = sample(rects);
    const cut = direction === "horizontal" ?
      randInt(candidate.x1 + xPad, candidate.x2 - xPad) :
      randInt(candidate.y1 + yPad, candidate.y2 - yPad)
    ;

    const line = { direction, coord: cut };

    const newRects = splitRectsControlled(candidate, xPad, yPad, line);
    console.log("newRects")
    console.log(line)
    console.log(newRects)
    console.log(candidate)

    if(newRects.length === 0) {
      return rects;
    }

    const rectsWithoutCandidate = rects.filter(rect =>
      rect.x1 !== candidate.x1 ||
      rect.x2 !== candidate.x2 ||
      rect.y1 !== candidate.y1 ||
      rect.y2 !== candidate.y2
    );

    console.log([...rectsWithoutCandidate, ...newRects])
    console.log("ending")
    return [[...rectsWithoutCandidate, ...newRects], line];
  }

  function ruleA(xPad: number, yPad: number, rects: CustomRect[]) {
    // cut should be here
    return ruleABC(xPad, yPad, rects, "horizontal");
  }

  function ruleB(xPad: number, yPad: number, rects: CustomRect[]) {
    // cut should be here
    return ruleABC(xPad, yPad, rects, "vertical");
  }

  function ruleC(xPad: number, yPad: number, rects: CustomRect[]) {
    // cut should be here
    return ruleABC(xPad, yPad, rects, "horizontal");
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

    const initRect = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}]

    const [rectsA, lineA] = ruleA(xPad, yPad, initRect);
    const [rectsAA, lineAA] = ruleA(xPad, yPad, rectsA);

    //const [rectsB, lineB] = ruleB(xPad, yPad, initRect);
    //const [rectsBB, lineBB] = ruleB(xPad, yPad, rectsB);

    //const [rectsC, lineC] = ruleC(xPad, yPad, initRect);
    //const [rectsCC, lineCC] = ruleC(xPad, yPad, rectsC);

    //console.log("first step")
    //console.log(rectsA)

    setMondrianXY({...mondrianXY, rects: [...rectsAA] });
    //setMondrianYZ({...mondrianYZ, rects: [...rectsB]});
    //setMondrianZX({...mondrianZX, rects: [...rectsC] });
  }

  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX };

}

export default use3DMondrian;