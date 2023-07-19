export interface CustomRect{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
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

export function centerRect(rect : CustomRect) : [number, number] {
    return [ widthRect(rect)/ 2, heightRect(rect) / 2 ];
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