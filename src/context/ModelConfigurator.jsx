import  { createContext, useContext, useState } from "react";
import { colorPalette } from "../data";

const ModelConfiguratorContext = createContext();

export const ModelConfiguratorProvider = (props) => {
  const [material, setMaterial] = useState('leather');
  const [shirtBaseColor, setShirtBaseColor] = useState(colorPalette["White"]);
  const [collarBaseColor, setCollarBaseColor] = useState(colorPalette["White"]);
  const [sleeveBaseColor, setSleeveBaseColor] = useState(colorPalette["White"]);
  const [sleeveStripeBaseColor, setSleeveStripeBaseColor] = useState(colorPalette["White"]);

  const ObjectStates = () => {
    const [showObject, setShowObject] = useState(false);
    const [objectColor, setObjectColor] = useState(colorPalette["White"]);
    const [addObject, setAddObject] = useState('');
    const [loadObject, setLoadObject] = useState('');
    const [showFrontObject, setFrontObject] = useState(true);
    const [showBackObject, setBackObject] = useState(true);
    const [showSleeveObject, setSleeveObject] = useState(false);
    const [showCollarObject, setCollarObject] = useState(false);
    const [objectPosition, setObjectPosition] = useState([0, 0, 0]);

    const objectStateSetters = {
      Show: setShowObject,
      Color: setObjectColor,
      Add: setAddObject,
      Load: setLoadObject,
      Front: setFrontObject,
      Back: setBackObject,
      Sleeve: setSleeveObject,
      Collar: setCollarObject,
      Position: setObjectPosition,
    }
    const showObjectStates = {
      Show: showObject,
      Color: objectColor,
      Add: addObject,
      Load: loadObject,
      Front: showFrontObject,
      Back: showBackObject,
      Sleeve: showSleeveObject,
      Collar: showCollarObject,
      Position: objectPosition,
    }
    return {
      showObjectStates, objectStateSetters
    }
  }

  const TextureStates = () => {
    const [showTexture, setShowTexture] = useState(false);
    const [textureColor, setTextureColor] = useState(colorPalette["White"]);
    const [addTexture, setAddTexture] = useState('');
    const [loadTexture, setLoadTexture] = useState('');
    const [showFrontTexture, setFrontTexture] = useState(true);
    const [showBackTexture, setBackTexture] = useState(true);
    const [showSleeveTexture, setSleeveTexture] = useState(false);
    const [showCollarTexture, setCollarTexture] = useState(false);
    const [texturePosition, setTexturePosition] = useState([0, 0, 0]);

    const textureStateSetters = {
      Show: setShowTexture,
      Color: setTextureColor,
      Add: setAddTexture,
      Load: setLoadTexture,
      Front: setFrontTexture,
      Back: setBackTexture,
      Sleeve: setSleeveTexture,
      Collar: setCollarTexture,
      Position: setTexturePosition,
    };
    const showTextureStates = {
      Show: showTexture,
      Color: textureColor,
      Add: addTexture,
      Load: loadTexture,
      Front: showFrontTexture,
      Back: showBackTexture,
      Sleeve: showSleeveTexture,
      Collar: showCollarTexture,
      Position: texturePosition,
    }
    return {
      showTextureStates,
      textureStateSetters
    }
  }

  const GradientStates = () => {

    const [showGradient, setShowGradient] = useState(false);
    const [gradientColor, setGradientColor] = useState(colorPalette["White"]);
    const [addGradient, setAddGradient] = useState('');
    const [loadGradient, setLoadGradient] = useState('');
    const [showFrontGradient, setFrontGradient] = useState(true);
    const [showBackGradient, setBackGradient] = useState(true);
    const [showSleeveGradient, setSleeveGradient] = useState(false);
    const [showCollarGradient, setCollarGradient] = useState(false);
    const [gradientPosition, setGradientPosition] = useState([0, 0, 0]);

    const gradientStateSetters = {
      Show: setShowGradient,
      Color: setGradientColor,
      Add: setAddGradient,
      Load: setLoadGradient,
      Front: setFrontGradient,
      Back: setBackGradient,
      Sleeve: setSleeveGradient,
      Collar: setCollarGradient,
      Position: setGradientPosition,
    };
    const showGradientStates = {
      Show: showGradient,
      Color: gradientColor,
      Add: addGradient,
      Load: loadGradient,
      Front: showFrontGradient,
      Back: showBackGradient,
      Sleeve: showSleeveGradient,
      Collar: showCollarGradient,
      Position: gradientPosition,
    }

    return { gradientStateSetters, showGradientStates };
  }

  const parseValue = {
    material,
    setMaterial,
    shirtBaseColor,
    setShirtBaseColor,
    collarBaseColor,
    setCollarBaseColor,
    sleeveBaseColor,
    setSleeveBaseColor,
    sleeveStripeBaseColor,
    setSleeveStripeBaseColor,
    TextureStates,
    GradientStates,
    ObjectStates,
  };

  return (
    <ModelConfiguratorContext.Provider value={parseValue}>
      {props.children}
    </ModelConfiguratorContext.Provider>
  );
}

export const useModelConfigurator = () => {
  const context = useContext(ModelConfiguratorContext);
  return context;
}