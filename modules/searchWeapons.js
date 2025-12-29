import { buildItem } from './buildItem.js';

export function searchWeapons(creatureType, originalText, actor) {
  try {
    const weaponSkillsArr = originalText
      .match(/WEAPON SKILLS\n(.*)SPECIAL ABILITIES/is)[0]
      .replace(/WEAPON SKILLS\n/i, '')
      .replace(/\nSPECIAL ABILITIES/i, '')
      .split(/\n/);
    weaponSkillsArr.forEach(element => {
      const name = element.match(/\D*(\dh)*\D*/)[0].trim();
      const skill = element.match(/\d+/)[0];

      Object.values(creatureType).forEach(element => {
        if (name.toUpperCase() === element.name.toUpperCase()) {
          console.log(
            '????????????????? building item named',
            name,
            element.name
          );
          actor.createEmbeddedDocuments('Item', [
            buildItem(
              name,
              'weapon',
              '',
              Number(skill),
              element.damage,
              element.injury,
              0,
              element.calledShot,
              element.edge,
              element.twoHandWeapon
            ),
          ]);
        }
      });
    });
  } catch (error) {
    const weaponSkillsArr = originalText
      .match(/WEAPON SKILLS\n(.*)/is)[0]
      .replace(/WEAPON SKILLS\n/i, '')
      .split(/\n/);
    weaponSkillsArr.forEach(element => {
      const name = element.match(/\D*(\dh)*\D*/)[0].trim();
      const skill = element.match(/\d+/)[0];

      Object.values(creatureType).forEach(element => {
        if (name === element.name) {
          actor.createEmbeddedDocuments('Item', [
            buildItem(
              name,
              'weapon',
              '',
              Number(skill),
              element.damage,
              element.injury,
              0,
              element.calledShot,
              element.edge,
              element.twoHandWeapon
            ),
          ]);
        }
      });
    });
  }
}
