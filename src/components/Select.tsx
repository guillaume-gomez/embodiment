
interface OptionData {
  label: string;
  value: any;
}

interface SelectProps {
  label: string;
  value: any;
  options: OptionData[];
  onChange: (value: any) => void;
}

function Select({label, value, options, onChange } : SelectProps) {
  return (
    <div className="form-control">
      <span className="label-text">{label}</span>
      <select
        className="select select-secondary select-bordered w-full max-w-xs"
        value={value}
        onChange={(e) =>onChange(e.target.value) }
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