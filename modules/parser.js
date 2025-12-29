import { buildItem } from './buildItem.js';
import { searchWeapons } from './searchWeapons.js';

///// Parser /////
export async function tor1eParser(input) {
  console.log(`TOR 1E | tor1eParser() was called`);

  // Statblock format
  const statblockFormat = input.find('select#text-format').val();

  const npcData = {
    name: 'Generated Actor',
    type: 'adversary',
    img: 'systems/tor1e/assets/images/tokens/token_adversary.png',
    system: {
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
    npcData.system.description.value = originalText
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
    npcData.system.attributeLevel.value = Number(attributeLevel);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR1E-NPC-PARSER.notifications.attributeLevelNotFound'
      )
    );
    npcData.system.attributeLevel.value = 0;
  }

  ///// ENDURANCE & HATE /////
  try {
    const [endurance, hate] = originalText
      .match(/ENDURANCE HATE\n\d+ \d+/i)[0]
      .match(/\d+ \d+/)[0]
      .split(' ');
    npcData.system.endurance.value = Number(endurance);
    npcData.system.endurance.max = Number(endurance);
    npcData.system.hate.value = Number(hate);
    npcData.system.hate.max = Number(hate);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.enduranceNotFound')
    );
    npcData.system.endurance.value = 0;
    npcData.system.endurance.max = 0;
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
      ui.notifications.warn(
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.shieldNotFound')
      );
    }
    const armour = parryShieldArmour.match(/\dd/)[0].replace(/d/, '');
    npcData.system.parry.value = Number(parry);
    npcData.system.parry.value = Number(parry);
    actor.createEmbeddedDocuments('Item', [
      buildItem('Armour', 'armour', '', 0, 0, 0, Number(armour)),
    ]);
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.parryNotFound')
    );
    npcData.system.parry.value = 0;
  }

  ///// SKILLS /////
  try {
    // Personality
    npcData.system.skills.personality.value = Number(
      originalText.match(/personality, \d/i)[0].replace(/personality, /i, '')
    );
    // Movement
    npcData.system.skills.movement.value = Number(
      originalText.match(/movement, \d/i)[0].replace(/movement, /i, '')
    );
    // Perception
    npcData.system.skills.perception.value = Number(
      originalText.match(/perception, \d/i)[0].replace(/perception, /i, '')
    );
    // Survival
    npcData.system.skills.survival.value = Number(
      originalText.match(/survival, \d/i)[0].replace(/survival, /i, '')
    );
    // Custom
    npcData.system.skills.custom.value = Number(
      originalText.match(/custom, \d/i)[0].replace(/custom, /i, '')
    );
    // Vocation
    npcData.system.skills.vocation.value = Number(
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
  // Object containing all adversary weapons stats
  const adversaryWeapons = {
    // Men Weapons
    baseWeapons: {
      Axe: {
        name: 'Axe',
        damage: 5,
        edge: 11,
        injury: 18,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
      bow: {
        name: 'Bow',
        damage: 5,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      dagger: {
        name: 'Dagger',
        damage: 3,
        edge: 11,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
      greatAxe: {
        name: 'Great axe',
        damage: 9,
        edge: 11,
        injury: 20,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
        twoHandWeapon: true,
      },
      greatBow: {
        name: 'Great bow',
        damage: 7,
        edge: 10,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      greatSpear: {
        name: 'Great spear',
        damage: 9,
        edge: 9,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.pierce',
        twoHandWeapon: true,
      },
      longhaftedAxe: {
        name: 'Long-hafted axe',
        damage: 5,
        edge: 11,
        injury: 18,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
      },
      longSword: {
        name: 'Long sword',
        damage: 5,
        edge: 10,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.disarm',
      },
      mattock: {
        name: 'Mattock',
        damage: 8,
        edge: 10,
        injury: 18,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
        twoHandWeapon: true,
      },
      shortSword: {
        name: 'Short sword',
        damage: 5,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.disarm',
      },
      spear: {
        name: 'Spear',
        damage: 5,
        edge: 9,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      sword: {
        name: 'Sword',
        damage: 5,
        edge: 10,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.disarm',
      },
      savageHound: {
        name: 'Savage Hound',
        damage: 4,
        edge: 11,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.none',
      },
    },
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
        name: 'Jagged Knife',
        damage: 3,
        edge: 11,
        injury: 14,
        calledShot: '-',
      },
      heavyScimitar: {
        name: 'Heavy scimitar',
        damage: 7,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
        twoHandWeapon: true,
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
      stoneSpear: {
        name: 'Stone spear',
        damage: 4,
        edge: 10,
        injury: 12,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
    },
    // Ringwraith Weapons
    ringWraith: {
      longSword: {
        name: 'Long sword',
        damage: 7,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.disarm',
      },
      claw: {
        name: 'Claw',
        damage: npcData.system.attributeLevel.value,
        edge: 11,
        injury: 16,
        calledShot: '',
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
        damage: npcData.system.attributeLevel.value,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
      hunterBeak: {
        name: 'Beak',
        damage: 6,
        edge: 11,
        injury: 15,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
      shelobBeak: {
        name: 'Beak',
        damage: npcData.system.attributeLevel.value,
        edge: 8,
        injury: 18,
        calledShot: 'tor1e.weapons.calledShots.poison',
      },
      stomp: {
        name: 'Stomp',
        damage: npcData.system.attributeLevel.value,
        edge: 11,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.knock-down',
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
        damage: npcData.system.attributeLevel.value,
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
      // Bree
      trollKnife: {
        name: 'Troll-knife',
        damage: 5,
        edge: 10,
        injury: 14,
        calledShot: '',
      },
    },
    // Wolvish Weapons
    wolf: {
      bite: {
        name: 'Bite',
        damage: npcData.system.attributeLevel.value,
        edge: 10,
        injury: 14,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      rend: {
        name: 'Rend',
        damage: npcData.system.attributeLevel.value,
        edge: 11,
        injury: 14,
        calledShot: '',
      },
    },
    // Vampiric Weapons
    vampire: {
      bite: {
        name: 'Bite',
        damage: npcData.system.attributeLevel.value,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      rake: {
        name: 'Rake',
        damage: npcData.system.attributeLevel.value,
        edge: 11,
        injury: 14,
        calledShot: '',
      },
    },
    // Undead Weapons
    undead: {
      stranglingClaws: {
        name: 'Strangling Claws',
        damage: 5,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.none',
      },
      greatAxe: {
        name: 'Great axe',
        damage: 9,
        edge: 11,
        injury: 20,
        calledShot: 'tor1e.weapons.calledShots.break-shield',
        twoHandWeapon: true,
      },
    },
    // Dragon weapons
    dragon: {
      bite: {
        name: 'Bite',
        damage: 9,
        edge: 9,
        injury: 20,
        calledShot: 'tor1e.weapons.calledShots.pierce',
      },
      crush: {
        name: 'Crush',
        damage: 14,
        edge: 11,
        injury: 16,
        calledShot: 'tor1e.weapons.calledShots.none',
      },
    },
  };

  try {
    // Orc weapons
    if (/goblin|messenger|orc|snaga|uruk/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.orc, originalText, actor);
      // Spider weapons
    } else if (/attercop|sarqin|spider|tauler|tyulqin/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.spider, originalText, actor);
      // Troll weapons
    } else if (/troll/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.troll, originalText, actor);
      // Wolf weapons
    } else if (/hound|wolf/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.wolf, originalText, actor);
      // Vampire weapons
    } else if (/bat|secret shadow|vampire/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.vampire, originalText, actor);
      // Ringwraith weapons
    } else if (
      /lieutenant of dol|ghost of the forest|messenger of mordor/i.test(
        npcData.name
      )
    ) {
      searchWeapons(adversaryWeapons.ringWraith, originalText, actor);
      // Undead weapons
    } else if (/wight/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.undead, originalText, actor);
    } else if (/dragon/i.test(npcData.name)) {
      searchWeapons(adversaryWeapons.dragon, originalText, actor);
    } else {
      searchWeapons(adversaryWeapons.baseWeapons, originalText, actor);
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize('TOR1E-NPC-PARSER.notifications.weaponSkillsNotFound')
    );
  }

  ///// SPECIAL ABILITIES /////
  console.log(`TOR 1E NPC PARSER | parsing Special Abilities`);
  // prettier-ignore
  const allSpecialAbilities = [
    // Core Rule Book
    'Bewilder', 'Commanding voice', 'Craven', 'Denizen of the Dark', 'Dreadful Spells',
    'Fear of Fire', 'Fell Speed', 'Foul Reek', 'Great Leap', 'Great Size', 'Hatred',
    'Hate Sunlight', 'Hideous Toughness', 'Horrible Strength', 'No Quarter',
    'Savage Assault', 'Seize Victim', 'Snake-like Speed', 'Strike Fear', 'Thick Hide',
    'Thing of Terror',
    // Bree
    'Deadly Misfortune', 'Reckless Hate', 'Defend Ally', 'Berserk Rage', 'Poisoned Weapons',
    'Shade-caller', 'Ghost-form', 'Icy Touch', 'Lure of the Ring',
    // Darkening of Mirkwood
    'Black Breath', 'Deadly Voice', 'Dwimmerlaik', 'Mirkwood-dweller', 'Countless Children',
    'Webs of Illusion', 'Many Poisons', 'Horror of the Wood', 'Beast-tamer', 'Weak Spot', 'Enthral'
  ];

  try {
    const pastedSpecialAbilities = originalText
      .match(/SPECIAL ABILITIES.*/is)[0]
      .replace(/SPECIAL ABILITIES\n/is, '')
      .replace(/\n/, ' ')
      .toLowerCase();

    for (let i = 0; i < allSpecialAbilities.length; i++) {
      const defaultTN = ' (TN 14)';
      const specialAbility = allSpecialAbilities[i];
      if (pastedSpecialAbilities.includes(specialAbility.toLowerCase())) {
        if (specialAbility === 'Hatred') {
          const hatredSubject = pastedSpecialAbilities
            .match(/Hatred \(.+\)/i)[0]
            .replace(/Hatred/i, '');

          actor.createEmbeddedDocuments('Item', [
            buildItem(
              specialAbility + hatredSubject,
              'special-ability',
              '',
              0,
              0,
              0
            ),
          ]);
        } else if (specialAbility === 'Strike Fear') {
          try {
            const strikeFearTN = pastedSpecialAbilities
              .match(/Strike Fear \(.+\)/i)[0]
              .replace(/Strike Fear/i, '');

            actor.createEmbeddedDocuments('Item', [
              buildItem(
                specialAbility + strikeFearTN.toUpperCase(),
                'special-ability',
                '',
                0,
                0,
                0
              ),
            ]);
          } catch (error) {
            actor.createEmbeddedDocuments('Item', [
              buildItem(
                specialAbility + defaultTN,
                'special-ability',
                '',
                0,
                0,
                0
              ),
            ]);
          }
        } else if (specialAbility === 'Thing of Terror') {
          try {
            const thingOfTerrorTN = pastedSpecialAbilities
              .match(/Thing of Terror \(.+\)/i)[0]
              .replace(/Thing of Terror/i, '');

            actor.createEmbeddedDocuments('Item', [
              buildItem(
                specialAbility + thingOfTerrorTN.toUpperCase(),
                'special-ability',
                '',
                0,
                0,
                0
              ),
            ]);
          } catch (error) {
            actor.createEmbeddedDocuments('Item', [
              buildItem(
                specialAbility + defaultTN,
                'special-ability',
                '',
                0,
                0,
                0
              ),
            ]);
          }
        } else {
          actor.createEmbeddedDocuments('Item', [
            buildItem(specialAbility, 'special-ability', '', 0, 0, 0),
          ]);
        }
      }
    }
  } catch (error) {
    console.error(error);
    ui.notifications.warn(
      game.i18n.localize(
        'TOR1E-NPC-PARSER.notifications.specialAbilityNotFound'
      )
    );
  }

  // Makes sure the actor has the latest data added and displays the new sheet.
  actor.update(npcData);
  const torSheet = foundry.documents.collections.Actors.registeredSheets.find(
    x => x.name === 'Tor1eAdversarySheet'
  );
  const sheet = new torSheet(actor);
  sheet.render(true);
}
