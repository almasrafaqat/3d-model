import { Environment, OrbitControls } from '@react-three/drei'
import  { useEffect, useRef } from 'react'
import PoloShirtModel from '../3D-model/polo-shirt-model'
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';


const ExpericePoloShirt = () => {

  const { camera, scene } = useThree();  // Access the Three.js scene and camera
  const controlsRef = useRef();

  const adjustCamera = (side) => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2.5));
    cameraZ *= 1.1; // Slightly away from the model

    switch (side) {
      case 'FrontSide':
        camera.position.set(center.x, center.y, center.z + cameraZ);
        break;
      case 'BackSide':
        camera.position.set(center.x, center.y, center.z - cameraZ);
        break;
      case 'Right':
        camera.position.set(center.x + cameraZ, center.y, center.z);
        break;
      case 'Left':
        camera.position.set(center.x - cameraZ, center.y, center.z);
        break;
    }

    controlsRef.current.target = center;
    controlsRef.current.update();
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  };


  useEffect(() => {
    adjustCamera('FrontSide'); // Default view
  }, [scene]);

  return (
    <>
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        ref={controlsRef}
      />
      <PoloShirtModel />
      <Environment preset='city' />
    </>
  )
}

export default ExpericePoloShirt