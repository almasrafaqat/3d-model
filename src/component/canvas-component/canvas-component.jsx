import { Canvas } from '@react-three/fiber'
import  { Suspense } from 'react'
import ExpericePoloShirt from '../experience-models/experience-polo-shirt'

const CanvasComponent = () => {
  return (
    <Canvas camera={{ fov: 40 }}>
      <Suspense fallback={"Loading..."}>
        <ExpericePoloShirt />
      </Suspense>
    </Canvas>
  )
}

export default CanvasComponent