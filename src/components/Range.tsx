
interface RangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  float?: boolean;
}

function Range({label, min, max, value, step = 1, onChange, float= false }) {
  return (
    <div className="form-control">
      <span className="label-text">
          {label} - <span className="font-bold">({value})</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        className="range"
        onChange={(event) =>  {
          if(float) {
            onChange(parseFloat(event.target.value));
          } else {
            onChange(parseInt(event.target.value));
          }
        }} />
    </div>
  )
}

export default Range