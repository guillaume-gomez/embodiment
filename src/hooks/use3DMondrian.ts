import { useState } from 'react'; 
import { CustomRect, Segment, randInt, filterWithRest, fromRectToVolumeHorizontal, fromRectToVolumeVertical } from "../utils";
import { sample, flatten } from "lodash";

type TitleType = "back" | "left" | "down";
export type HistoryType = TitleType | "all";

interface Mondrian {
  rects: CustomRect[];
  title: TitleType;
}

function use3DMondrian() {
  const [xPad, setXPad] = useState<number>(50);
  const [yPad, setYPad] = useState<number>(50);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);

  const [ mondrianXY, setMondrianXY ] = useState<Mondrian>({title: "back", rects: []});
  const [ mondrianYZ, setMondrianYZ ] = useState<Mondrian>({title: "left", rects: []});
  const [ mondrianZX, setMondrianZX ] = useState<Mondrian>({title: "down", rects: []});
  const [ customRects3DData, setCustomRects3DData ] = useState<CustomRect3DData>({ rects: [], basedOnMondrian: "" });

  const [history, setHistory] = useState<Mondrian[]>([]);

  function randomColor() : string {
    const color = sample(
      ["#FF6700", "#EBEBEB", "#3A6EA5", "#004E98", "#621B00", "#2F10FF", "#E89005", "#E70E02", "#E2F89C", "#BDC4A7", "#632B30" ]
    )!;
    return color;
  }

  function splitRectsControlled(
    rect: CustomRect,
    xPad: number,
    yPad: number,
    segment: Segment
    ) : [CustomRect, CustomRect] | [] {
      const { x1, x2, y1, y2 } = rect;

      if (segment.direction === "vertical") {
          const x = segment.firstPoint.x;
          const r1 = { x1, y1, x2: x, y2, color: randomColor() };
          const r2 = { x1: x, y1, x2, y2, color: randomColor() };
          return [r1, r2];
      } else {
          const y = segment.firstPoint.y;
          const r1 = { x1, y1, x2, y2: y, color: randomColor() };
          const r2 = { x1, y1: y, x2, y2, color: randomColor() };
          return [r1, r2];
      }
  }

  function chunkRectsVertical(rects: CustomRect[], xPad: number, yPad: number, coord: number ) {
      const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => coord >= rect.x1 && coord <= rect.x2);
      const chunkedRects = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(
            rectToBeChunk,
            xPad,
            yPad,
            {
              direction: "vertical",
              firstPoint: { x: coord, y: rectToBeChunk.y1 },
              lastPoint: { x: coord, y: rectToBeChunk.y2 }
            }
          )
      );
      return [...flatten(chunkedRects), ...others];
  }

  function chunkRectsHorizontal(rects: CustomRect[], xPad: number, yPad: number, coord: number) {
    const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => coord >= rect.y1 && coord <= rect.y2);
      const chunkedRects = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(
            rectToBeChunk,
            xPad,
            yPad,
            {
              direction: "horizontal",
              firstPoint: { x: rectToBeChunk.x1, y: coord },
              lastPoint: { x: rectToBeChunk.x2, y: coord }
            }
          )

      );
      return [...flatten(chunkedRects), ...others];
  }

  function rectsWithoutCandidate(rects: CustomRect[], candidate: CustomRect) : CustomRect[] {
    return rects.filter(rect =>
      rect.x1 !== candidate.x1 ||
      rect.x2 !== candidate.x2 ||
      rect.y1 !== candidate.y1 ||
      rect.y2 !== candidate.y2
    );
  }

  function ruleABC(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") : [CustomRect[], Segment] {
    const candidate = sample(rects);
    if(!candidate) {
      throw new Error("Candidate is null on rule ABC");
    }

    let firstPoint = {x:0, y:0};
    let lastPoint = {x:0, y:0};
    let cut;

    if(direction === "vertical") {
      cut = randInt(candidate.x1 + xPad, candidate.x2 - xPad);
      firstPoint = { x: cut, y:  candidate.y1 };
      lastPoint = { x: cut, y:  candidate.y2 };
    } else {
      cut = randInt(candidate.y1 + yPad, candidate.y2 - yPad);
      firstPoint = { x: candidate.x1, y:  cut };
      lastPoint = { x: candidate.x2 , y:  cut };
    }

    const segment : Segment = { direction, firstPoint, lastPoint };
    const newRects = splitRectsControlled(candidate, xPad, yPad, segment);

    if(newRects.length === 0) {
      return [rects, segment];
    }

    return [[...rectsWithoutCandidate(rects, candidate), ...newRects], segment];
  }

  function ruleA([rectsXY, rectsYZ, rectsZX]: [CustomRect[], CustomRect[], CustomRect[]]) {
    const [newRectsXY, segment] = ruleABC(xPad, yPad, rectsXY, "horizontal");
    const newRectsYZ = chunkRectsHorizontal(rectsYZ, xPad, yPad, segment.firstPoint.y);
    const newRectsXYPrime = chunkRectsHorizontal(newRectsXY, xPad, yPad, segment.firstPoint.y);

    console.log(newRectsXY)
    console.log(newRectsXYPrime)

    return [segment, newRectsXYPrime, newRectsYZ, rectsZX];
  }

  function ruleB([rectsXY, rectsYZ, rectsZX]: [CustomRect[], CustomRect[], CustomRect[]]) {
    const [newRectsYZ, segment] = ruleABC(xPad, yPad, rectsYZ, "vertical");
    const newRectsZX = chunkRectsHorizontal(rectsZX, xPad, yPad, width - segment.firstPoint.x);
    const newRectsYZPrime = chunkRectsVertical(newRectsYZ, xPad, yPad, segment.firstPoint.x);
    return [segment, rectsXY, newRectsYZPrime, newRectsZX]
  }

  function ruleC([rectsXY, rectsYZ, rectsZX]: [CustomRect[], CustomRect[], CustomRect[]]) {
    const [newrectsZX, segment] = ruleABC(xPad, yPad, rectsYZ, "vertical");
    const newRectsXY = chunkRectsVertical(rectsZX, xPad, yPad, segment.firstPoint.x);

    return [segment, newRectsXY, rectsYZ, newrectsZX]
  }

  function ruleDEF(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") : [CustomRect[], Segment] {
    const candidate = sample(rects);
    if(!candidate) {
      throw new Error("Candidate is null on rule DEF");
    }
    const [newRects, line] = ruleABC(xPad, yPad, [candidate], direction);

    const rectsWithoutTheSelectedCandidate = rectsWithoutCandidate(rects, candidate);

    return [[...rectsWithoutTheSelectedCandidate, ...newRects], line];
  }

  function ruleD(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleDEF(xPad, yPad, rects, "horizontal");
  }

  function ruleE(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleDEF(xPad, yPad, rects, "horizontal");
  }

  function ruleF(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleDEF(xPad, yPad, rects, "vertical");
  }

  function historyByTitle(selectedTitle: HistoryType) : Mondrian[] {
    if(selectedTitle === "all") {
      return history;
    }
    return history.filter(({title}) => selectedTitle === title);
  }

  function generate3D(canvasWidth: number, canvasHeight: number) {
    const xPad = canvasWidth * 0.1;
    const yPad = canvasHeight * 0.1;

    const initRect = [{x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"}]

    const [segment, rectsXY, rectsYZ, rectsZX] = ruleA([initRect, initRect, initRect]);
    const [segment2, rectsXY2, rectsYZ2, rectsZX2] = ruleB([rectsXY, rectsYZ, rectsZX]);

    console.log(rectsYZ2)

    const [segment3, rectsXY3, rectsYZ3, rectsZX3] = ruleC([rectsXY2, rectsYZ2, rectsZX2]);

    /*const [rectYZ, lineB] = ruleB(xPad, yPad, initRect);
    const [rectZX, lineC] = ruleC(xPad, yPad, initRect);*/

    /*const rectXYSplit = chunkRectsVertical(rectXY, xPad, yPad, lineC.coord);
    const rectYZSplit = chunkRectsVertical(rectYZ, xPad, yPad, canvasWidth - lineA.coord);
    const rectZXSplit = chunkRectsHorizontal(rectZX, xPad, yPad, lineB.coord);

    const [rectXYOne, lineAA] = ruleA(xPad, yPad, rectXYSplit);
    const [rectYZOne, lineBB] = ruleB(xPad, yPad, rectYZSplit);
    const [rectZXOne, lineCC] = ruleC(xPad, yPad, rectZXSplit);

    const rectXYOneSplit = chunkRectsVertical(rectXYOne, xPad, yPad, lineCC.firstPoint.x);
    const rectYZOneSplit = chunkRectsVertical(rectYZOne, xPad, yPad, canvasWidth - lineAA.firstPoint.x);
    const rectZXOneSplit = chunkRectsHorizontal(rectZXOne, xPad, yPad, lineBB.firstPoint.x);

    const [rectXYTwo, lineAAA] = ruleD(xPad, yPad, rectXYOneSplit);
    const [rectYZTwo, lineBBB] = ruleE(xPad, yPad, rectYZOneSplit);
    const [rectZXTwo, lineCCC] = ruleF(xPad, yPad, rectZXOneSplit);

    const rectXYTwoSplit = chunkRectsVertical(rectXYOne, xPad, yPad, lineCCC.firstPoint.x);
    const rectYZTwoSplit = chunkRectsVertical(rectYZOne, xPad, yPad, canvasWidth - lineAAA.firstPoint.x);
    const rectZXTwoSplit = chunkRectsHorizontal(rectZXOne, xPad, yPad, lineBBB.firstPoint.x);
*/

    setMondrianXY({...mondrianXY, rects: [...rectsXY2] });
    setMondrianYZ({...mondrianYZ, rects: [...rectsYZ2] });
    setMondrianZX({...mondrianZX, rects: [...rectsZX2] });

    setHistory([

    ]);
  }

  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX, customRects3DData, historyByTitle };

}

export default use3DMondrian;