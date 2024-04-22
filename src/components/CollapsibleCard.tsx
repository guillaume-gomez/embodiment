import { ReactNode, useState } from "react";

interface CollapsibleCardProps {
  children: ReactNode;
  label: string
}

function CollapsibleCard({ label, children }: CollapsibleCardProps) {
  const [collapse, setCollapse] = useState<boolean>(false);

  function computeTitle() {
    if(collapse) {
      return (<button className="btn btn-primary" onClick={() => setCollapse(!collapse)}> X </button>);
    }

    return (
      <>
        <span>{label}</span>
        <button className="btn btn-primary" onClick={() => setCollapse(!collapse)}> X </button>
      </>
    )
  }

  return (
      <div className="card bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title font-regular text-3xl">
           {computeTitle()}
          </h2>
          
          { !collapse && children}
        </div>
      </div>
    );
}

export default CollapsibleCard;
