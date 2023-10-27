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

export interface CustomRect3DData {
  rects: CustomRect3D[];
  rotation: [number, number, number];
}


interface Point {
    x: number;
    y: number;
}

export interface Segment {
    firstPoint: Point;
    lastPoint: Point;
    direction: "vertical" | "horizontal";
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

export function fromRectToVolumeVertical(rectOrigin: CustomRect, verticalSegments: Segment[], maxHeight: number, maxWidth: number): CustomRect3D[] {
    const direction = "vertical";
    const sortSegments = sortBy(verticalSegments, 'firstPoint.x');

    const min: Segment = {direction, firstPoint: { x: 0, y: 0}, lastPoint: { x: -1, y: -1 }};
    const max: Segment = {direction, firstPoint: { x: maxWidth, y: maxHeight }, lastPoint: { x: -1, y: -1 } };
    const sortSegmentPlusExtremums : Segment[] = [min, ...sortSegments, max];

    let customRects3D : CustomRect3D[] = [];
    for(let i=0; i < (sortSegmentPlusExtremums.length - 1); i++) {
        const coordMin = sortSegmentPlusExtremums[i].firstPoint.x;
        const coordMax = sortSegmentPlusExtremums[i+1].firstPoint.x;
        customRects3D.push(
            fromRectToVolume(
                rectOrigin,
                coordMin,
                coordMax
            )
        );
    }
    return customRects3D;
}

export function fromRectToVolumeHorizontal(rectOrigin: CustomRect, horizontalSegments: Segment[], maxHeight: number, maxWidth: number): CustomRect3D[] {
    const direction = "horizontal";
    const sortSegments = sortBy(horizontalSegments, 'firstPoint.y');

    const min: Segment = {direction, firstPoint: { x: 0, y: 0}, lastPoint: { x: -1, y: -1 }};
    const max: Segment = {direction, firstPoint: { x: maxWidth, y: maxHeight }, lastPoint: { x: -1, y: -1 } };
    const sortSegmentPlusExtremums : Segment[] = [min, ...sortSegments, max];

    let customRects3D : CustomRect3D[] = [];
    for(let i=0; i < (sortSegmentPlusExtremums.length - 1); i++) {
        const coordMin = sortSegmentPlusExtremums[i].firstPoint.y;
        const coordMax = sortSegmentPlusExtremums[i+1].firstPoint.y;
        customRects3D.push(
            fromRectToVolume(
                rectOrigin,
                coordMin,
                coordMax
            )
        );
    }
    return customRects3D;
}

/*
export function fromRectsToVolumes(rectsOrigin: CustomRect[], segments: Segment[], width: number, height: number) :CustomRect3D[] {
    const max = segments[0].direction === "vertical" ? width : height;
    const customRect3DArray = rectsOrigin.map(rectOrigin => {
        return fromRectToVolumes(rectOrigin, segments, max);
    });

    return flatten(customRect3DArray);
}
*/