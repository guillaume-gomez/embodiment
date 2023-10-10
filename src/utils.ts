import { sortBy, flatten } from "lodash";

export interface CustomRect{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export interface CustomRect3D extends CustomRect {
  z1: number;
  z2: number;
}

export interface Line {
  direction: "vertical"|"horizontal";
  coord: number;
}

function length(axis1: number, axis2: number) : number {
    return Math.abs(axis2 - axis1);
}

export function widthRect({x1, x2}: CustomRect) : number {
    return length(x2, x1);
}

export function heightRect({y1, y2} : CustomRect) : number {
    return length(y2, y1);
}

export function depthRect({z1, z2} : CustomRect3D) : number {
    return length(z2, z1);
}

export function centerRect(rect : CustomRect) : [number, number] {
    return [ widthRect(rect)/ 2, heightRect(rect) / 2 ];
}

export function centerRect3d(rect3d : CustomRect3D) : [number, number, number] {
    return [ widthRect(rect3d)/ 2, heightRect(rect3d) / 2, depthRect(rect3d) /2 ];
}


export function randInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min) + min)
}

export function customRectString(rect: CustomRect) : string {
    return `(${rect.x1}, ${rect.y1}) -> (${rect.x2}, ${rect.y2})`;
}

export function findIntersectionInXLeft(minX: number, children: CustomRect[]) : CustomRect[] {
    return children.filter(child => child.x1 === minX);
}

export function findIntersectionInXRight(maxX: number, children: CustomRect[]) : CustomRect[] {
    return children.filter(child => child.x2 === maxX);
}

export function findIntersectionInYTop(minY: number, children: CustomRect[]) : CustomRect[] {
    return children.filter(child => child.y1 === minY);
}


export function findIntersectionInYBottom(maxY: number, children: CustomRect[]) : CustomRect[] {
    return children.filter(child => child.y2 === maxY);
}

export function isEqual(rectToCompare: CustomRect, rectCompared: CustomRect): boolean {
    return rectToCompare.x1 === rectCompared.x1 &&
      rectToCompare.x2 === rectCompared.x2 &&
      rectToCompare.y1 === rectCompared.y1 &&
      rectToCompare.y2 === rectCompared.y2
}


export function filterWithRest(rects: CustomRect[], predicate: Function) : [CustomRect[], CustomRect[]] {
    const rectsMatchingCondition = rects.filter(rect => predicate(rect));
    const rectsNotMatchingCondition = rects.filter(rect => !predicate(rect));
    return [rectsMatchingCondition, rectsNotMatchingCondition];
}

function fromRectToVolume(rectOrigin: CustomRect, z1: number, z2: number) : CustomRect3D {
    return {
        ...rectOrigin,
        z1,
        z2,
    }
}


function fromRectToVolumes(rectOrigin: CustomRect, linesCutting: Line[], maxCoord: number) : CustomRect3D[] {
    const direction = linesCutting[0].direction;

    const sortLines = sortBy(linesCutting, 'coord');
    const min = {direction, coord: 0};
    const max = {direction, coord: maxCoord };
    const sortLinesPlusExtremun : Line[] = [min, ...sortLines, max];
    
    let customRects3D : CustomRect3D[] = [];
    for(let i=0; i < (sortLinesPlusExtremun.length/2); i++) {
        customRects3D.push(
            fromRectToVolume(
                rectOrigin,
                sortLinesPlusExtremun[i].coord,
                sortLinesPlusExtremun[i + 1].coord
            )
        );
    }
    return customRects3D;
}

export function fromRectsToVolumes(rectsOrigin: CustomRect[], linesCutting: Line[], width: number, height: number) :CustomRect3D[] {
    const max = linesCutting[0].direction === "vertical" ? width : height;
    const customRect3DArray = rectsOrigin.map(rectOrigin => {
        return fromRectToVolumes(rectOrigin, linesCutting, max);
    });

    return flatten(customRect3DArray);
}
