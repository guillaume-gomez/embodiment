import { useState, useMemo, useEffect } from 'react';
import partition from "lodash/partition";
import flatten from "lodash/flatten";
import sample from "lodash/sample";
import shuffle from "lodash/shuffle";
import sampleSize from "lodash/sampleSize";


export interface CustomRect3D{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z1: number;
  z2: number;
  color: string;
}

interface CustomRects3DStackItem {
  action: string;
  position: number;
  customRects3D: CustomRect3D[];
}

type Palette = [string, string, string, string, string, string];

export const palettes : Palette[] = [
  ["#270245", "#871A85", "#FF2941", "#FEFF38", "#FE18D3", "#4206F1"],
  ["#3B7573", "#493770", "#7F4D85", "#B8587B", "#EEBE8F", "#EEBE8F"],
  ["#A414D9", "#FF802B", "#F9E105", "#34C7A5", "#5D50CE", "#5D50CE"],
  ["#493E90", "#493E90", "#FDF60C", "#14C898", "#DD2268", "#DD2268"],
  ["#00A8BC", "#B20E21", "#FFE101", "#FFCD04", "#F79212", "#EB3510"],
  ["#C6460F", "#F7892E", "#EAC761", "#E8DF9C", "#B7CF99", "#4FAAA7"],
  ["#FF0000", "#FF0000", "#0000FF", "#0000FF", "#FFFFFF", "#FFFFFF"],
  ["#FF0004", "#7A0080", "#FFFF00", "#30C030", "#002CFF", "#FF7E00"], // retro gaming
  ["#DD367C", "#F7F8C9", "#F5DA7C", "#00BD75", "#7700D7", "#EC586B"], // 60s Retro Color Scheme
  ["#300350", "#94167F", "#E93479", "#F9AC53", "#F62E97", "#153CB4"], // Vaporwave Color Scheme
  ["#001D80", "#0951FD", "#F9FE0E", "#00FBD6", "#FF01FD", "#001D80"], // Retro Game Screen
  ["#D95F3B", "#F0984A", "#FCD6A5", "#7AA9A3", "#338F9A", "#1C4C70"], // Retro Gradient Color Scheme
  ["#0C1565", "#A82437", "#461659", "#A3209A", "#F3BA24", "#3094C6"], // Darkwave Color Scheme
]

function randomColor() : string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomColorFromPalette(palette: string[]) : string {
  const colorIndex = Math.floor(Math.random() * 6);
  return palette[colorIndex];
}

function getRandomInt(min: number, max: number) : number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


type AxisType = "X" | "Y" | "Z";

function use3DMondrian() {
  const [xPad, _setXPad] = useState<number>(50);
  const [_yPad, _setYPad] = useState<number>(50);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [depth, setDepth] = useState<number>(500);
  const [random, setRandom] = useState<number>(1.0);
  const [paletteIndex, setPaletteIndex] = useState<number>(-1);

  const [customRects3DStack, setCustomRects3DStack] = useState<CustomRects3DStackItem[]>([]);
  // use for randomness
  const [initialCustomRects3DStack, setInitialCustomRects3DStack] = useState<CustomRects3DStackItem[]>([]);

  const customRects3D = useMemo(() => {
    if(customRects3DStack.length === 0) {
      return [];
    } else {
      return customRects3DStack[customRects3DStack.length - 1].customRects3D;
    }
  }, [customRects3DStack]);

  useEffect(() => {
    randomize();
  }, [random]);

  function computeColor() {
    if(paletteIndex === -1) {
      return randomColor();
    }

    return randomColorFromPalette(palettes[paletteIndex]);
  }

  function randomize() {
    const randomCustomRects3DStack = initialCustomRects3DStack.map(customRects3DItem =>
      ({
        ...customRects3DItem,
        customRects3D: sampleSize(shuffle(customRects3DItem.customRects3D), Math.ceil(customRects3DItem.customRects3D.length * random))
      })
    )
    setCustomRects3DStack(randomCustomRects3DStack);
  }

  function selectedCustomsRects3D(customRects3D: CustomRect3D[], axis: AxisType, coord: number): [CustomRect3D[], CustomRect3D[]] {
    switch(axis) {
      case "X":
      default:
          return partition(customRects3D, (customRect3D) => coord >= customRect3D.x1 && coord <= customRect3D.x2);
      case "Y":
          return partition(customRects3D, (customRect3D) => coord >= customRect3D.y1 && coord <= customRect3D.y2);
      case "Z":
          return partition(customRects3D, (customRect3D) => coord >= customRect3D.z1 && coord <= customRect3D.z2);
    }
  }

  function cutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) : CustomRect3D[] {
    switch(axis) {
      case "X":
      default:
          return cutInXY(customRects3D, coord);
      case "Y":
          return cutInYZ(customRects3D, coord);
      case "Z":
          return cutInXZ(customRects3D, coord);
    }
  }

  function subCutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) : CustomRect3D[] {
    // convert the axis make sur the cut is the right direction
    let axisTarget : AxisType = "Y";
    if (axis === "X") {
      axisTarget = "Z";
    } else if(axis === "Y") {
      axisTarget = "X"
    } else {
      axisTarget = "Y";
    }

    const [candidates, _others] = selectedCustomsRects3D(customRects3D, axisTarget, coord);
    if(candidates.length === 0) {
      console.info("does not work");
      return customRects3D;
    }

    const choose = sample(candidates)!; // candidates cannot be empty
    const others = rectsWithoutCandidate(customRects3D, choose);
    const partition = cutIn([choose], axis, coord);

    return [...partition, ...others];
  }

  function cutInXY(customRects3D: CustomRect3D[], coord: number) : CustomRect3D[] {
    const [candidates, others] = selectedCustomsRects3D(customRects3D, "Z", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        z2: coord,
        color: computeColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        z1: coord,
        color: computeColor()
      };

      return [a,b]
    });

    return [...flatten(result), ...others];
  }

  function cutInYZ(customRects3D: CustomRect3D[], coord: number) : CustomRect3D[] {
    const [candidates, others] = selectedCustomsRects3D(customRects3D, "X", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        x2: coord,
        color: computeColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        x1: coord,
        color: computeColor()
      };

      return [a,b]
    });

    return [...flatten(result), ...others];
  }


  function cutInXZ(customRects3D: CustomRect3D[], coord: number) : CustomRect3D[] {
    const [candidates, others] =  selectedCustomsRects3D(customRects3D, "Y", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        y1: coord,
        color: computeColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        y2: coord,
        color: computeColor()
      };

      return [a,b]
    });

    return [...flatten(result), ...others];
  }

  function rectsWithoutCandidate(customRects: CustomRect3D[], candidate: CustomRect3D) : CustomRect3D[] {

    return customRects.filter(customRect =>
      customRect.x1 !== candidate.x1 ||
      customRect.x2 !== candidate.x2 ||
      customRect.y1 !== candidate.y1 ||
      customRect.y2 !== candidate.y2 ||
      customRect.z1 !== candidate.z1 ||
      customRect.z2 !== candidate.z2
    );
  }

  function generate(numberIteration: number) : void {
    const init : CustomRect3D = {
      x1: 0, x2: width,
      y1: 0, y2: height,
      z1: 0, z2: depth,
      color: "black"
    };
    const functions = [cutIn, subCutIn];

    let currentCustomRects : CustomRect3D[] = [init];
    let newCustomRects3DStack : CustomRects3DStackItem[] = [];

    for(let i=0; i < numberIteration; i++) {
      const randomCoord = getRandomInt(xPad, width - xPad);
      const randomAxis : AxisType = sample(["X", "Y", "Z"] as AxisType[])!;
      const selectedFunction = getRandomInt(0,1);
      currentCustomRects = functions[selectedFunction](currentCustomRects, randomAxis, randomCoord)!;
      newCustomRects3DStack.push({
          position: i,
          action: `rotation-${randomAxis}`,
          customRects3D: currentCustomRects
        });
    }

    setCustomRects3DStack(newCustomRects3DStack);
    // save for randomness
    setInitialCustomRects3DStack(newCustomRects3DStack);
    if(random !== 1.0) {
      randomize();
    }
  }

  function cutInAction(axis: AxisType, coord: number): void {
    const newCustomRects3D = cutIn(customRects3D, axis, coord);

    const newCustomRects3DStack = [...customRects3DStack, {
      position: customRects3DStack.length,
      action: `rotation-${axis}`,
      customRects3D: newCustomRects3D
    }];
    setCustomRects3DStack(newCustomRects3DStack);
  }

  return {
    generate,
    cutInAction,
    customRects3D,
    customRects3DStack,
    setWidth,
    setHeight,
    setDepth,
    setRandom,
    setPaletteIndex,
    width,
    height,
    depth,
    random,
    paletteIndex,
  };

}

export default use3DMondrian;