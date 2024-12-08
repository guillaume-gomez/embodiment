interface ToggleProps {
  label: string;
  value: boolean;
  toggle: () => void;
  svgIcon: string;
}

function Toggle({ label, value, toggle, svgIcon } : ToggleProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer px-0 gap-2">
        <span className="label-text flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-1 justify-center items-center">
            <img src={svgIcon} alt={label} />  {label}
          </div>
        </span>
        <input type="checkbox" className="toggle toggle-accent" checked={value} onChange={toggle} />
      </label>
    </div>
  );
}

export default Toggle;