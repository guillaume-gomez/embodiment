
interface OptionData {
  label: string;
  value: any;
}

interface SelectProps {
  label: string;
  value: any;
  options: OptionData[];
  onChange: (value: any) => void;
  svgIcon: string;
}

function Select({label, value, options, svgIcon, onChange } : SelectProps) {

  return (
    <div className="form-control gap-1">
      <span className="label-text flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-1 justify-center items-center">
          <img src={svgIcon} alt={label} />  {label}
        </div>
      </span>
      <select
        className="select select-accent"
        onChange={(e) =>onChange(e.target.value) }
        value={value}
      >
        {
          options.map(({label, value}) =>
            <option key={label} value={value}>{label}</option>
          )
        }
      </select>
    </div>
  )
}

export default Select;