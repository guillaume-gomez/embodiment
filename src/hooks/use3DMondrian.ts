import { useState } from 'react'; 
import { CustomRect, Line, Segment, randInt, filterWithRest, fromRectsToVolumes } from "../utils";
import { sample, flatten } from "lodash";

type TitleType = "bottom" | "right" | "top";
export type HistoryType = TitleType | "all";

interface Mondrian {
  rects: CustomRect[];
  title: TitleType;
}



function use3DMondrian() {
  const [ mondrianXY, setMondrianXY] = useState<Mondrian>({title: "bottom", rects: []});
  const [ mondrianYZ, setMondrianYZ] = useState<Mondrian>({title: "right", rects: []});
  const [ mondrianZX, setMondrianZX] = useState<Mondrian>({title: "top", rects: []});
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
      const rectsChunked = rectsToBeChunk.map(rectToBeChunk =>
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
      return [...flatten(rectsChunked), ...others];
  }

  function chunkRectsHorizontal(rects: CustomRect[], xPad: number, yPad: number, coord: number) {
    const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => coord >= rect.y1 && coord <= rect.y2);
      const rectsChunked = rectsToBeChunk.map(rectToBeChunk =>
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
      return [...flatten(rectsChunked), ...others];
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
   /* const cut = direction === "vertical" ?
      randInt(candidate.x1 + xPad, candidate.x2 - xPad) :
      randInt(candidate.y1 + yPad, candidate.y2 - yPad)
    ;*/

    let firstPoint = {x:0, y:0};
    let lastPoint = {x:0, y:0};
    let cut;
    if(direction === "vertical") {
      cut = randInt(candidate.x1 + xPad, candidate.x2 - xPad);
      firstPoint = { x: cut, y:  candidate.y1 };
      lastPoint = { x: cut, y:  candidate.y2 };
    } else {
      cut = randInt(candidate.y1 + yPad, candidate.y2 - yPad);
      firstPoint = { x: candidate.y1, y:  cut };
      lastPoint = { x: candidate.y2 , y:  cut };
    }

    const segment : Segment = { direction, firstPoint, lastPoint };
    const newRects = splitRectsControlled(candidate, xPad, yPad, segment);

    if(newRects.length === 0) {
      return [rects, segment];
    }

    return [[...rectsWithoutCandidate(rects, candidate), ...newRects], segment];
  }

  function ruleA(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleABC(xPad, yPad, rects, "horizontal");
  }

  function ruleB(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleABC(xPad, yPad, rects, "horizontal");
  }

  function ruleC(xPad: number, yPad: number, rects: CustomRect[]) {
    return ruleABC(xPad, yPad, rects, "vertical");
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

    const [rectsA, lineA] = ruleA(xPad, yPad, initRect);
    const [rectsB, lineB] = ruleB(xPad, yPad, initRect);
    const [rectsC, lineC] = ruleC(xPad, yPad, initRect);

    const rectsASplit = chunkRectsVertical(rectsA, xPad, yPad, lineC.firstPoint.x);
    const rectsBSplit = chunkRectsVertical(rectsB, xPad, yPad, canvasWidth - lineA.firstPoint.x);
    const rectsCSplit = chunkRectsHorizontal(rectsC, xPad, yPad, lineB.firstPoint.y);

    const [rectsAA, lineAA] = ruleA(xPad, yPad, rectsASplit);
    const [rectsBB, lineBB] = ruleB(xPad, yPad, rectsBSplit);
    const [rectsCC, lineCC] = ruleC(xPad, yPad, rectsCSplit);

    const rectsAASplit = chunkRectsVertical(rectsAA, xPad, yPad, lineCC.firstPoint.x);
    const rectsBBSplit = chunkRectsVertical(rectsBB, xPad, yPad, canvasWidth - lineAA.firstPoint.x);
    const rectsCCSplit = chunkRectsHorizontal(rectsCC, xPad, yPad, lineBB.firstPoint.y);

    const [rectsAAA, lineAAA] = ruleD(xPad, yPad, rectsAASplit);
    const [rectsBBB, lineBBB] = ruleE(xPad, yPad, rectsBBSplit);
    const [rectsCCC, lineCCC] = ruleF(xPad, yPad, rectsCCSplit);

    const rectsAAASplit = chunkRectsVertical(rectsAA, xPad, yPad, lineCCC.firstPoint.x);
    const rectsBBBSplit = chunkRectsVertical(rectsBB, xPad, yPad, canvasWidth - lineAAA.firstPoint.x);
    const rectsCCCSplit = chunkRectsHorizontal(rectsCC, xPad, yPad, lineBBB.firstPoint.y);

    console.log(lineA)
    console.log(lineC)
    console.log(lineAA)
    console.log(lineCC)
    console.log(lineAAA)
    console.log(lineCCC)

    setHistory([
      { title: "bottom", rects: rectsA },
      { title: "right", rects: rectsB },
      { title: "top", rects: rectsC },
      { title: "bottom", rects: rectsASplit },
      { title: "right", rects: rectsBSplit },
      { title: "top", rects: rectsCSplit },
      { title: "bottom", rects: rectsAA },
      { title: "right", rects: rectsBB },
      { title: "top", rects: rectsCC },
      { title: "bottom", rects: rectsAASplit },
      { title: "right", rects: rectsBBSplit },
      { title: "top", rects: rectsCCSplit },
      { title: "bottom", rects:rectsAAA },
      { title: "right", rects:rectsBBB },
      { title: "top", rects:rectsCCC },
      { title: "bottom", rects:rectsAAASplit },
      { title: "right", rects:rectsBBBSplit },
      { title: "top", rects:rectsCCCSplit }
    ]);

/*    setMondrianXY({...mondrianXY, rects: [...rectsASplit] });
    setMondrianYZ({...mondrianYZ, rects: [...rectsBSplit] });
    setMondrianZX({...mondrianZX, rects: [...rectsCSplit] });*/

    //console.log(fromRectsToVolumes(mondrianYZ.rects, [lineC, lineCC, lineCCC], canvasWidth, canvasHeight));


    setMondrianXY({...mondrianXY, rects: [...rectsAAASplit] });
    setMondrianYZ({...mondrianYZ, rects: [...rectsBBBSplit] });
    setMondrianZX({...mondrianZX, rects: [...rectsCCCSplit] });
  }

  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX, historyByTitle };

}

export default use3DMondrian;