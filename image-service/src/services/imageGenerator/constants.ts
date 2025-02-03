import { Worlds } from '$shared/enums';
import { manyToOne } from '$shared/utils';

import perchBBack from '../../assets/ducks/perches/B/back.svg';
import perchBFront from '../../assets/ducks/perches/B/front.svg';
import perchBStyles from '../../assets/ducks/perches/B/styles.css';

import perchGBack from '../../assets/ducks/perches/G/back.svg';
import perchGFront from '../../assets/ducks/perches/G/front.svg';
import perchGStyles from '../../assets/ducks/perches/G/styles.css';

import perchRBack from '../../assets/ducks/perches/R/back.svg';
import perchRFront from '../../assets/ducks/perches/R/front.svg';
import perchRStyles from '../../assets/ducks/perches/R/styles.css';

import perchYBack from '../../assets/ducks/perches/Y/back.svg';
import perchYFront from '../../assets/ducks/perches/Y/front.svg';
import perchYStyles from '../../assets/ducks/perches/Y/styles.css';

import duckOnHeadA from '../../assets/ducks/parts/on-head/A.svg';
import duckOnHeadB from '../../assets/ducks/parts/on-head/B.svg';
import duckOnHeadC from '../../assets/ducks/parts/on-head/C.svg';
import duckOnHeadD from '../../assets/ducks/parts/on-head/D.svg';
import duckOnHeadE from '../../assets/ducks/parts/on-head/E.svg';
import duckOnHeadF from '../../assets/ducks/parts/on-head/F.svg';
import duckOnHeadG from '../../assets/ducks/parts/on-head/G.svg';
import duckOnHeadH from '../../assets/ducks/parts/on-head/H.svg';
import duckOnHeadI1 from '../../assets/ducks/parts/on-head/I1.svg';
import duckOnHeadI2 from '../../assets/ducks/parts/on-head/I2.svg';
import duckOnHeadK from '../../assets/ducks/parts/on-head/K.svg';
import duckOnHeadL from '../../assets/ducks/parts/on-head/L.svg';
import duckOnHeadM from '../../assets/ducks/parts/on-head/M.svg';
import duckOnHeadN from '../../assets/ducks/parts/on-head/N.svg';
import duckOnHeadO from '../../assets/ducks/parts/on-head/O.svg';
import duckOnHeadP from '../../assets/ducks/parts/on-head/P.svg';
import duckOnHeadS from '../../assets/ducks/parts/on-head/S.svg';
import duckOnHeadSUIT from '../../assets/ducks/parts/on-head/SUIT.svg';
import duckOnHeadT from '../../assets/ducks/parts/on-head/T.svg';
import duckOnHeadW from '../../assets/ducks/parts/on-head/W.svg';
import duckOnHeadZ from '../../assets/ducks/parts/on-head/Z.svg';

import duckEyebrowsA from '../../assets/ducks/parts/eyebrows/A.svg';
import duckEyebrowsB from '../../assets/ducks/parts/eyebrows/B.svg';
import duckEyebrowsC from '../../assets/ducks/parts/eyebrows/C.svg';
import duckEyebrowsD from '../../assets/ducks/parts/eyebrows/D.svg';
import duckEyebrowsE from '../../assets/ducks/parts/eyebrows/E.svg';
import duckEyebrowsF from '../../assets/ducks/parts/eyebrows/F.svg';
import duckEyebrowsG from '../../assets/ducks/parts/eyebrows/G.svg';
import duckEyebrowsH from '../../assets/ducks/parts/eyebrows/H.svg';
import duckEyebrowsI1 from '../../assets/ducks/parts/eyebrows/I1.svg';
import duckEyebrowsI2 from '../../assets/ducks/parts/eyebrows/I2.svg';
import duckEyebrowsK from '../../assets/ducks/parts/eyebrows/K.svg';
import duckEyebrowsL from '../../assets/ducks/parts/eyebrows/L.svg';
import duckEyebrowsM from '../../assets/ducks/parts/eyebrows/M.svg';
import duckEyebrowsN from '../../assets/ducks/parts/eyebrows/N.svg';
import duckEyebrowsO from '../../assets/ducks/parts/eyebrows/O.svg';
import duckEyebrowsP from '../../assets/ducks/parts/eyebrows/P.svg';
import duckEyebrowsW from '../../assets/ducks/parts/eyebrows/W.svg';
import duckEyebrowsZ from '../../assets/ducks/parts/eyebrows/Z.svg';

import duckEyesA from '../../assets/ducks/parts/eyes/A.svg';
import duckEyesB from '../../assets/ducks/parts/eyes/B.svg';
import duckEyesC from '../../assets/ducks/parts/eyes/C.svg';
import duckEyesD from '../../assets/ducks/parts/eyes/D.svg';
import duckEyesE from '../../assets/ducks/parts/eyes/E.svg';
import duckEyesF from '../../assets/ducks/parts/eyes/F.svg';
import duckEyesG from '../../assets/ducks/parts/eyes/G.svg';
import duckEyesH from '../../assets/ducks/parts/eyes/H.svg';
import duckEyesI1 from '../../assets/ducks/parts/eyes/I1.svg';
import duckEyesI2 from '../../assets/ducks/parts/eyes/I2.svg';
import duckEyesK from '../../assets/ducks/parts/eyes/K.svg';
import duckEyesL from '../../assets/ducks/parts/eyes/L.svg';
import duckEyesM from '../../assets/ducks/parts/eyes/M.svg';
import duckEyesN from '../../assets/ducks/parts/eyes/N.svg';
import duckEyesO from '../../assets/ducks/parts/eyes/O.svg';
import duckEyesP from '../../assets/ducks/parts/eyes/P.svg';
import duckEyesW from '../../assets/ducks/parts/eyes/W.svg';
import duckEyesZ from '../../assets/ducks/parts/eyes/Z.svg';

import duckBackgroundSUIT from '../../assets/ducks/parts/background/SUIT.svg';

import duckFirstLayerSUIT from '../../assets/ducks/parts/first-layer/SUIT.svg';

import duckBeakA from '../../assets/ducks/parts/beak/A.svg';
import duckBeakB from '../../assets/ducks/parts/beak/B.svg';
import duckBeakC from '../../assets/ducks/parts/beak/C.svg';
import duckBeakD from '../../assets/ducks/parts/beak/D.svg';
import duckBeakE from '../../assets/ducks/parts/beak/E.svg';
import duckBeakF from '../../assets/ducks/parts/beak/F.svg';
import duckBeakG from '../../assets/ducks/parts/beak/G.svg';
import duckBeakH from '../../assets/ducks/parts/beak/H.svg';
import duckBeakI1 from '../../assets/ducks/parts/beak/I1.svg';
import duckBeakI2 from '../../assets/ducks/parts/beak/I2.svg';
import duckBeakK from '../../assets/ducks/parts/beak/K.svg';
import duckBeakL from '../../assets/ducks/parts/beak/L.svg';
import duckBeakM from '../../assets/ducks/parts/beak/M.svg';
import duckBeakN from '../../assets/ducks/parts/beak/N.svg';
import duckBeakO from '../../assets/ducks/parts/beak/O.svg';
import duckBeakP from '../../assets/ducks/parts/beak/P.svg';
import duckBeakW from '../../assets/ducks/parts/beak/W.svg';
import duckBeakZ from '../../assets/ducks/parts/beak/Z.svg';

import duckBodyA from '../../assets/ducks/parts/body/A.svg';
import duckBodyB from '../../assets/ducks/parts/body/B.svg';
import duckBodyC from '../../assets/ducks/parts/body/C.svg';
import duckBodyD from '../../assets/ducks/parts/body/D.svg';
import duckBodyE from '../../assets/ducks/parts/body/E.svg';
import duckBodyF from '../../assets/ducks/parts/body/F.svg';
import duckBodyG from '../../assets/ducks/parts/body/G.svg';
import duckBodyH from '../../assets/ducks/parts/body/H.svg';
import duckBodyI1 from '../../assets/ducks/parts/body/I1.svg';
import duckBodyI2 from '../../assets/ducks/parts/body/I2.svg';
import duckBodyJEDI from '../../assets/ducks/parts/body/JEDI.svg';
import duckBodyK from '../../assets/ducks/parts/body/K.svg';
import duckBodyL from '../../assets/ducks/parts/body/L.svg';
import duckBodyM from '../../assets/ducks/parts/body/M.svg';
import duckBodyN from '../../assets/ducks/parts/body/N.svg';
import duckBodyO from '../../assets/ducks/parts/body/O.svg';
import duckBodyP from '../../assets/ducks/parts/body/P.svg';
import duckBodySUIT from '../../assets/ducks/parts/body/SUIT.svg';
import duckBodyW from '../../assets/ducks/parts/body/W.svg';
import duckBodyZ from '../../assets/ducks/parts/body/Z.svg';

import duckHeadA from '../../assets/ducks/parts/head/A.svg';
import duckHeadB from '../../assets/ducks/parts/head/B.svg';
import duckHeadC from '../../assets/ducks/parts/head/C.svg';
import duckHeadD from '../../assets/ducks/parts/head/D.svg';
import duckHeadE from '../../assets/ducks/parts/head/E.svg';
import duckHeadF from '../../assets/ducks/parts/head/F.svg';
import duckHeadG from '../../assets/ducks/parts/head/G.svg';
import duckHeadH from '../../assets/ducks/parts/head/H.svg';
import duckHeadI1 from '../../assets/ducks/parts/head/I1.svg';
import duckHeadI2 from '../../assets/ducks/parts/head/I2.svg';
import duckHeadJEDI from '../../assets/ducks/parts/head/JEDI.svg';
import duckHeadK from '../../assets/ducks/parts/head/K.svg';
import duckHeadL from '../../assets/ducks/parts/head/L.svg';
import duckHeadM from '../../assets/ducks/parts/head/M.svg';
import duckHeadN from '../../assets/ducks/parts/head/N.svg';
import duckHeadO from '../../assets/ducks/parts/head/O.svg';
import duckHeadP from '../../assets/ducks/parts/head/P.svg';
import duckHeadSUIT from '../../assets/ducks/parts/head/SUIT.svg';
import duckHeadW from '../../assets/ducks/parts/head/W.svg';
import duckHeadZ from '../../assets/ducks/parts/head/Z.svg';

import duckAccessoriesA from '../../assets/ducks/parts/accessories/A.svg';
import duckAccessoriesB from '../../assets/ducks/parts/accessories/B.svg';
import duckAccessoriesC from '../../assets/ducks/parts/accessories/C.svg';
import duckAccessoriesD from '../../assets/ducks/parts/accessories/D.svg';
import duckAccessoriesE from '../../assets/ducks/parts/accessories/E.svg';
import duckAccessoriesF from '../../assets/ducks/parts/accessories/F.svg';
import duckAccessoriesG from '../../assets/ducks/parts/accessories/G.svg';
import duckAccessoriesH from '../../assets/ducks/parts/accessories/H.svg';
import duckAccessoriesI1 from '../../assets/ducks/parts/accessories/I1.svg';
import duckAccessoriesI2 from '../../assets/ducks/parts/accessories/I2.svg';
import duckAccessoriesJEDI from '../../assets/ducks/parts/accessories/JEDI.svg';
import duckAccessoriesK from '../../assets/ducks/parts/accessories/K.svg';
import duckAccessoriesL from '../../assets/ducks/parts/accessories/L.svg';
import duckAccessoriesM from '../../assets/ducks/parts/accessories/M.svg';
import duckAccessoriesN from '../../assets/ducks/parts/accessories/N.svg';
import duckAccessoriesO from '../../assets/ducks/parts/accessories/O.svg';
import duckAccessoriesP from '../../assets/ducks/parts/accessories/P.svg';
import duckAccessoriesSUIT from '../../assets/ducks/parts/accessories/SUIT.svg';
import duckAccessoriesW from '../../assets/ducks/parts/accessories/W.svg';
import duckAccessoriesZ from '../../assets/ducks/parts/accessories/Z.svg';

import duckRightWingA from '../../assets/ducks/parts/right-wing/A.svg';
import duckRightWingB from '../../assets/ducks/parts/right-wing/B.svg';
import duckRightWingC from '../../assets/ducks/parts/right-wing/C.svg';
import duckRightWingD from '../../assets/ducks/parts/right-wing/D.svg';
import duckRightWingE from '../../assets/ducks/parts/right-wing/E.svg';
import duckRightWingF from '../../assets/ducks/parts/right-wing/F.svg';
import duckRightWingG from '../../assets/ducks/parts/right-wing/G.svg';
import duckRightWingH from '../../assets/ducks/parts/right-wing/H.svg';
import duckRightWingI1 from '../../assets/ducks/parts/right-wing/I1.svg';
import duckRightWingI2 from '../../assets/ducks/parts/right-wing/I2.svg';
import duckRightWingJEDI from '../../assets/ducks/parts/right-wing/JEDI.svg';
import duckRightWingK from '../../assets/ducks/parts/right-wing/K.svg';
import duckRightWingL from '../../assets/ducks/parts/right-wing/L.svg';
import duckRightWingM from '../../assets/ducks/parts/right-wing/M.svg';
import duckRightWingN from '../../assets/ducks/parts/right-wing/N.svg';
import duckRightWingO from '../../assets/ducks/parts/right-wing/O.svg';
import duckRightWingP from '../../assets/ducks/parts/right-wing/P.svg';
import duckRightWingW from '../../assets/ducks/parts/right-wing/W.svg';
import duckRightWingZ from '../../assets/ducks/parts/right-wing/Z.svg';

import duckLeftWingA from '../../assets/ducks/parts/left-wing/A.svg';
import duckLeftWingB from '../../assets/ducks/parts/left-wing/B.svg';
import duckLeftWingC from '../../assets/ducks/parts/left-wing/C.svg';
import duckLeftWingD from '../../assets/ducks/parts/left-wing/D.svg';
import duckLeftWingE from '../../assets/ducks/parts/left-wing/E.svg';
import duckLeftWingF from '../../assets/ducks/parts/left-wing/F.svg';
import duckLeftWingG from '../../assets/ducks/parts/left-wing/G.svg';
import duckLeftWingH from '../../assets/ducks/parts/left-wing/H.svg';
import duckLeftWingI1 from '../../assets/ducks/parts/left-wing/I1.svg';
import duckLeftWingI2 from '../../assets/ducks/parts/left-wing/I2.svg';
import duckLeftWingK from '../../assets/ducks/parts/left-wing/K.svg';
import duckLeftWingL from '../../assets/ducks/parts/left-wing/L.svg';
import duckLeftWingM from '../../assets/ducks/parts/left-wing/M.svg';
import duckLeftWingN from '../../assets/ducks/parts/left-wing/N.svg';
import duckLeftWingO from '../../assets/ducks/parts/left-wing/O.svg';
import duckLeftWingP from '../../assets/ducks/parts/left-wing/P.svg';
import duckLeftWingW from '../../assets/ducks/parts/left-wing/W.svg';
import duckLeftWingZ from '../../assets/ducks/parts/left-wing/Z.svg';

import duckTailA from '../../assets/ducks/parts/tail/A.svg';
import duckTailB from '../../assets/ducks/parts/tail/B.svg';
import duckTailC from '../../assets/ducks/parts/tail/C.svg';
import duckTailD from '../../assets/ducks/parts/tail/D.svg';
import duckTailE from '../../assets/ducks/parts/tail/E.svg';
import duckTailF from '../../assets/ducks/parts/tail/F.svg';
import duckTailG from '../../assets/ducks/parts/tail/G.svg';
import duckTailH from '../../assets/ducks/parts/tail/H.svg';
import duckTailI1 from '../../assets/ducks/parts/tail/I1.svg';
import duckTailI2 from '../../assets/ducks/parts/tail/I2.svg';
import duckTailJEDI from '../../assets/ducks/parts/tail/JEDI.svg';
import duckTailK from '../../assets/ducks/parts/tail/K.svg';
import duckTailL from '../../assets/ducks/parts/tail/L.svg';
import duckTailM from '../../assets/ducks/parts/tail/M.svg';
import duckTailN from '../../assets/ducks/parts/tail/N.svg';
import duckTailO from '../../assets/ducks/parts/tail/O.svg';
import duckTailP from '../../assets/ducks/parts/tail/P.svg';
import duckTailW from '../../assets/ducks/parts/tail/W.svg';
import duckTailZ from '../../assets/ducks/parts/tail/Z.svg';

import duckStylesA from '../../assets/styles/A.css';
import duckStylesB from '../../assets/styles/B.css';
import duckStylesC from '../../assets/styles/C.css';
import duckStylesD from '../../assets/styles/D.css';
import duckStylesE from '../../assets/styles/E.css';
import duckStylesF from '../../assets/styles/F.css';
import duckStylesG from '../../assets/styles/G.css';
import duckStylesH from '../../assets/styles/H.css';
import duckStylesI1 from '../../assets/styles/I1.css';
import duckStylesI2 from '../../assets/styles/I2.css';
import duckStylesK from '../../assets/styles/K.css';
import duckStylesL from '../../assets/styles/L.css';
import duckStylesM from '../../assets/styles/M.css';
import duckStylesN from '../../assets/styles/N.css';
import duckStylesO from '../../assets/styles/O.css';
import duckStylesP from '../../assets/styles/P.css';
import duckStylesS from '../../assets/styles/S.css';
import duckStylesT from '../../assets/styles/T.css';
import duckStylesW from '../../assets/styles/W.css';
import duckStylesZ from '../../assets/styles/Z.css';

export const PERCH = {
    B: {
        styles: perchBStyles,
        front: perchBFront,
        back: perchBBack,
    },
    G: {
        styles: perchGStyles,
        front: perchGFront,
        back: perchGBack,
    },
    R: {
        styles: perchRStyles,
        front: perchRFront,
        back: perchRBack,
    },
    Y: {
        styles: perchYStyles,
        front: perchYFront,
        back: perchYBack,
    },
};

export const DUCK_PARAMETER = {
    onHead: {
        A: duckOnHeadA,
        B: duckOnHeadB,
        C: duckOnHeadC,
        D: duckOnHeadD,
        E: duckOnHeadE,
        F: duckOnHeadF,
        G: duckOnHeadG,
        H: duckOnHeadH,
        I_1: duckOnHeadI1,
        I_2: duckOnHeadI2,
        K: duckOnHeadK,
        L: duckOnHeadL,
        M: duckOnHeadM,
        N: duckOnHeadN,
        O: duckOnHeadO,
        P: duckOnHeadP,
        S: duckOnHeadS,
        T: duckOnHeadT,
        W: duckOnHeadW,
        Z: duckOnHeadZ,
    },
    eyebrows: {
        A: duckEyebrowsA,
        B: duckEyebrowsB,
        C: duckEyebrowsC,
        D: duckEyebrowsD,
        E: duckEyebrowsE,
        F: duckEyebrowsF,
        G: duckEyebrowsG,
        H: duckEyebrowsH,
        I_1: duckEyebrowsI1,
        I_2: duckEyebrowsI2,
        K: duckEyebrowsK,
        L: duckEyebrowsL,
        M: duckEyebrowsM,
        N: duckEyebrowsN,
        O: duckEyebrowsO,
        P: duckEyebrowsP,
        W: duckEyebrowsW,
        Z: duckEyebrowsZ,
    },
    eyes: {
        A: duckEyesA,
        B: duckEyesB,
        C: duckEyesC,
        D: duckEyesD,
        E: duckEyesE,
        F: duckEyesF,
        G: duckEyesG,
        H: duckEyesH,
        I_1: duckEyesI1,
        I_2: duckEyesI2,
        K: duckEyesK,
        L: duckEyesL,
        M: duckEyesM,
        N: duckEyesN,
        O: duckEyesO,
        P: duckEyesP,
        W: duckEyesW,
        Z: duckEyesZ,
    },
    beak: {
        A: duckBeakA,
        B: duckBeakB,
        C: duckBeakC,
        D: duckBeakD,
        E: duckBeakE,
        F: duckBeakF,
        G: duckBeakG,
        H: duckBeakH,
        I_1: duckBeakI1,
        I_2: duckBeakI2,
        K: duckBeakK,
        L: duckBeakL,
        M: duckBeakM,
        N: duckBeakN,
        O: duckBeakO,
        P: duckBeakP,
        W: duckBeakW,
        Z: duckBeakZ,
    },
    body: {
        A: duckBodyA,
        B: duckBodyB,
        C: duckBodyC,
        D: duckBodyD,
        E: duckBodyE,
        F: duckBodyF,
        G: duckBodyG,
        H: duckBodyH,
        I_1: duckBodyI1,
        I_2: duckBodyI2,
        K: duckBodyK,
        L: duckBodyL,
        M: duckBodyM,
        N: duckBodyN,
        O: duckBodyO,
        P: duckBodyP,
        W: duckBodyW,
        Z: duckBodyZ,
    },
    head: {
        A: duckHeadA,
        B: duckHeadB,
        C: duckHeadC,
        D: duckHeadD,
        E: duckHeadE,
        F: duckHeadF,
        G: duckHeadG,
        H: duckHeadH,
        I_1: duckHeadI1,
        I_2: duckHeadI2,
        K: duckHeadK,
        L: duckHeadL,
        M: duckHeadM,
        N: duckHeadN,
        O: duckHeadO,
        P: duckHeadP,
        W: duckHeadW,
        Z: duckHeadZ,
    },
    accessories: {
        A: duckAccessoriesA,
        B: duckAccessoriesB,
        C: duckAccessoriesC,
        D: duckAccessoriesD,
        E: duckAccessoriesE,
        F: duckAccessoriesF,
        G: duckAccessoriesG,
        H: duckAccessoriesH,
        I_1: duckAccessoriesI1,
        I_2: duckAccessoriesI2,
        K: duckAccessoriesK,
        L: duckAccessoriesL,
        M: duckAccessoriesM,
        N: duckAccessoriesN,
        O: duckAccessoriesO,
        P: duckAccessoriesP,
        W: duckAccessoriesW,
        Z: duckAccessoriesZ,
    },
    rightWing: {
        A: duckRightWingA,
        B: duckRightWingB,
        C: duckRightWingC,
        D: duckRightWingD,
        E: duckRightWingE,
        F: duckRightWingF,
        G: duckRightWingG,
        H: duckRightWingH,
        I_1: duckRightWingI1,
        I_2: duckRightWingI2,
        K: duckRightWingK,
        L: duckRightWingL,
        M: duckRightWingM,
        N: duckRightWingN,
        O: duckRightWingO,
        P: duckRightWingP,
        W: duckRightWingW,
        Z: duckRightWingZ,
    },
    leftWing: {
        A: duckLeftWingA,
        B: duckLeftWingB,
        C: duckLeftWingC,
        D: duckLeftWingD,
        E: duckLeftWingE,
        F: duckLeftWingF,
        G: duckLeftWingG,
        H: duckLeftWingH,
        I_1: duckLeftWingI1,
        I_2: duckLeftWingI2,
        K: duckLeftWingK,
        L: duckLeftWingL,
        M: duckLeftWingM,
        N: duckLeftWingN,
        O: duckLeftWingO,
        P: duckLeftWingP,
        W: duckLeftWingW,
        Z: duckLeftWingZ,
    },
    tail: {
        A: duckTailA,
        B: duckTailB,
        C: duckTailC,
        D: duckTailD,
        E: duckTailE,
        F: duckTailF,
        G: duckTailG,
        H: duckTailH,
        I_1: duckTailI1,
        I_2: duckTailI2,
        K: duckTailK,
        L: duckTailL,
        M: duckTailM,
        N: duckTailN,
        O: duckTailO,
        P: duckTailP,
        W: duckTailW,
        Z: duckTailZ,
    },
};

export const COMMON_DUCK_STYLE = {
    A: duckStylesA,
    B: duckStylesB,
    C: duckStylesC,
    D: duckStylesD,
    E: duckStylesE,
    F: duckStylesF,
    G: duckStylesG,
    H: duckStylesH,
    I_1: duckStylesI1,
    I_2: duckStylesI2,
    K: duckStylesK,
    L: duckStylesL,
    M: duckStylesM,
    N: duckStylesN,
    O: duckStylesO,
    P: duckStylesP,
    S: duckStylesS,
    T: duckStylesT,
    W: duckStylesW,
    Z: duckStylesZ,
};

export const JACKPOT_ALIAS = manyToOne({
    WWWWVTWO: [
        'WWWAVTWO',
        'WWWBVTWO',
        'WWWCVTWO',
        'WWWDVTWO',
        'WWWEVTWO',
        'WWWFVTWO',
        'WWWGVTWO',
        'WWWHVTWO',
        'WWWIVTWO',
        'WWWJVTWO',
    ],
    WWWMAHER: [
        'WWAMAHER',
        'WWBMAHER',
        'WWCMAHER',
        'WWDMAHER',
        'WWEMAHER',
        'WWFMAHER',
        'WWGMAHER',
        'WWHMAHER',
        'WWIMAHER',
    ],
});

export const ITEM_PARTS = {
    SUIT: {
        onHead: duckOnHeadSUIT,
        body: duckBodySUIT,
        head: duckHeadSUIT,
        accessories: duckAccessoriesSUIT,
        background: duckBackgroundSUIT,
        firstLayer: duckFirstLayerSUIT,
    },
    JEDI: {
        body: duckBodyJEDI,
        head: duckHeadJEDI,
        accessories: duckAccessoriesJEDI,
        tail: duckTailJEDI,
        rightWing: duckRightWingJEDI,
    },
};

export const WORLD = {
    [Worlds.Wars]: 'JEDI',
    [Worlds.Hunt]: 'GLASSES',
    [Worlds.None]: '',
} as const;
