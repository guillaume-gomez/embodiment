import { useState } from 'react';
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

function randomColor() : string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

type AxisType = "X" | "Y" | "Z";

function use3DMondrian() {
  const [xPad, setXPad] = useState<number>(50);
  const [yPad, setYPad] = useState<number>(50);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [depth, setDepth] = useState<number>(500);

  const [ customRects3D, setCustomRects3D ] = useState<CustomRect3D[]>([]);

  function cutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) {
    switch(axis) {
      case "X":
      default:
          return cutInYZ(customRects3D, coord);
      case "Y":
          return cutInXY(customRects3D, coord);
      case "Z":
          return cutInXZ(customRects3D, coord);
    }
  }

  function subCutIn(customRects3D: CustomRect3D[], axis: AxisType, coord: number) {
    const choose = sample(customRects3D);
    const others = rectsWithoutCandidate(customRects3D, choose);

    const partition = cutIn([choose], axis, coord);

    return [...partition, ...others];
  }

  function cutInXY(customRects3D: CustomRect3D[], coord: number) {
    const [selectedCustomsRects3D, others] = partition(customRects3D, (customRect3D) => coord >= customRect3D.z1 && coord <= customRect3D.z2);

    const result = selectedCustomsRects3D.map(customRect3D => {
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
    const [selectedCustomsRects3D, others] = partition(customRects3D, (customRect3D) => coord >= customRect3D.x1 && coord <= customRect3D.x2);

    const result = selectedCustomsRects3D.map(customRect3D => {
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
    const [selectedCustomsRects3D, others] = partition(customRects3D, (customRect3D) => coord >= customRect3D.y1 && coord <= customRect3D.y2);

    const result = selectedCustomsRects3D.map(customRect3D => {
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

  function rectsWithoutCandidate(customRects: CustomRect3D[], candidate: CustomRect3D) : CustomRect[] {

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

    let customRects : CustomRect3D[] = [init];

    for(let i =0; i < 4; i++) {
      const randomCoord = Math.floor(Math.random() * width);
      const randomAxis = sample(["X", "Y", "Z"]);
      customRects = cutIn(customRects, randomAxis, randomCoord);
    }
    customRects = subCutIn(customRects, "Z", 250);
    setCustomRects3D(customRects);
  }

  return { generate, customRects3D, setWidth, setHeight, width, height };

}

export default use3DMondrian;