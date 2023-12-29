import { useState, useMemo } from 'react';
import { partition, flatten, sample } from "lodash"


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

function randomColor() : string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

type AxisType = "X" | "Y" | "Z";

function use3DMondrian() {
  const [xPad, setXPad] = useState<number>(50);
  const [yPad, setYPad] = useState<number>(50);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [depth, setDepth] = useState<number>(500);
  const [random, setRandom] = useState<number>(0.8);

  const [ customRects3DStack, setCustomRects3DStack ] = useState<CustomRects3DStackItem[]>([]);

  const customRects3D = useMemo(() => {
    if(customRects3DStack.length === 0) {
      return [];
    } else {
      return customRects3DStack[customRects3DStack.length - 1].customRects3D;
    }
  }, [customRects3DStack]);

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

  function cutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) {
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

  function subCutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) {
    // convert the axis make sur the cut is the right direction
    let axisTarget = "Y";
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
      return;
    }

    const choose = sample(candidates);
    const others = rectsWithoutCandidate(customRects3D, choose);
    const partition = cutIn([choose], axis, coord);

    return [...partition, ...others];
  }

  function cutInXY(customRects3D: CustomRect3D[], coord: number) {
    const [candidates, others] = selectedCustomsRects3D(customRects3D, "Z", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        z2: coord,
        color: randomColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        z1: coord,
        color: randomColor()
      };

      return [a,b]
    });

    return [...flatten(result), ...others];
  }

  function cutInYZ(customRects3D: CustomRect3D[], coord: number) {
    const [candidates, others] = selectedCustomsRects3D(customRects3D, "X", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        x2: coord,
        color: randomColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        x1: coord,
        color: randomColor()
      };

      return [a,b]
    });

    return [...flatten(result), ...others];
  }


  function cutInXZ(customRects3D: CustomRect3D[], coord: number) {
    const [candidates, others] =  selectedCustomsRects3D(customRects3D, "Y", coord);

    const result = candidates.map(customRect3D => {
      const a : CustomRect3D = {
        ...customRect3D,
        y1: coord,
        color: randomColor()
      };
      const b : CustomRect3D = {
        ...customRect3D,
        y2: coord,
        color: randomColor()
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

  function generate() {
    const init : CustomRect3D = {
      x1: 0, x2: width,
      y1: 0, y2: height,
      z1: 0, z2: depth,
      color: "red"
    };
    const functions = [cutIn, subCutIn];

    let currentCustomRects : CustomRect3D[] = [init];
    let newCustomRects3DStack : customRects3DStackItem[] = [];

    for(let i=0; i < 10; i++) {
        const randomCoord = getRandomInt(xPad, width - xPad);
        const randomAxis : AxisType = sample(["X", "Y", "Z"] as AxisType[]);
        const selectedFunction = Math.floor(Math.random()*functions.length);
        currentCustomRects = functions[selectedFunction](currentCustomRects, randomAxis, randomCoord);

        newCustomRects3DStack.push({
          position: i,
          action: `rotation-${randomAxis}`,
          customRects3D: currentCustomRects
        });
      }

    setCustomRects3DStack(newCustomRects3DStack);
  }

  return {
    generate,
    customRects3D,
    customRects3DStack,
    setWidth,
    setHeight,
    width,
    height,
    random,
    setRandom
  };

}

export default use3DMondrian;