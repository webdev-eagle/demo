import { BASE_POWER } from '../constants';

export const calculateDamage = (
    factor: number,
    rarity: number,
    damageBonus: number,
    ultimateFocus: number,
    damagePrevention: number,
): number => {
    let damage = (BASE_POWER + Math.round((rarity / 100) * 4)) * (1 + factor * 0.5) + damageBonus - damagePrevention;
    if (ultimateFocus > 0 && damage > 0) {
        damage += parseFloat(Math.floor((ultimateFocus / 100) * damage)?.toFixed(2));
    }
    return damage > 0 ? damage : 0;
};

export const calculateHeal = (factor: number, bonusHeal: number): number => {
    const bonusHealFactor = factor ? bonusHeal : 0;
    return 4 * (factor || 0) + bonusHealFactor;
};

export const calculateBonusHp = (duck: any): number => {
    let hp = 0;
    //Only 1 pet can give a bonus at a time
    if (duck?.items.find((item) => item === 'TURTLE')) {
        hp += 5;
    } else if (duck?.items.find((item) => item === 'CUPID')) {
        hp += 20;
    }
    if (duck?.items.find((item) => item === 'FIRE_HELMET')) {
        hp += 5;
    }
    if (duck?.items.find((item) => item === 'FIRE_TAIL')) {
        hp += 2;
    }
    if (duck?.items.find((item) => item === 'DEER')) {
        hp += 10;
    }
    return hp;
};

export const calculateBonusDamage = (duck: any): number => {
    let damage = 0;
    if (duck?.items.find((item) => item === 'SNAKE')) {
        damage += 0.5;
    }
    if (duck?.items.find((item) => item === 'FIRE_TAIL')) {
        damage += 0.5;
    }
    if (duck?.items.find((item) => item === 'FIRE_SWORD')) {
        damage += 1;
    }
    return damage;
};

export const calculateDamagePrevention = (duck: any): number => {
    let protection = 0;
    if (duck?.items.find((item) => item === 'FIRE_ARMOUR')) {
        protection += 1;
    }

    return protection;
};
export const calculateDefencePointsCount = (
    pointsCount: number,
    rarity: number,
    achievementsCount: number,
    bonusShield: number,
) => {
    const bonus = bonusShield > 0 ? 1 : 0;
    const points = rarity < 37.5 && achievementsCount > 0 ? Math.max(pointsCount, 1) : pointsCount;
    const total = points + bonus;
    return total >= 3 ? 3 : total;
};

// export const calculateHeal = (factor:number, rarity: number): number => BASE_POWER * 0.5 * (factor || 0)

// export const calculateDefencePointsCount = (pointsCount: number, rarity: number, hasAchievements: number) => (rarity < 50 || hasAchievements > 0) ? Math.max(pointsCount, hasAchievements) : pointsCount
