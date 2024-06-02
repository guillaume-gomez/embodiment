import { ReactNode } from "react";

interface CardBaseProps {
  title: string | ReactNode;
  children: ReactNode;
  bgColor?: string
  titleClass?: string
}

function CardBase({ title, children, bgColor = "bg-base-300", titleClass="card-title font-regular text-3xl" } : CardBaseProps) {
  return (
    <div className={`card ${bgColor} shadow-xl h-full`}>
      <div className="card-body p-4">
        <h2 className={titleClass}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default CardBase;