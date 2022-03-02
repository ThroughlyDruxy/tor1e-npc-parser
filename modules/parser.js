import { buildItem } from './buildItem.js';

///// Parser /////
export async function tor1eParser(input) {
  console.log(`TOR 1E | tor1eParser() was called`);

  // Statblock format
  const statblockFormat = input.find('select#text-format').val();

  const npcData = {
    name: 'Generated Actor',
    type: 'adversary',
    img: 'systems/tor1e/assets/images/tokens/token_adversary.png',
    data: {
      attributeLevel: {
        value: null,
      },
      endurance: {
        value: null,
        max: null,
      },
      description: {
        value: '',
      },
      might: {
        value: null,
        max: null,
      },
      hate: {
        value: null,
        max: null,
      },
      parry: {
        value: 0,
      },
      skills: {
        personality: {
          value: 0,
        },
        movement: {
          value: 0,
        },
        perception: {
          value: 0,
        },
        survival: {
          value: 0,
        },
        custom: {
          value: 0,
        },
        vocation: {
          value: 0,
        },
      },
    },
    token: {
      img: 'systems/tor1e/assets/images/tokens/token_adversary.png',
      displayBars: 40,
      bar1: {
        attribute: 'endurance',
      },
      bar2: {
        attribute: 'hate',
      },
    },
    items: [],
  };

  let actor = await Actor.create(npcData);

  let originalText = input.find('textarea#text-input').val();

  ///// NAME /////
  console.log(`TOR 1E NPC PARSER | parsing Name`);
  const [nameFirst] = originalText.split('\n');
  let nameArray = nameFirst.split(' ');
  for (let i = 0; i < nameArray.length; i++) {
    nameArray[i] =
      nameArray[i][0].toUpperCase() + nameArray[i].substr(1).toLowerCase();
  }
  npcData.name = nameArray.join(' ').replace(/:/, '');

  ///// DESCRIPTION /////
  console.log(`TOR 1E NPC PARSER | parsing Description`);

  try {
    npcData.data.description.value = originalText
      .match(/:\n\D*/)[0]
      .replace(/\n/, '')
      .replace(/:/, '')
      .replace(/attribute level/i, '');
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.descriptionNotFound')
    );
  }

  //// ATTRIBUTE LEVEL, MIGHT, HATE, PARRY, ARMOUR /////
  console.log(
    `TOR 1E NPC PARSER | parsing Level, Endurance, Might, Hate, Parry, and Armour`
  );

  ///// ATTRIBUTE LEVEL /////
  try {
    const attributeLevel = originalText
      .match(/ATTRIBUTE LEVEL\n\d+/i)[0]
      .match(/\d+/)[0];
    npcData.data.attributeLevel.value = Number(attributeLevel);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR1E-NPC-PARSER.notifications.attributeLevelNotFound'
      )
    );
    npcData.data.attributeLevel.value = 0;
  }

  ///// ENDURANCE & HATE /////
  try {
    const [endurance, hate] = originalText
      .match(/ENDURANCE HATE\n\d+ \d+/i)[0]
      .match(/\d+ \d+/)[0]
      .split(' ');
    npcData.data.endurance.value = Number(endurance);
    npcData.data.endurance.max = Number(endurance);
    npcData.data.hate.value = Number(hate);
    npcData.data.hate.max = Number(hate);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.enduranceNotFound')
    );
    npcData.data.endurance.value = 0;
    npcData.data.endurance.max = 0;
  }

  ///// PARRY, SHIELD & ARMOUR /////
  try {
    const parryShieldArmour = originalText
      .match(/PARRY ARMOUR\n\d+ *\S*\d*\D* \dd/i)[0]
      .match(/\d+.*/)[0];

    const parry = parryShieldArmour.match(/\d/)[0];
    try {
      const shield = parryShieldArmour.match(/\+\d/)[0];
      actor.createEmbeddedDocuments('Item', [
        buildItem('Shield', 'armour', '', 0, 0, 0, Number(shield)),
      ]);
    } catch (error) {
      console.error(error);
      ui.notifications.warn(
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.shieldNotFound')
      );
    }
    const armour = parryShieldArmour.match(/\dd/)[0].replace(/d/, '');
    npcData.data.parry.value = Number(parry);
    npcData.data.parry.value = Number(parry);
    actor.createEmbeddedDocuments('Item', [
      buildItem('Armour', 'armour', '', 0, 0, 0, Number(armour)),
    ]);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.parryNotFound')
    );
    npcData.data.parry.value = 0;
  }

  ///// SKILLS /////
  try {
    // Personality
    npcData.data.skills.personality.value = Number(
      originalText.match(/personality, \d/i)[0].replace(/personality, /i, '')
    );
    // Movement
    npcData.data.skills.movement.value = Number(
      originalText.match(/movement, \d/i)[0].replace(/movement, /i, '')
    );
    // Perception
    npcData.data.skills.perception.value = Number(
      originalText.match(/perception, \d/i)[0].replace(/perception, /i, '')
    );
    // Survival
    npcData.data.skills.survival.value = Number(
      originalText.match(/survival, \d/i)[0].replace(/survival, /i, '')
    );
    // Custom
    npcData.data.skills.custom.value = Number(
      originalText.match(/custom, \d/i)[0].replace(/custom, /i, '')
    );
    // Vocation
    npcData.data.skills.vocation.value = Number(
      originalText.match(/vocation, \d/i)[0].replace(/vocation, /i, '')
    );
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.skillsNotFound')
    );
  }

  ///// WEAPON SKILLS /////
  console.log(`TOR 1E NPC PARSER | parsing Weapon Skills`);

  const adversaryWeapons = {
    // Orc Weapons
    orc: {
      bentSword: {
        name: 'Bent sword',
        damage: 4,
        edge: 10,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.disarm',
      },
      bowOfHorn: {
        name: 'Bow of horn',
        damage: 4,
        edge: 10,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
      broadbladedSword: {
        name: 'Broad-bladed spear',
        damage: 5,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
      broadheadedSpear: {
        name: 'Broad-headed spear',
        damage: 5,
        edge: 10,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      jaggedKnife: {
        name: 'Jagged knife',
        damage: 3,
        edge: 11,
        injury: 14,
        calledShot: '-',
      },
      heavyScimitar: {
        name: 'Heavy scimitar (2h)',
        damage: 7,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
      orcAxe: {
        name: 'Orc-axe',
        damage: 5,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
      spear: {
        name: 'Spear',
        damage: 4,
        edge: 9,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
    },
    // Spider Weapons
    spider: {
      ensnare: {
        name: 'Ensnare',
        damage: 0,
        edge: 0,
        injury: 0,
        calledShot: '',
      },
      sting: {
        name: 'Sting',
        damage: npcData.data.attributeLevel.value,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
    },
    // Troll Weapons
    troll: {
      bite: {
        name: 'Bite',
        damage: 5,
        edge: 11,
        injury: 14,
        calledShot: '',
      },
      club: {
        name: 'Club',
        damage: 6,
        edge: 10,
        injury: 14,
        calledShot: '',
      },
      crush: {
        name: 'Crush',
        damage: npcData.data.attributeLevel.value,
        edge: 11,
        injury: 12,
        calledShot: '',
      },
      heavyHammer: {
        name: 'Heavy hammer',
        damage: 8,
        edge: 11,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
    },
    // Wolvish Weapons
    wolf: {
      bite: {
        name: 'Bite',
        damage: npcData.data.attributeLevel.value,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      rend: {
        name: 'Rend',
        damage: npcData.data.attributeLevel.value,
        edge: 11,
        injury: 14,
        calledShot: '',
      },
    },
    // Vampiric Weapons
    vampire: {
      bite: {
        name: 'Bite',
        damage: npcData.data.attributeLevel.value,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      rake: {
        name: 'Rake',
        damage: npcData.data.attributeLevel.value,
        edge: 11,
        injury: 14,
        calledShot: '',
      },
    },
  };

  function searchWeapons(creatureType) {
    const weaponSkillsArr = originalText
      .match(/WEAPON SKILLS\n(.*)SPECIAL ABILITIES/is)[0]
      .replace(/WEAPON SKILLS\n/i, '')
      .replace(/\nSPECIAL ABILITIES/i, '')
      .split(/\n/);
    weaponSkillsArr.forEach(element => {
      const name = element.match(/\D*(\dh)*\D*/)[0].trim();
      const skill = element.match(/\d+/)[0];

      Object.values(creatureType).forEach(element => {
        if (name === element.name) {
          const damage = element.damage;
          const edge = element.edge;
          const injury = element.injury;
          const calledShot = element.calledShot;
          actor.createEmbeddedDocuments('Item', [
            buildItem(
              name,
              'weapon',
              '',
              Number(skill),
              damage,
              injury,
              0,
              calledShot,
              edge
            ),
          ]);
        }
      });
    });
  }

  try {
    if (/goblin|messenger|orc|snaga|uruk/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.orc);
    } else if (/attercop|spider/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.spider);
    } else if (/troll/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.troll);
    } else if (/hound|wolf/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.wolf);
    } else if (/bat|secret shadow/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.vampire);
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.weaponSkillsNotFound')
    );
  }

  ///// SPECIAL ABILITIES /////
  console.log(`TOR 1E NPC PARSER | parsing Special Abilities`);
  const allSpecialAbilities = [
    'Bewilder',
    'Commanding voice',
    'Craven',
    'Denizen of the Dark',
    'Dreadful Spells',
    'Fear of Fire',
    'Fell Speed',
    'Foul Reek',
    'Great Leap',
    'Great Size',
    'Hatred (subject)',
    'Hate Sunlight',
    'Hideous Toughness',
    'Horrible Strength',
    'No Quarter',
    'Savage Assault',
    'Seize Victim',
    'Snake-like speed',
    'Strike Fear',
    'Thick Hide',
    'Thing of Terror',
  ];

  try {
    const specialAbilitiesArr = originalText
      .match(/SPECIAL ABILITIES.*/is)[0]
      .replace(/SPECIAL ABILITIES\n/is, '')
      .replace(/\n/, ' ')
      .split(' '); // splits it into individual words.

    for (let i = 0; i < specialAbilitiesArr.length; i++) {
      const abilitySubstring = specialAbilitiesArr[i];

      allSpecialAbilities.forEach(element => {
        const specialAbility = element;
        if (specialAbility.includes(abilitySubstring)) {
          if (specialAbility.indexOf(specialAbilitiesArr[i]) === 0) {
            actor.createEmbeddedDocuments('Item', [
              buildItem(specialAbility, 'special-ability', '', 0, 0, 0),
            ]);
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR1E-NPC-PARSER.notifications.specialAbilityNotFound'
      )
    );
  }

  ///// FELL ABILITIES BY TYPE /////
  // if (/Orc|Goblin|Uruk|Snaga|Lugburz|Hags|Pale Ones/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Hatred (subject) ' +
  //       game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
  //   );
  // } else if (/Troll|Ettins|Ogre/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Hideous Toughness and Dull-witted ' +
  //       game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
  //   );
  // } else if (/Wight|Marsh|Wraith|Bog Soldiers|Spectres/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Deathless, Heartless, and Strike Fear ' +
  //       game.i18n.localize(
  //         'TOR1E-NPC-PARSER.notifications.specialAbilitiesByType'
  //       )
  //   );
  // } else if (/Wolf|Hound/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Great Leap ' +
  //       game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
  //   );
  // } else if (/Attercop|Spider/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Poison and Web ' +
  //       game.i18n.localize(
  //         'TOR1E-NPC-PARSER.notifications.specialAbilitiesByType'
  //       )
  //   );
  // } else if (/Bat|Shadow/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Hate Sunlight, Deizen of the Dark, and Fell Speed ' +
  //       game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
  //   );
  // } else if (/Huorns/i.test(npcData.name)) {
  //   ui.notifications.info(
  //     'Wandering Huorn, Denizen of the Dark, and Fell Speed ' +
  //       game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
  //   );
  // }

  // Makes sure the actor has the latest data added.
  actor.update(npcData);
}
