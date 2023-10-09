import { CustomRect } from "../utils";
import BorderRect from "./BorderRect";

interface BordersProps {
  rects: CustomRect[];
  thickness: number;
  depth: number;
}

function Borders({rects, thickness, depth }: BordersProps) {
  return (
   <group
     position={[-0.5, 0.5, 0]}
   >
      { rects.map((rect, index) => <BorderRect key={index} rect={rect} thickness={thickness} depth={depth} />) }
   </group>
  )
}

export default Borders;