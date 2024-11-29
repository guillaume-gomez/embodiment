import { forwardRef, ReactElement, useImperativeHandle } from 'react';
import {  useBounds } from '@react-three/drei';

export interface ExternalActionInterface {
  recenter: () => void ;
}

interface ShapeBoundsProps {
  children: ReactElement;
}


const ShapeBounds = forwardRef<ExternalActionInterface, ShapeBoundsProps>(({ children }, ref) => {
  const api = useBounds();

  useImperativeHandle(ref, () => ({
    recenter() {
      api.refresh().fit();
    }
  }));

  return (
    <group ref={ref as any}>
      {children}
    </group>
  )
});

export default ShapeBounds;