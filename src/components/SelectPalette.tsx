import { useState } from "react";
import wireframeIcon from "/iconmonstr-cube-6.svg";
import { Palette } from "../hooks/use3DMondrian";

interface OptionData {
  palette: Palette;
  value: number;
}

interface SelectPaletteProps {
  value: number;
  options: OptionData[];
  onChange: (value: number) => void;
}

function SelectPalette({value, options, onChange } : SelectPaletteProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <span className="label-text flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-1 justify-center items-center">
          <img src={wireframeIcon} alt='palette' />  Palette
        </div>
      </span>

      <div className={`dropdown dropdown-left`}>
        <div tabIndex={0} role="button" className="btn btn-sm btn-accent btn-outline text-white" onClick={()=> setOpen(!open)}>
        select
        </div>
        <ul
          tabIndex={0}
          className="flex flex-col gap-2 menu dropdown-content bg-base-100 w-52 h-52 flex-nowrap rounded-box z-[1] p-2 shadow overflow-auto"
          role="menu"
        >
          <li><a onClick={() => onChange(-1)}>No palette</a></li>
          {
            options.map(({palette, value: colorValue }) =>
              <li onClick={() => onChange(colorValue)} className={ value === colorValue ? 'border border-secondary rounded' : '' }>
                <a className="w-full flex flex-row gap-0" style={{height: 20, width: "100%"}}>{
                  palette.map(color => <div style={{width: `${100/6}%`, height: 20, background: color}}></div>)
                  }
                </a>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default SelectPalette;