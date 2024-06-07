import * as THREE from "three";
import { colorPalette } from "../data";
export const commonSettings = (posX, posY, rotX, rotY, rotZ) => ({
  position: new THREE.Vector3(posX, posY, 0),
  rotation: new THREE.Euler(
    THREE.MathUtils.degToRad(rotX),
    THREE.MathUtils.degToRad(rotY),
    THREE.MathUtils.degToRad(rotZ),
  ),
});




export const createImageProperties = (prefix, defaults = {},) => {

  return {
    [`Show${prefix}`]: { value: true, onChange: defaults[`${prefix}ShowOnChange`] },
    [`${prefix}`]: {
      image: defaults[`${prefix}`] ?? "",
      onChange: defaults[`${prefix}ImageOnChange`]
    },
    [`${prefix}Color`]: {
      value: defaults[`${prefix}Color`] ?? colorPalette["White"],
      options: colorPalette,
      onChange: defaults[`${prefix}ColorOnChange`]
    },
  };
};


export const createTextureMaterial = (texture, fabric, color) => {
  const textureMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    color: color,
    normalMap: fabric.normalMap,
    roughnessMap: fabric.roughnessMap,
    aoMap: fabric.aoMap,
  });
  return textureMaterial;
}


export const applyTextureMaterial = (material, gradientTexture,  color, normalMap, roughness, aoMap, gradientOffset, gradientRepeat, offset, repeat) => {

  material.map =  gradientTexture;
  material.normalMap = normalMap;
  material.roughness = roughness;
  material.aoMap = aoMap;
  material.color.set(color);
  material.normalScale = new THREE.Vector2(0.5, 0.5);
  material.metalness = 0.1;
  material.roughness = 0.6;

  if (gradientTexture) {
    gradientTexture.offset.set(gradientOffset.x, gradientOffset.y);
    gradientTexture.repeat.set(gradientRepeat.x, gradientRepeat.y);
   
  }


  material.needsUpdate = true;
}

export const createTextureOnChanges = (prefix, onChange, defaults = {}) => {
  return {
    [`${prefix}`]: { value: defaults[`${prefix}`] ?? true, onChange: onChange },

  }
}
export const createTextureOffset = (prefix, defaults = {}) => {
  return {
    [`${prefix}X`]: {
      value: defaults[`${prefix}X`] ?? 0.1,
      min: defaults[`${prefix}XMin`] ?? -5,
      max: defaults[`${prefix}XMax`] ?? 5,
      step: defaults[`${prefix}XStep`] ?? 0.01
    },
    [`${prefix}Y`]: {
      value: defaults[`${prefix}Y`] ?? 0.1,
      min: defaults[`${prefix}YMin`] ?? -5,
      max: defaults[`${prefix}YMax`] ?? 5,
      step: defaults[`${prefix}YStep`] ?? 0.01
    },

  }
};

export const createTextureRepeate = (prefix, defaults = {}) => {
  return {
    [`${prefix}X`]: {
      value: defaults[`${prefix}X`] ?? 1,
      min: defaults[`${prefix}XMin`] ?? 1,
      max: defaults[`${prefix}XMax`] ?? 10,
      step: defaults[`${prefix}XStep`] ?? 0.1
    },
    [`${prefix}Y`]: {
      value: defaults[`${prefix}Y`] ?? 1,
      min: defaults[`${prefix}YMin`] ?? 1,
      max: defaults[`${prefix}YMax`] ?? 10,
      step: defaults[`${prefix}YStep`] ?? 0.1
    },
  }
}
export const createDefaultMaterial = (fabric, color) => {
  return new THREE.MeshStandardMaterial({
    color: color,
    normalMap: fabric.normalMap,
    roughnessMap: fabric.roughnessMap,
    aoMap: fabric.aoMap,
  });
};

export const createTextStroke = (prefix, defaults = {}) => {
  return {
    [`${prefix}Show`]: true,
    [`${prefix}Color`]: {
      value: defaults[`${prefix}Color`] ?? colorPalette["White"],
      options: colorPalette
    },
    [`${prefix}Width`]: {
      value: defaults[`${prefix}Width`] ?? 5,
      min: 0,
      max: 20,
      step: 1
    }

  }
};
export const createTextControl = (prefix, defaults = {}) => ({
  [`Show${prefix}`]: true,
  [`${prefix}Text`]: defaults[`${prefix}Value`] ?? '',
});

export const createTextColorControl = (prefix) => ({
  [`${prefix}Color`]: {
    value: colorPalette["Black"],
    options: colorPalette
  }
});

export const createTextFontSizeControl = (prefix, defaults = {}) => ({
  [`${prefix}FontSize`]: {
    value: defaults[`${prefix}FontSizeValue`] ?? 64,
    min: 16,
    max: 400,
    step: 8
  }
});

export const createTextFontFamilyControl = (prefix) => ({
  [`${prefix}FontFamily`]: {
    value: 'Arial',
    options: [
      'Oswald',
      'Oswald-Bold',
      'KellySlab',
      'Monoton',
      'ChakraPetch',
      'RubikMoonrocks',
      'DancingScript',
      'OleoScript',
      'Pacifico',
      'Montserrat',
      'Jaro',
      'Roboto',
      'Poppins',
      'Danfo',
      'OpenSans',
      'PoetsenOne'
    ]
  }
})

/**Text Properties not being used */
export const createTextProperties = (prefix, defaultProperties = {}, onChange = () => { }) => ({
  [`${prefix}Show`]: true,
  [`${prefix}Text`]: {
    value: defaultProperties[`${prefix}Text`] ?? "NRE",
    onChange: onChange
  },
  [`${prefix}Color`]: {
    value: defaultProperties[`${prefix}Color`] ?? colorPalette["White"],
    options: colorPalette,
    onChange: onChange
  },
  [`${prefix}FontSize`]: {
    value: defaultProperties[`${prefix}FontSize`] ?? 304,
    min: defaultProperties[`${prefix}FontSizeMin`] ?? 16,
    max: defaultProperties[`${prefix}FontSizeMax`] ?? 400,
    step: defaultProperties[`${prefix}FontSizeStep`] ?? 8,
    onChange: onChange
  },
  [`${prefix}FontFamily`]: {
    value: defaultProperties[`${prefix}FontFamily`] ?? "Arial",
    options: [
      'Oswald',
      'Oswald-Bold',
      'KellySlab',
      'Monoton',
      'ChakraPetch',
      'RubikMoonrocks',
      'DancingScript',
      'OleoScript',
      'Pacifico',
      'Montserrat',
      'Jaro',
      'Roboto',
      'Poppins',
      'Danfo',
      'OpenSans',
      'PoetsenOne'
    ],
    onChange: onChange
  }
});
export const createRotation = (prefix, defaults = {}, isFront) => {

  return {
    [`${prefix}PositionX`]: {
      value: defaults[`${prefix}PositionX`] ?? 0,
      min: defaults[`${prefix}PositionXMin`] ?? -0.15,
      max: defaults[`${prefix}PositionXMax`] ?? 0.15,
      step: defaults[`${prefix}PositionXStep`] ?? 0.01
    },
    [`${prefix}PositionY`]: {
      value: defaults[`${prefix}PositionY`] ?? 0.44,
      min: defaults[`${prefix}PositionYMin`] ?? 0.0,
      max: defaults[`${prefix}PositionYMax`] ?? 0.65,
      step: defaults[`${prefix}PositionYStep`] ?? 0.01
    },
    [`${prefix}Scale`]: {
      value: defaults[`${prefix}Scale`] ?? 0.2,
      min: defaults[`${prefix}ScaleMin`] ?? 0.1,
      max: defaults[`${prefix}ScaleMax`] ?? 1,
      step: defaults[`${prefix}ScaleStep`] ?? 0.01
    },
    [`${prefix}RotationX`]: {
      value: defaults[`${prefix}RotationX`] ?? 0,
      min: defaults[`${prefix}RotationXMin`] ?? -180,
      max: defaults[`${prefix}RotationXMax`] ?? 180,
      step: defaults[`${prefix}RotationXStep`] ?? 1
    },
    [`${prefix}RotationY`]: {
      value: defaults[`${prefix}RotationY`] ?? (isFront ? 0 : 180),
      min: defaults[`${prefix}RotationYMin`] ?? -180,
      max: defaults[`${prefix}RotationYMax`] ?? 180,
      step: defaults[`${prefix}RotationYStep`] ?? 1
    },
    [`${prefix}RotationZ`]: {
      value: defaults[`${prefix}RotationZ`] ?? 0,
      min: defaults[`${prefix}RotationZMin`] ?? -180,
      max: defaults[`${prefix}RotationMax`] ?? 180,
      step: defaults[`${prefix}RotationZStep`] ?? 1
    }
  }
};

export const createTextTexture = (
  text,
  color,
  fontsize,
  fontFamily,
  outerBorderColor = 'red',
  outerBorderWidth = 10
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, size, size);

  context.font = `900 ${fontsize}px ${fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineWidth = outerBorderWidth;
  context.strokeStyle = outerBorderColor;
  context.strokeText(text, size / 2, size / 2);

  context.fillStyle = color;
  context.fillText(text, size / 2, size / 2);
  return new THREE.CanvasTexture(canvas);
};