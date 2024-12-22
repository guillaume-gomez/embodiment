import { useState } from "react";
import Select from "./Select";
import Range from "./Range";

interface CutInActionFormProps {
  onChange: (axis: string, coord: number) => void;
  maxCoord: number
}

function CutInActionForm({ onChange, maxCoord } : CutInActionFormProps) {
  const [axis, setAxis] = useState<"X"|"Y"|"Z">("X");
  const [coord, setCoord] = useState<number>(0);
  return (
    <div>
      <Select
        label={"Axis cut"}
        svgIcon="cut-icon"
        value={axis}
        onChange={(value) => setAxis(value)}
        options={[{label: "X", value: "X"}, {label: "Y", value: "Y"}, {label: "Z", value: "Z"}]}
      />
      <Range
        label="Coord"
        svgIcon="coord-icon"
        value={coord}
        step={1}
        min={0}
        snap={0}
        max={maxCoord}
        onChange={(value) => setCoord(value)}
      />
      <button onClick={() => {
        onChange(axis, coord);
        setCoord(0);
        setAxis("X");
      }}>
        Cut emogi
      </button>
    </div>
  )

}

export default CutInActionForm;
