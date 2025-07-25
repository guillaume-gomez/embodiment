interface RangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  float?: boolean;
  svgIcon: string;
  snap: number
}

function camelize(str: string) : string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function Range({label, min, max, value, step = 1, onChange, float= false, svgIcon, snap = 1 } : RangeProps ) {
  return (
    <div className="form-control gap-1">
      <span className="label-text flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-1 justify-center items-center">
            <img src={svgIcon} alt={label} />  {label}
          </div>
          <span className="font-bold">( {value} )</span>
      </span>
      <input
        className="range range-accent"
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(event) =>  {
          if(float) {
            onChange(parseFloat(event.target.value));
          } else {
            onChange(parseInt(event.target.value));
          }
        }}
        list={`my-snap-${camelize(label)}`}
        />
        <datalist id={`my-snap-${camelize(label)}`}>
          <option value={snap} />
        </datalist>
    </div>
  )
}

export default Range;