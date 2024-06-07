import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from "three";
import { useModelConfigurator } from '../../context/ModelConfigurator';
import { button, folder, useControls } from 'leva';
import { colorPalette } from '../../data';
import {
  applyTextureMaterial,
  commonSettings,
  createImageProperties,
  createRotation,
  createTextColorControl,
  createTextControl,
  createTextFontFamilyControl,
  createTextFontSizeControl,
  createTextStroke,
  createTextTexture,
  createTextureMaterial,
  createTextureOffset,
  createTextureOnChanges,
  createTextureRepeate,
} from '../../helper/modelSettings';

const PoloShirtModel = ({ props }) => {

  const { nodes, materials } = useGLTF('/models/polo-shirt.glb');
  const {
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
    GradientStates,
    TextureStates,
    ObjectStates,

  } = useModelConfigurator();

  const [customMaterial, setCustomMaterial] = useState({});
  const refFrontMesh = useRef();
  const refBackMesh = useRef();
  const refLeftSleeveMesh = useRef();
  const refRightSleeveMesh = useRef();
  const { showGradientStates, gradientStateSetters } = GradientStates();
  const { showTextureStates, textureStateSetters } = TextureStates();
  const { showObjectStates, objectStateSetters } = ObjectStates();

  const predefinedTextures = [
    '/textures/design/texture1.jpg',
    '/textures/design/texture2.png',
    '/textures/design/texture3.jpg',
    '/textures/design/texture4.png',
    '/textures/design/texture5.jpg',
    '/textures/design/texture6.png',
    '/textures/design/texture7.jpg',
    '/textures/design/texture8.png',
    '/textures/design/texture9.png',
    '/textures/design/texture10.png',
    '/textures/design/texture11.png',
    '/textures/design/texture12.png',
  ];

  const dynamicGradientStateSetters = (prefix, value) => {
    const setterFunction = gradientStateSetters[prefix];
    if (setterFunction) {
      setterFunction(value);
    }
  }
  const dynamicTextureStateSetters = (prefix, value) => {
    const setterFunction = textureStateSetters[prefix];
    if (setterFunction) {
      setterFunction(value);
    }
  }
  const dynamicObjectStateSetters = (prefix, value) => {
    const setterFunction = objectStateSetters[prefix];
    if (setterFunction) {
      setterFunction(value);
    }
  }

  /**Polyster */
  const { normalMap, roughnessMap, aoMap } = useTexture(
    {
      normalMap: '/textures/polyster/Fabric_polyester_001_normal.jpg',
      roughnessMap: '/textures/polyster/Fabric_polyester_001_roughness.jpg',
      aoMap: '/textures/polyster/Fabric_polyester_001_ambientOcclusion.jpg',
    },
    (textures) => {
      Object.values(textures).forEach((texture) => {
        texture.repeat.set(3, 3);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      });
    }
  );

  const polysterFabric = useMemo(
    () => ({ normalMap, roughnessMap, aoMap }),
    [normalMap, roughnessMap, aoMap]
  );

  const fabricOptions = () => {
    return {
      'Fabric': {
        value: 'polyster',
        options: ['polyster', 'default'],
        onChange: setMaterial

      }
    }
  };

  const baseColorOptions = () => {
    return {
      'Color': folder({
        'BaseColor': {
          value: shirtBaseColor,
          options: colorPalette,
          onChange: setShirtBaseColor
        },
        'CollarColor': {
          value: collarBaseColor,
          options: colorPalette,
          onChange: setCollarBaseColor
        },
        'SleeveColor': {
          value: sleeveBaseColor,
          options: colorPalette,
          onChange: setSleeveBaseColor
        },
        'StripeColor': {
          value: sleeveStripeBaseColor,
          options: colorPalette,
          onChange: setSleeveStripeBaseColor
        },
      }),

    };
  }

  const gradientOptions = useCallback((prefix) => {
    const getPrefixStates = (args, value) => {
      if (prefix === "Gradient") {
        return dynamicGradientStateSetters(args, value);
      }
    }
    return {
      [`${prefix}`]: folder({
        ...createTextureOnChanges(`Front${prefix}`, (value) => getPrefixStates("Front", value)),
        ...createTextureOnChanges(`Back${prefix}`, (value) => getPrefixStates("Back", value)),
        ...createTextureOnChanges(`Sleeve${prefix}`, (value) => getPrefixStates("Sleeve", value)),
        ...createTextureOnChanges(`Collar${prefix}`, (value) => getPrefixStates("Collar", value)),
        ...createImageProperties(`${prefix}`, {
          [`${prefix}ShowOnChange`]: (value) => getPrefixStates("Show", value),
          [`${prefix}ColorOnChange`]: (value) => getPrefixStates("Color", value),
          [`${prefix}ImageOnChange`]: (value) => getPrefixStates("Load", value),
        }),
        ...createTextureOffset("Offset"),
        ...createTextureRepeate("Repeat"),
        ...createRotation(`${prefix}`),
      })
    }
  }, [
    dynamicGradientStateSetters,
  ]);

  const textureOptions = useCallback((prefix) => {
    const getPrefixStates = (args, value) => {
      if (prefix === "Texture") {
        return dynamicTextureStateSetters(args, value);
      }
      if (prefix === "Object") {
        return dynamicObjectStateSetters(args, value);
      }
    }
    const handleImageSelection = (path) => {
      getPrefixStates("Load", path);
    }
    return {
      [`${prefix}`]: folder({
        ...createTextureOnChanges(`Front${prefix}`, (value) => getPrefixStates("Front", value)),
        ...createTextureOnChanges(`Back${prefix}`, (value) => getPrefixStates("Back", value)),
        ...createImageProperties(`${prefix}`, {
          [`${prefix}ShowOnChange`]: (value) => getPrefixStates("Show", value),
          [`${prefix}ColorOnChange`]: (value) => getPrefixStates("Color", value),
          [`${prefix}ImageOnChange`]: (value) => getPrefixStates("Load", value),
        }),
        [`${prefix}imageGallery`]: {
          value: '',
          options: predefinedTextures,
          onChange: (image) => handleImageSelection(image),
        },
        ...createRotation(`${prefix}`),
      }),
    }
  }, [dynamicTextureStateSetters, dynamicObjectStateSetters]);

  const getGradientOptions = useMemo(() => gradientOptions("Gradient"), [
    showGradientStates
  ]);

  const getTextureOptions = useMemo(() => textureOptions("Texture"), [showTextureStates]);
  const getObjectOptions = useMemo(() => textureOptions("Object"), [showObjectStates]);

  const [textureBranding, textureBrandingReset] = useControls("Texture-Branding", () => ({
    ...getGradientOptions,
    ...getTextureOptions,
    ...getObjectOptions,
  }));

  console.log('textureBranding', textureBranding);
  const getFabricOptions = useMemo(() => fabricOptions(), [material]);
  const getBaseColorsOptions = useMemo(() => baseColorOptions(), [
    shirtBaseColor,
    collarBaseColor,
    sleeveBaseColor,
    sleeveStripeBaseColor
  ]);



  const [fabricBranding, fabricReset] = useControls("Fabric-Branding", () => ({
    ...getFabricOptions,
  }));

  const [colorsBranding, colorReset] = useControls("Colors-Branding", () => ({
    ...getBaseColorsOptions,
    Reset: button(() => {
      colorReset({
        Fabric: 'polyster',
        BaseColor: colorPalette["White"],
        CollarColor: colorPalette["White"],
        SleeveColor: colorPalette["White"],
        StripeColor: colorPalette["White"],
      })
    })
  }));

  /**Uploading Gradient State */
  useEffect(() => {
    const textureLoad = new THREE.TextureLoader();
    textureLoad.load(
      showGradientStates.Load,
      (texture) => {
        gradientStateSetters.Add(texture)
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the texture:', error);
      }
    );
  }, [showGradientStates.Load]);

  /**Uploading Texture State */
  useEffect(() => {
    const textureLoad = new THREE.TextureLoader();
    textureLoad.load(
      showTextureStates.Load,
      (texture) => {
        textureStateSetters.Add(texture)
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the texture:', error);
      }
    );
  }, [showTextureStates.Load]);

  /**Uploading Object State */
  useEffect(() => {
    const textureLoad = new THREE.TextureLoader();
    textureLoad.load(
      showObjectStates.Load,
      (texture) => {
        objectStateSetters.Add(texture)
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the texture:', error);
      }
    );
  }, [showObjectStates.Load]);




  const getbrandingOptions = (isFront) => {
    return {

      'showLogo': true,
      'Logo': {
        image: '',
      },
      'LogoColor': {
        value: colorPalette["White"],
        options: colorPalette,
      },
      ...createRotation('Logo', {
        LogoPositionX: -0.08,
        LogoPositionY: 0.55,
        LogoScale: 0.11,

      }, isFront),
      'showSponsor': true,
      'Sponsor': {
        image: '',
      },
      'SponsorColor': {
        value: colorPalette["White"],
        options: colorPalette,
      },
      ...createRotation('Sponsor', {
        SponsorPositionX: 0.01,
        SponsorPositionY: 0.21,
        SponsorScale: 0.15,
      }, isFront),
      ...createTextControl("Name", { NameValue: 'TEAM NAME' }),
      ...createTextColorControl("Name"),
      ...createTextFontSizeControl("Name", {
        NameFontSizeValue: 70,
      }),
      ...createTextStroke("NameStroke"),
      ...createTextFontFamilyControl("Name"),
      ...createRotation('Name', {
        NameScale: 1,
      }, isFront),
      ...createTextControl("Number", { NumberValue: '23' }),
      ...createTextColorControl("Number"),
      ...createTextFontSizeControl("Number", {
        NumberFontSizeValue: 166,
      }),
      ...createTextStroke("NumberStroke"),
      ...createTextFontFamilyControl("Number"),
      ...createRotation('Number', {
        NumberScale: 1,
        NumberPositionY: 0.38,
      }, isFront),

    }
  };

  const frontBrandingOptions = useMemo(() => getbrandingOptions(true), [
  ]);
  const backBrandingOptions = useMemo(() => getbrandingOptions(false), []);

  const [frontBranding, frontSet] = useControls("FrontBranding", () => ({
    ...frontBrandingOptions,
    Reset: button(() => {
      frontSet({
        Logo: ''
      })
    })
  }));

  const [backBranding, backSet] = useControls("BackBranding", () => ({
    ...backBrandingOptions,
    Reset: button(() => {
      backSet({
        Logo: ''
      })
    })
  }));

  const getsleeveBranding = (type) => {

    const getLogoRotationY = () => {
      if (type == 'right') return -82;
      if (type == 'left') return 82;
    }
    const getNameRotationY = () => {
      if (type == 'right') return -82;
      if (type == 'left') return 82;
    }
    const getNumberRotationY = () => {
      if (type == 'right') return -82;
      if (type == 'left') return 82;
    }
    return {

      ...createImageProperties("Logo"),
      ...createRotation("Logo", {
        LogoPositionXMin: -0.50,
        LogoPositionXMax: 0.25,
        LogoPositionY: 0.58,
        LogoPositionYMin: 0.47,
        LogoPositionYMax: 0.65,
        LogoScale: 0.05,
        LogoScaleMin: 0.02,
        LogoScaleMax: 0.3,
        LogoRotationX: 180,
        LogoRotationY: getLogoRotationY(),
        LogoRotationZ: 180,
      }, type),
      ...createTextControl("Name", { NameValue: "TEAM NAME" }),
      ...createRotation("Name", {
        NamePositionX: 0.03,
        NamePositionXMin: -0.25,
        NamePositionXMax: 0.50,
        NamePositionY: 0.54,
        NamePositionYMin: 0.47,
        NamePositionYMax: 0.65,
        NameScale: 0.50,
        NameScaleMin: 0.02,
        NameScaleMax: 0.9,
        NameRotationX: 180,
        NameRotationY: getNameRotationY(),
        NameRotationZ: -180,
      }),
      ...createTextColorControl("Name"),
      ...createTextFontSizeControl("Name"),
      ...createTextStroke("NameStroke"),
      ...createTextFontFamilyControl("Name"),
      ...createTextControl("Number", { NumberValue: "23" }),
      ...createRotation("Number", {
        NumberPositionX: 0.03,
        NumberPositionXMin: -0.25,
        NumberPositionXMax: 0.50,
        NumberPositionY: 0.52,
        NumberPositionYMin: 0.47,
        NumberPositionYMax: 0.65,
        NumberScale: 0.50,
        NumberScaleMin: 0.02,
        NumberScaleMax: 0.9,
        NumberRotationX: 180,
        NumberRotationY: getNumberRotationY(),
        NumberRotationZ: -180,
      }),
      ...createTextColorControl("Number"),
      ...createTextFontSizeControl("Number"),
      ...createTextStroke("NumberStroke"),
      ...createTextFontFamilyControl("Number"),
    }
  };


  const leftSleeveBrandingOptions = useMemo(() => getsleeveBranding("left"), []);
  const rightsleeveBrandingOptions = useMemo(() => getsleeveBranding("right"), []);

  const [leftSleeveBranding, leftSet] = useControls("LeftSleeve", () => ({
    ...leftSleeveBrandingOptions,
    Reset: button(() => {
      leftSet({
        Sleeve: '',
        Name: '',
        Number: ''
      })
    })
  }));

  const [rightSleeveBranding, righttSet] = useControls("RightSleeve", () => ({
    ...rightsleeveBrandingOptions,
    Reset: button(() => {
      righttSet({
        Sleeve: '',
        Name: '',
        Number: ''
      })
    })
  }));

  /**Logos */
  const frontLogo = frontBranding.Logo ? frontBranding.Logo : '/assets/logo/nys1.png';
  const backLogo = backBranding.Logo ? backBranding.Logo : '/assets/logo/nys1.png';
  const leftSleeveLogo = leftSleeveBranding.Logo ? leftSleeveBranding.Logo : '/assets/logo/nys1.png';
  const rightSleeveLogo = rightSleeveBranding.Logo ? rightSleeveBranding.Logo : '/assets/logo/nys1.png';
  const frontSponsor = frontBranding.Sponsor ? frontBranding.Sponsor : '/assets/logo/nys1.png';
  const backSponsor = backBranding.Sponsor ? backBranding.Sponsor : '/assets/logo/nys1.png';
  const frontLogoTexture = useTexture(frontLogo);
  const backLogoTexture = useTexture(backLogo);
  const leftSleeveLogoTexture = useTexture(leftSleeveLogo);
  const rightSleeveLogoTexture = useTexture(rightSleeveLogo);
  const frontSponsorTexture = useTexture(frontSponsor);
  const backSponsorTexture = useTexture(backSponsor);

  /**Texts */
  const frontNameTextureMap = useMemo(() => {
    return createTextTexture(
      frontBranding.NameText,
      frontBranding.NameColor,
      frontBranding.NameFontSize,
      frontBranding.NameFontFamily,
      frontBranding.NameStrokeColor,
      frontBranding.NameStrokeWidth
    );
  }, [
    frontBranding.NameText,
    frontBranding.NameColor,
    frontBranding.NameFontSize,
    frontBranding.NameStrokeColor,
    frontBranding.NameStrokeWidth
  ]);

  const backNameTextureMap = useMemo(() => {
    return createTextTexture(
      backBranding.NameText,
      backBranding.NameColor,
      backBranding.NameFontSize,
      'serif',
      backBranding.NameStrokeColor,
      backBranding.NameStrokeWidth,
    );
  }, [
    backBranding.NameText,
    backBranding.NameColor,
    backBranding.NameFontSize,
    backBranding.NameStrokeColor,
    backBranding.NameStrokeWidth,
  ]
  );

  const leftSleeveNameTextureMap = useMemo(() => {
    return createTextTexture(
      leftSleeveBranding.NameText,
      leftSleeveBranding.NameColor,
      leftSleeveBranding.NameFontSize,
      'serif',
      leftSleeveBranding.NameStrokeColor,
      leftSleeveBranding.NameStrokeWidth,
    );
  }, [
    leftSleeveBranding.NameText,
    leftSleeveBranding.NameColor,
    leftSleeveBranding.NameFontSize,
    leftSleeveBranding.NameStrokeColor,
    leftSleeveBranding.NameStrokeWidth,
  ]);

  const leftSleeveNumberTextureMap = useMemo(() => {
    return createTextTexture(
      leftSleeveBranding.NumberText,
      leftSleeveBranding.NumberColor,
      leftSleeveBranding.NumberFontSize,
      'serif',
      leftSleeveBranding.NumberStrokeColor,
      leftSleeveBranding.NumberStrokeWidth,
    );
  }, [
    leftSleeveBranding.NumberText,
    leftSleeveBranding.NumberColor,
    leftSleeveBranding.NumberFontSize,
    leftSleeveBranding.NumberStrokeColor,
    leftSleeveBranding.NumberStrokeWidth,
  ]);

  const rightSleeveNameTextureMap = useMemo(() => {
    return createTextTexture(
      rightSleeveBranding.NameText,
      rightSleeveBranding.NameColor,
      rightSleeveBranding.NameFontSize,
      'serif',
      rightSleeveBranding.NameStrokeColor,
      rightSleeveBranding.NameStrokeWidth,
    );
  }, [
    rightSleeveBranding.NameText,
    rightSleeveBranding.NameColor,
    rightSleeveBranding.NameFontSize,
    rightSleeveBranding.NameStrokeColor,
    rightSleeveBranding.NameStrokeWidth,
  ]);

  const rightSleeveNumberTextureMap = useMemo(() => {
    return createTextTexture(
      rightSleeveBranding.NumberText,
      rightSleeveBranding.NumberColor,
      rightSleeveBranding.NumberFontSize,
      'serif',
      rightSleeveBranding.NumberStrokeColor,
      rightSleeveBranding.NumberStrokeWidth,
    );
  }, [
    rightSleeveBranding.NumberText,
    rightSleeveBranding.NumberColor,
    rightSleeveBranding.NumberFontSize,
    rightSleeveBranding.NumberStrokeColor,
    rightSleeveBranding.NumberStrokeWidth,
  ]);

  const frontNumberTextureMap = useMemo(() => {
    return createTextTexture(
      frontBranding.NumberText,
      frontBranding.NumberColor,
      frontBranding.NumberFontSize,
      'serif',
      frontBranding.NumberStrokeColor,
      frontBranding.NumberStrokeWidth,
    );
  }, [
    frontBranding.NumberText,
    frontBranding.NumberColor,
    frontBranding.NumberFontSize,
    frontBranding.NumberStrokeColor,
    frontBranding.NumberStrokeWidth,
  ]);

  const backNumberTextureMap = useMemo(() => {
    return createTextTexture(
      backBranding.NumberText,
      backBranding.NumberColor,
      backBranding.NumberFontSize,
      'serif',
      backBranding.NumberStrokeColor,
      backBranding.NumberStrokeWidth,
    );
  }, [
    backBranding.NumberText,
    backBranding.NumberColor,
    backBranding.NumberFontSize,
    backBranding.NumberStrokeColor,
    backBranding.NumberStrokeWidth,
  ]);

  /**set the positions */
  const frontLogoSettings = commonSettings(
    frontBranding.LogoPositionX,
    frontBranding.LogoPositionY,
    frontBranding.LogoRotationX,
    frontBranding.LogoRotationY,
    frontBranding.LogoRotationZ
  );

  const textureSettings = commonSettings(
    textureBranding.TexturePositionX,
    textureBranding.TexturePositionY,
    textureBranding.TextureRotationX,
    textureBranding.TextureRotationY,
    textureBranding.TextureRotationZ
  );
  const objectSettings = commonSettings(
    textureBranding.ObjectPositionX,
    textureBranding.ObjectPositionY,
    textureBranding.ObjectRotationX,
    textureBranding.ObjectRotationY,
    textureBranding.ObjectRotationZ
  );


  const backLogoSettings = commonSettings(
    backBranding.LogoPositionX,
    backBranding.LogoPositionY,
    backBranding.LogoRotationX,
    backBranding.LogoRotationY,
    backBranding.LogoRotationZ
  );

  const leftSleeveLogoSettings = commonSettings(
    leftSleeveBranding.LogoPositionX,
    leftSleeveBranding.LogoPositionY,
    leftSleeveBranding.LogoRotationX,
    leftSleeveBranding.LogoRotationY,
    leftSleeveBranding.LogoRotationZ
  );

  const rightSleeveLogoSettings = commonSettings(
    rightSleeveBranding.LogoPositionX,
    rightSleeveBranding.LogoPositionY,
    rightSleeveBranding.LogoRotationX,
    rightSleeveBranding.LogoRotationY,
    rightSleeveBranding.LogoRotationZ
  );
  const frontSponsorSettings = commonSettings(
    frontBranding.SponsorPositionX,
    frontBranding.SponsorPositionY,
    frontBranding.SponsorRotationX,
    frontBranding.SponsorRotationY,
    frontBranding.SponsorRotationZ
  );

  const backSponsorSettings = commonSettings(
    backBranding.SponsorPositionX,
    backBranding.SponsorPositionY,
    backBranding.SponsorRotationX,
    backBranding.SponsorRotationY,
    backBranding.SponsorRotationZ
  );

  const frontNameSettings = commonSettings(
    frontBranding.NamePositionX,
    frontBranding.NamePositionY,
    frontBranding.NameRotationX,
    frontBranding.NameRotationY,
    frontBranding.NameRotationZ
  );

  const backNameSettings = commonSettings(
    backBranding.NamePositionX,
    backBranding.NamePositionY,
    backBranding.NameRotationX,
    backBranding.NameRotationY,
    backBranding.NameRotationZ
  );

  const leftSleeveNameSettings = commonSettings(
    leftSleeveBranding.NamePositionX,
    leftSleeveBranding.NamePositionY,
    leftSleeveBranding.NameRotationX,
    leftSleeveBranding.NameRotationY,
    leftSleeveBranding.NameRotationZ
  );

  const leftSleeveNumberSettings = commonSettings(
    leftSleeveBranding.NumberPositionX,
    leftSleeveBranding.NumberPositionY,
    leftSleeveBranding.NumberRotationX,
    leftSleeveBranding.NumberRotationY,
    leftSleeveBranding.NumberRotationZ
  );

  const rightSleeveNameSettings = commonSettings(
    rightSleeveBranding.NamePositionX,
    rightSleeveBranding.NamePositionY,
    rightSleeveBranding.NameRotationX,
    rightSleeveBranding.NameRotationY,
    rightSleeveBranding.NameRotationZ
  );

  const rightSleeveNumberSettings = commonSettings(
    rightSleeveBranding.NumberPositionX,
    rightSleeveBranding.NumberPositionY,
    rightSleeveBranding.NumberRotationX,
    rightSleeveBranding.NumberRotationY,
    rightSleeveBranding.NumberRotationZ
  );

  const frontNumberSettings = commonSettings(
    frontBranding.NumberPositionX,
    frontBranding.NumberPositionY,
    frontBranding.NumberRotationX,
    frontBranding.NumberRotationY,
    frontBranding.NumberRotationZ
  );

  const backNumberSettings = commonSettings(
    backBranding.NumberPositionX,
    backBranding.NumberPositionY,
    backBranding.NumberRotationX,
    backBranding.NumberRotationY,
    backBranding.NumberRotationZ
  );

  /**Assign Polyster/Default material */
  useEffect(() => {
    const mesh = materials['Polo Shirt'];
    if (material === 'polyster') {
      Object.assign(mesh, {
        normalMap: polysterFabric.normalMap,
        roughnessMap: polysterFabric.roughnessMap,
        aoMap: polysterFabric.aoMap,
        normalScale: new THREE.Vector2(0.5, 0.5),
        metalness: 0.1,
        roughness: 0.6,
      });
    } else {
      Object.assign(mesh, {
        map: null,
        normalMap: null,
        roughnessMap: null,
        aoMap: null,
      });
    }
    mesh.color.set("#FFFFFF");
    mesh.needsUpdate = true;
  }, [material, materials, polysterFabric]);

  /**Clone Materials */
  useEffect(() => {
    const createMaterial = {
      shirt: materials['Polo Shirt'].clone(),
      backShirt: materials['Polo Shirt'].clone(),
      collar: materials['Polo Shirt'].clone(),
      sleeve: materials['Polo Shirt'].clone(),
      sleeve_stripe: materials['Polo Shirt'].clone(),
    }
    setCustomMaterial(createMaterial);
  }, [material]);

  /**Set Color Mateial */
  useEffect(() => {
    if (customMaterial.shirt) customMaterial.shirt.color.set(shirtBaseColor);
    if (customMaterial.backShirt) customMaterial.backShirt.color.set(shirtBaseColor);
    if (customMaterial.collar) customMaterial.collar.color.set(collarBaseColor);
    if (customMaterial.sleeve) customMaterial.sleeve.color.set(sleeveBaseColor);
    if (customMaterial.sleeve_stripe) customMaterial.sleeve_stripe.color.set(sleeveStripeBaseColor);

  }, [
    shirtBaseColor,
    collarBaseColor,
    sleeveBaseColor,
    sleeveStripeBaseColor,
    showGradientStates.Add,
    showGradientStates.Load
  ]);

  /**Applying Texture */
  useEffect(() => {
    if (Object.keys(customMaterial).length === 0) return;
    const { shirt, backShirt, sleeve, collar, sleeve_stripe } = customMaterial;
    const updateMaterial = (material, gradientTexture, baseColor, gradientOffset, gradeientRepeat) => {
      applyTextureMaterial(
        material,
        gradientTexture,
        gradientTexture ? showGradientStates.Color : baseColor,
        polysterFabric.normalMap,
        polysterFabric.roughnessMap,
        polysterFabric.aoMap,
        gradientOffset,
        gradeientRepeat,
      );
    }

    const gradientOffset = { x: textureBranding.OffsetX, y: textureBranding.OffsetY };
    const gradeientRepeat = { x: textureBranding.RepeatX, y: textureBranding.RepeatY };

    if (showGradientStates.Load) {
      updateMaterial(
        shirt,
        showGradientStates.Front ? showGradientStates.Add : null,
        shirtBaseColor,
        gradientOffset,
        gradeientRepeat,
      );
      updateMaterial(
        backShirt,
        showGradientStates.Back ? showGradientStates.Add : null,
        shirtBaseColor,
        gradientOffset,
        gradeientRepeat,
      );
      updateMaterial(
        sleeve,
        showGradientStates.Sleeve ? showGradientStates.Add : null,
        sleeveBaseColor,
        gradientOffset,
        gradeientRepeat,
      );
      updateMaterial(
        collar,
        showGradientStates.Collar ? showGradientStates.Add : null,
        collarBaseColor,
        gradientOffset,
        gradeientRepeat,
      );
      updateMaterial(
        sleeve_stripe,
        showGradientStates.Sleeve ? showGradientStates.Add : null,
        sleeveStripeBaseColor,
        gradientOffset,
        gradeientRepeat,
      );
    }
  }, [
    showGradientStates.Load,
    showGradientStates.Add,
    polysterFabric,
    showGradientStates.Color,
    shirtBaseColor,
    collarBaseColor,
    sleeveBaseColor,
    sleeveStripeBaseColor,
    showGradientStates.Front,
    showGradientStates.Back,
    showGradientStates.Sleeve,
    showGradientStates.Collar,
    customMaterial,
    textureBranding.OffsetX,
    textureBranding.OffsetY,
    textureBranding.RepeatX,
    textureBranding.RepeatY,
  ]);


  return (
    <group rotation={[THREE.MathUtils.degToRad(15), 0, 0]} {...props} dispose={null}>
      <mesh
        ref={refFrontMesh}
        castShadow
        receiveShadow
        geometry={nodes.front.geometry}
        material={customMaterial.shirt}
      >
        {showTextureStates.Show && showTextureStates.Add &&
          <Decal
            map={showTextureStates.Add}
            position={textureSettings.position}
            rotation={textureSettings.rotation}
            scale={[textureBranding.TextureScale, textureBranding.TextureScale, 1]}
            material={createTextureMaterial(
              showTextureStates.Add,
              polysterFabric,
              showTextureStates.Color
            )}
            visible={showTextureStates.Front}
          />
        }
        {showObjectStates.Show && showObjectStates.Add &&
          <Decal
            map={showObjectStates.Add}
            position={objectSettings.position}
            rotation={objectSettings.rotation}
            scale={[textureBranding.ObjectScale, textureBranding.ObjectScale, 1]}
            material={createTextureMaterial(
              showObjectStates.Add,
              polysterFabric,
              showObjectStates.Color
            )}
            visible={showObjectStates.Front}
          />
        }

        <Decal
          map={frontSponsorTexture}
          position={frontSponsorSettings.position}
          rotation={frontSponsorSettings.rotation}
          scale={[frontBranding.SponsorScale, frontBranding.SponsorScale, 1]}
          material={createTextureMaterial(
            frontSponsorTexture,
            polysterFabric,
            frontBranding.SponsorColor
          )}
          visible={frontBranding.showSponsor}
        />
        <Decal
          map={frontLogoTexture}
          position={frontLogoSettings.position}
          rotation={frontLogoSettings.rotation}
          scale={[frontBranding.LogoScale, frontBranding.LogoScale, 1]}
          material={createTextureMaterial(
            frontLogoTexture,
            polysterFabric,
            frontBranding.LogoColor,
          )}
          visible={frontBranding.showLogo}

        />


        <Decal
          mesh={refFrontMesh.current}
          map={frontNameTextureMap}
          position={frontNameSettings.position}
          rotation={frontNameSettings.rotation}
          scale={[frontBranding.NameScale, frontBranding.NameScale, 1]}
          visible={frontBranding.ShowName}
        />
        <Decal
          mesh={refFrontMesh.current}
          map={frontNumberTextureMap}
          position={frontNumberSettings.position}
          rotation={frontNumberSettings.rotation}
          scale={[frontBranding.NumberScale, frontBranding.NumberScale, 1]}
          visible={frontBranding.ShowNumber}
        />

      </mesh>
      <mesh
        ref={refBackMesh}
        castShadow
        receiveShadow
        geometry={nodes.back.geometry}
        material={customMaterial.backShirt}
      >
        {showTextureStates.Show && showTextureStates.Add &&
          <Decal
            map={showTextureStates.Add}
            position={textureSettings.position}
            rotation={textureSettings.rotation}
            scale={[textureBranding.TextureScale, textureBranding.TextureScale, 1]}
            material={createTextureMaterial(
              showTextureStates.Add,
              polysterFabric,
              frontBranding.SponsorColor
            )}
            visible={showTextureStates.Back}
          />
        }
        <Decal
          map={backLogoTexture}
          position={backLogoSettings.position}
          rotation={backLogoSettings.rotation}
          scale={[backBranding.LogoScale, backBranding.LogoScale, 1]}
          material={new THREE.MeshStandardMaterial({
            color: backBranding.LogoColor,
            transparent: true
          })}
          visible={backBranding.showLogo}
        />
        <Decal
          map={backSponsorTexture}
          position={backSponsorSettings.position}
          rotation={backSponsorSettings.rotation}
          scale={[backBranding.SponsorScale, backBranding.SponsorScale, 1]}
          material={new THREE.MeshStandardMaterial({
            color: backBranding.SponsorColor,
            transparent: true
          })}
          visible={backBranding.showSponsor}
        />
        <Decal
          map={backNameTextureMap}
          position={backNameSettings.position}
          rotation={backNameSettings.rotation}
          scale={[backBranding.NameScale, backBranding.NameScale, 1]}
          visible={backBranding.ShowName}
        />
        <Decal
          map={backNumberTextureMap}
          position={backNumberSettings.position}
          rotation={backNumberSettings.rotation}
          scale={[backBranding.NumberScale, backBranding.NumberScale, 1]}
          visible={backBranding.ShowNumber}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.collar.geometry}
        material={customMaterial.collar}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.collar_back.geometry}
        material={customMaterial.collar}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.collar_button_thread.geometry}
        material={customMaterial.collar}
      />

      <mesh
        ref={refLeftSleeveMesh}
        castShadow
        receiveShadow
        geometry={nodes.left_sleeve.geometry}
        material={customMaterial.sleeve}
      >
        <Decal
          map={leftSleeveLogoTexture}
          position={leftSleeveLogoSettings.position}
          rotation={leftSleeveLogoSettings.rotation}
          scale={[leftSleeveBranding.LogoScale, leftSleeveBranding.LogoScale, 1]}
          material={new THREE.MeshStandardMaterial({
            color: leftSleeveBranding.LogoColor,
            transparent: true
          })}
          visible={leftSleeveBranding.showLogo}
        />
        <Decal
          map={leftSleeveNameTextureMap}
          position={leftSleeveNameSettings.position}
          rotation={leftSleeveNameSettings.rotation}
          scale={[leftSleeveBranding.NameScale, leftSleeveBranding.NameScale, 1]}
          visible={leftSleeveBranding.ShowName}
        />
        <Decal
          map={leftSleeveNumberTextureMap}
          position={leftSleeveNumberSettings.position}
          rotation={leftSleeveNumberSettings.rotation}
          scale={[leftSleeveBranding.NumberScale, leftSleeveBranding.NumberScale, 1]}
          visible={leftSleeveBranding.ShowNumber}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.left_sleeve_stripe.geometry}
        material={customMaterial.sleeve_stripe}
      />
      <mesh
        ref={refRightSleeveMesh}
        castShadow
        receiveShadow
        geometry={nodes.right_sleeve.geometry}
        material={customMaterial.sleeve}
      >

        <Decal
          map={rightSleeveLogoTexture}
          position={rightSleeveLogoSettings.position}
          rotation={rightSleeveLogoSettings.rotation}
          scale={[rightSleeveBranding.LogoScale, rightSleeveBranding.LogoScale, 1]}
          material={new THREE.MeshStandardMaterial({
            color: rightSleeveBranding.LogoColor,
            transparent: true
          })}
          visible={rightSleeveBranding.showLogo}
        />
        <Decal
          map={rightSleeveNameTextureMap}
          position={rightSleeveNameSettings.position}
          rotation={rightSleeveNameSettings.rotation}
          scale={[rightSleeveBranding.NameScale, rightSleeveBranding.NameScale, 1]}
          visible={rightSleeveBranding.ShowName}
        />
        <Decal
          map={rightSleeveNumberTextureMap}
          position={rightSleeveNumberSettings.position}
          rotation={rightSleeveNumberSettings.rotation}
          scale={[rightSleeveBranding.NumberScale, rightSleeveBranding.NumberScale, 1]}
          visible={rightSleeveBranding.ShowNumber}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.right_sleeve_stripe.geometry}
        material={customMaterial.sleeve_stripe}
      />

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.default004.geometry}
        material={customMaterial.shirt}
      />

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.default004_1.geometry}
        material={materials.Button}
      />
    </group>
  )
}

useGLTF.preload('/models/polo-shirt.glb')
export default PoloShirtModel