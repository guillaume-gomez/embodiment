import { useState } from 'react';
import { partition, flatten } from "lodash"


export interface CustomRect3D{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z1: number;
  z2: number;
  color: string;
}

type AxisType = "X" | "Y" | "Z";

function use3DMondrian() {
  const [xPad, setXPad] = useState<number>(50);
  const [yPad, setYPad] = useState<number>(50);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [depth, setDepth] = useState<number>(500);

  const [ customRects3D, setCustomRects3D ] = useState<CustomRect3D[]>([]);

  function cutIn(axis: AxisType, coord: number) {
  }

  function cutInXY(customRects3D: CustomRect3D, coord: number) {
    const [selectedCustomsRects3D, others] = partition(customRects3D, (customRect3D) => coord >= customRect3D.z1 && coord <= customRect3D.z2);


    const result = selectedCustomsRects3D.map(customRect3D => {
      const a : CustomRect3D = {
        x1: customRect3D.x1,
        x2: customRect3D.x2,
        y1: customRect3D.y1,
        y2: customRect3D.y2,
        z1: customRect3D.z1,
        z2: coord,
        color: "purple"
      };
      const b : CustomRect3D = {
        x1: customRect3D.x1,
        x2: customRect3D.x2,
        y1: customRect3D.y1,
        y2: customRect3D.y2,
        z1: coord,
        z2: customRect3D.z2,
        color: "yellow"
      };

      return [a,b]
    });

    return flatten(result);
  }

  function split() {

  }



  function generate() {
    const customRect3D : CustomRect3D = {
      x1: 0, x2: width,
      y1: 0, y2: height,
      z1: 0, z2: depth,
      color: "red"
    };
    const z = Math.floor(Math.random() * depth)
    const cut = cutInXY([customRect3D], z);
    setCustomRects3D(cut);
  }

  return { generate, customRects3D, setWidth, setHeight, width, height };

}

export default use3DMondrian;