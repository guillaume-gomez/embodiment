import { useState } from 'react'; 
import { CustomRect, Line, randInt, filterWithRest, fromRectsToVolumes } from "../utils";
import { sample, flatten } from "lodash";

type TitleType = "bottom" | "right" | "top";
export type HistoryType = TitleType | "all";

interface Mondrian {
  rects: CustomRect[];
  title: TitleType;
}



function use3DMondrian() {
  const [ mondrianXY, setMondrianXY ] = useState<Mondrian>({title: "bottom", rects: []});
  const [ mondrianYZ, setMondrianYZ ] = useState<Mondrian>({title: "right", rects: []});
  const [ mondrianZX, setMondrianZX ] = useState<Mondrian>({title: "top", rects: []});
  const [ customRects3D, setCustomRects3D ] = useState<CustomRect3D[]>([]);
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

  function chunkRectsVertical(rects: CustomRect[], xPad: number, yPad: number, coord: number ) {
      const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => coord >= rect.x1 && coord <= rect.x2);
      const rectZXhunked = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(rectToBeChunk,xPad, yPad, {direction: "vertical", coord })
      );
      return [...flatten(rectZXhunked), ...others];
  }

  function chunkRectsHorizontal(rects: CustomRect[], xPad: number, yPad: number, coord: number) {
    const [rectsToBeChunk, others] = filterWithRest(rects, (rect: CustomRect) => coord >= rect.y1 && coord <= rect.y2);
      const rectZXhunked = rectsToBeChunk.map(rectToBeChunk =>
          splitRectsControlled(rectToBeChunk, xPad, yPad, {direction: "horizontal", coord })
      );
      return [...flatten(rectZXhunked), ...others];
  }

  function rectsWithoutCandidate(rects: CustomRect[], candidate: CustomRect) : CustomRect[] {
    return rects.filter(rect =>
      rect.x1 !== candidate.x1 ||
      rect.x2 !== candidate.x2 ||
      rect.y1 !== candidate.y1 ||
      rect.y2 !== candidate.y2
    );
  }

  function ruleABC(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") : [CustomRect[], Line] {
    const candidate = sample(rects);
    if(!candidate) {
      throw new Error("Candidate is null on rule ABC");
    }
    const cut = direction === "vertical" ?
      randInt(candidate.x1 + xPad, candidate.x2 - xPad) :
      randInt(candidate.y1 + yPad, candidate.y2 - yPad)
    ;

    const line = { direction, coord: cut };
    const newRects = splitRectsControlled(candidate, xPad, yPad, line);

    if(newRects.length === 0) {
      return [rects, line];
    }

    return [[...rectsWithoutCandidate(rects, candidate), ...newRects], line];
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

  function ruleDEF(xPad: number, yPad: number, rects: CustomRect[], direction: "horizontal" | "vertical") : [CustomRect[], Line] {
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

    const [rectXY, lineA] = ruleA(xPad, yPad, initRect);
    const [rectYZ, lineB] = ruleB(xPad, yPad, initRect);
    const [rectZX, lineC] = ruleC(xPad, yPad, initRect);

    const rectXYSplit = chunkRectsVertical(rectXY, xPad, yPad, lineC.coord);
    const rectYZSplit = chunkRectsVertical(rectYZ, xPad, yPad, canvasWidth - lineA.coord);
    const rectZXSplit = chunkRectsHorizontal(rectZX, xPad, yPad, lineB.coord);

    const [rectXYOne, lineAA] = ruleA(xPad, yPad, rectXYSplit);
    const [rectYZOne, lineBB] = ruleB(xPad, yPad, rectYZSplit);
    const [rectZXOne, lineCC] = ruleC(xPad, yPad, rectZXSplit);

    const rectXYOneSplit = chunkRectsVertical(rectXYOne, xPad, yPad, lineCC.coord);
    const rectYZOneSplit = chunkRectsVertical(rectYZOne, xPad, yPad, canvasWidth - lineAA.coord);
    const rectZXOneSplit = chunkRectsHorizontal(rectZXOne, xPad, yPad, lineBB.coord);

    const [rectXYTwo, lineAAA] = ruleD(xPad, yPad, rectXYOneSplit);
    const [rectYZTwo, lineBBB] = ruleE(xPad, yPad, rectYZOneSplit);
    const [rectZXTwo, lineCCC] = ruleF(xPad, yPad, rectZXOneSplit);

    const rectXYTwoSplit = chunkRectsVertical(rectXYOne, xPad, yPad, lineCCC.coord);
    const rectYZTwoSplit = chunkRectsVertical(rectYZOne, xPad, yPad, canvasWidth - lineAAA.coord);
    const rectZXTwoSplit = chunkRectsHorizontal(rectZXOne, xPad, yPad, lineBBB.coord);

/*    console.log(lineA)
    console.log(lineC)
    console.log(lineAA)
    console.log(lineCC)
    console.log(lineAAA)
    console.log(lineCCC)
*/
    setHistory([
      { title: "bottom", rects: rectXY },
      { title: "right", rects: rectYZ },
      { title: "top", rects: rectZX },
      { title: "bottom", rects: rectXYSplit },
      { title: "right", rects: rectYZSplit },
      { title: "top", rects: rectZXSplit },
      { title: "bottom", rects: rectXYOne },
      { title: "right", rects: rectYZOne },
      { title: "top", rects: rectZXOne },
      { title: "bottom", rects: rectXYOneSplit },
      { title: "right", rects: rectYZOneSplit },
      { title: "top", rects: rectZXOneSplit },
      { title: "bottom", rects:rectXYTwo },
      { title: "right", rects:rectYZTwo },
      { title: "top", rects:rectZXTwo },
      { title: "bottom", rects:rectXYTwoSplit },
      { title: "right", rects:rectYZTwoSplit },
      { title: "top", rects:rectZXTwoSplit }
    ]);

    /*setMondrianXY({...mondrianXY, rects: [...rectXYSplit] });
    setMondrianYZ({...mondrianYZ, rects: [...rectYZSplit] });
    setMondrianZX({...mondrianZX, rects: [...rectZXSplit] });

    setCustomRects3D(fromRectsToVolumes(rectYZSplit, [lineC], canvasWidth, canvasHeight));*/


    setMondrianXY({...mondrianXY, rects: [...rectXYTwoSplit] });
    setMondrianYZ({...mondrianYZ, rects: [...rectYZTwoSplit] });
    setMondrianZX({...mondrianZX, rects: [...rectZXTwoSplit] });

    const newCustomRects3D = fromRectsToVolumes(rectYZTwoSplit, [lineC, lineCC, lineCCC], canvasWidth, canvasHeight);
    setCustomRects3D(newCustomRects3D);
    console.table(newCustomRects3D)
  }

  return { generate: generate3D, mondrianXY, mondrianYZ, mondrianZX, customRects3D, historyByTitle };

}

export default use3DMondrian;