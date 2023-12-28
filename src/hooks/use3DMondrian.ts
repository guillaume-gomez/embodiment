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

  function generate() {
    const customRect3D : CustomRect3D = {
      x1: 0, x2: width,
      y1: 0, y2: height,
      z1: 0, z2: depth,
      color: "red"
    };

    //for(let i =0; i < 3; i++) {
      const randomCoord = Math.floor(Math.random() * depth);
      const randomAxis = sample(["X", "Y", "Z"]);
      const cut = cutInXY([customRect3D], 400);
      const cut2 = cutInXZ(cut, 100);
      const cut3 = cutInYZ(cut2, 150);
      const cut4 = cutInXY(cut3, 250);
    //}
    setCustomRects3D(cut4);
  }

  return { generate, customRects3D, setWidth, setHeight, width, height };

}

export default use3DMondrian;