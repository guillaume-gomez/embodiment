import { useState } from "react";
import Select from "./Select";
import Range from "./Range";
import selectAxisIcon from "/iconmonstr-crop-3.svg";
import cutIcon from "/iconmonstr-crop-2.svg";


interface CutInActionFormProps {
  onChange: (axis: string, coord: number) => void;
  maxCoords: [number, number, number];
}

function CutInActionForm({ onChange, maxCoords } : CutInActionFormProps) {
  const [axis, setAxis] = useState<"X"|"Y"|"Z">("X");
  const [coord, setCoord] = useState<number>(0);

  function maxCoord() {
    if(axis === "Y") {
      return maxCoords[1];
    }
    if(axis === "Z") {
      return maxCoords[2];
    }
    return maxCoords[0];
  }

  return (
    <div className="flex flex-col gap-2 justify-center bg-neutral p-2 rounded">
      <Select
        label={"Axis cut"}
        svgIcon={selectAxisIcon}
        value={axis}
        onChange={(value) => setAxis(value)}
        options={[{label: "X", value: "X"}, {label: "Y", value: "Y"}, {label: "Z", value: "Z"}]}
      />
      <Range
        label="Coord"
        svgIcon={cutIcon}
        value={coord}
        step={1}
        min={0}
        max={maxCoord()}
        onChange={(value) => setCoord(value)}
      />
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => {
        onChange(axis, coord);
        setCoord(0);
        setAxis("X");
      }}>
        Cut
      </button>
    </div>
  )

}

export default CutInActionForm;
