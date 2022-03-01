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
  const [nameFirst] = originalText.split('\n');
  console.log(`TOR 1E NPC PARSER | parsing Name`);
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
  } catch (error) {
    console.error(error);
  }

  ///// WEAPON SKILLS /////
  console.log(`TOR 1E NPC PARSER | parsing Weapon Skills`);

  const adversaryWeapons = {
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
      calledShot: 'tor1e.weapons.calledShots.breakShield',
    },
    orcAxe: {
      name: 'Orc-axe',
      damage: 5,
      edge: 11,
      injury: 16,
      calledShot: 'tor1e.weapons.calledShots.breakShield',
    },
    spear: {
      name: 'Spear',
      damage: 4,
      edge: 9,
      injury: 12,
      calledShot: 'tor1e.weapons.calledShots.pierce',
    },
  };

  try {
    const weaponSkillsArr = originalText
      .match(/WEAPON SKILLS\n(.*)SPECIAL ABILITIES/is)[0]
      .replace(/WEAPON SKILLS\n/i, '')
      .replace(/\nSPECIAL ABILITIES/i, '')
      .split(/\n/);
    weaponSkillsArr.forEach(element => {
      const name = element.match(/\D*(\dh)*\D*/)[0].trim();
      const skill = element.match(/\d+/)[0];

      Object.values(adversaryWeapons).forEach(element => {
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

      // const name = element.name;
      // const damage = element.damage;
      // const edge = element.edge;
      // const injury = element.injury;
      // const calledShot = element.calledShot;

      // actor.createEmbeddedDocuments('Item', [
      //   buildItem(
      //     name,
      //     'weapon',
      //     '',
      //     Number(skill),
      //     damage,
      //     injury,
      //     0,
      //     calledShot
      //   ),
      // ]);
    });
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
  if (/Orc|Goblin|Uruk|Snaga|Lugburz|Hags|Pale Ones/i.test(npcData.name)) {
    if (statblockFormat === 'crb') {
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hatred (subject)',
          'fell-ability',
          'Not all orcs have this ability, but the LM may add it if they desire. Simply remove if not desired. Description can be found on page 148 of the Core Rule Book.'
        ),
      ]);
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hate Sunlight',
          'fell-ability',
          'Description can be found on page 148 of the Core Rule Book.'
        ),
      ]);
      ui.notifications.info(
        'Hatred (subject) and Hate Sunlight ' +
          game.i18n.localize(
            'TOR1E-NPC-PARSER.notifications.fellAbilitiesByType'
          )
      );
    } else if (statblockFormat === 'adversary-conversion') {
      actor.createEmbeddedDocuments('Item', [
        buildItem(
          'Hatred (subject)',
          'fell-ability',
          'Description can be found on page 4  of the Adversary Conversion pdf.'
        ),
      ]);
      ui.notifications.info(
        'Hatred (subject) ' +
          game.i18n.localize(
            'TOR1E-NPC-PARSER.notifications.fellAbilitiesByType'
          )
      );
    }
  } else if (/Troll|Ettins|Ogre/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hideous Toughness',
        'fell-ability',
        'Description can be found on page 151 of the Core Rule Book or page 8 of the Adversary Conversion pdf.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Dull-witted',
        'fell-ability',
        'Description can be found on page 151 of the Core Rule Book or page 8 of the Adversary Conversion pdf.'
      ),
    ]);
    ui.notifications.info(
      'Hideous Toughness and Dull-witted ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Wight|Marsh|Wraith|Bog Soldiers|Spectres/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Deathless',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Heartless',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Strike Fear',
        'fell-ability',
        'Description can be found on page 154'
      ),
    ]);
    ui.notifications.info(
      'Deathless, Heartless, and Strike Fear ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Wolf|Hound/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Great Leap',
        'fell-ability',
        'Description can be found on page 156'
      ),
    ]);
    ui.notifications.info(
      'Great Leap ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Attercop|Spider/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Poison',
        'fell-ability',
        'If a Sting attack results in a Wound, the target is also poisoned.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Web',
        'fell-ability',
        'If and attack with the Web quality successfully hits a target, that target is webbed and unable to move. The webbed target cannot change stance and suffers –4 to their Parry rating. The webbed target may free themselves by succeeding on an ATHLETICS roll.'
      ),
    ]);
    ui.notifications.info(
      'Poison and Web ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Bat|Shadow/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Hate Sunlight',
        'fell-ability',
        'The creature loses 1 Hate at the start of each round it is exposed to the full light of the sun.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Denizen of the Dark',
        'fell-ability',
        'All attack rolls are Favoured while in darkness.'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Fell Speed',
        'fell-ability',
        'At the beginning of each turn, this creature can choose which hero it engages regardless of restrictions, or it can abandon combat entirely.'
      ),
    ]);
    ui.notifications.info(
      'Hate Sunlight, Deizen of the Dark, and Fell Speed ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  } else if (/Huorns/i.test(npcData.name)) {
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Wandering Huorn',
        'fell-ability',
        'A wandering Huorn is most often a young tree whose heart darkened rapidly, and who is still quick of limb and root. (The Huorn template below is a Wandering Huorn).'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Denizen of the Dark',
        'fell-ability',
        'A dark-hearted Huorn may be a young tree awakened by a deep hatred, or an ancient monster brooding since uncounted centuries. (Increase Endurance by 15, Add +2 Hate Score, Add +1 Armor, Add +1 to Bough Lash Rating, Add Fell Ability Horrible Strength).'
      ),
    ]);
    actor.createEmbeddedDocuments('Item', [
      buildItem(
        'Fell Speed',
        'fell-ability',
        'A dark-hearted Huorn may be a young tree awakened by a deep hatred, or an ancient monster brooding since uncounted centuries. (Increase Endurance by 25, Add +3 Hate Score, Add +1 to Bough Lash Rating, Remove Fell Ability Hatred, Add Fell Abilities Horrible Strength, Strike Fear, and Thick Hide).'
      ),
    ]);
    ui.notifications.info(
      'Wandering Huorn, Denizen of the Dark, and Fell Speed ' +
        game.i18n.localize('TOR1E-NPC-PARSER.notifications.fellAbilitiesByType')
    );
  }

  // Makes sure the actor has the latest data added.
  actor.update(npcData);
}
