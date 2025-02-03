import { AnimalPaths } from '../../types/animals';
import BattlegroundImageGenerator from '../StakeItemImageGenerator';

const getBattleground = (color: string): string => {
    const battlegroundProperties = new BattlegroundImageGenerator({
        stakingItemColor: color,
        animalPath: AnimalPaths.FELINE,
    }).getProperties();

    return `<?xml version="1.0" encoding="utf-8"?>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  \t viewBox="0 0 510.24 595.28" style="enable-background:new 0 0 510.24 595.28;" xml:space="preserve">
  
  <style type="text/css">
  ${battlegroundProperties.styles}
  </style>
  
  ${battlegroundProperties.image}
  </svg>`;
};

export default getBattleground;
