export function buildItem(
  name,
  type,
  description,
  skill,
  damage,
  injury,
  protection,
  calledShot,
  edge,
  twoHandWeapon
) {
  console.log(`TOR 1E NPC PARSER | started buildItem() with ${name}`);
  const distinctiveFeatureData = {
    name: '',
    type: 'trait',
    img: 'systems/tor1e/assets/images/icons/distinctive_feature.png',
    system: {
      description: {
        value: '',
        type: 'String',
        label: 'tor1e.common.description',
      },
      group: {
        value: 'distinctiveFeature',
        type: 'String',
        label: 'tor1e.traits.details.traitGroup',
      },
    },
    effects: [],
    flags: {},
  };

  const specialAbilityData = {
    name: '',
    type: 'special-ability',
    img: 'systems/tor1e/assets/images/icons/adversary_special-ability.png',
    system: {
      description: {
        value: '',
        type: 'String',
        label: 'tor1e.common.description',
      },
      active: {
        value: false,
        type: 'Boolean',
        label: 'tor1e.specialAbilities.details.active',
      },
      cost: {
        value: 0,
        type: 'Number',
        label: 'tor1e.specialAbilities.details.cost',
      },
    },
    effects: [],
    flags: {},
  };

  const weaponData = {
    name: '',
    type: 'weapon',
    img: '',
    system: {
      equipped: {
        value: false,
      },
      damage: {
        value: null,
      },
      edge: {
        value: null,
      },
      injury: {
        value: null,
      },
      group: {
        value: '',
      },
      calledShot: {
        value: '',
      },
      skill: {
        value: null,
        favoured: {
          value: false,
        },
        roll: {
          associatedAttribute: 'strength',
        },
      },
      ranged: {
        value: false,
        type: 'Boolean',
        short: {
          value: 5,
        },
        medium: {
          value: 10,
        },
        long: {
          value: 20,
        },
      },
      twoHandWeapon: {
        value: false,
      },
      notes: {
        value: '-',
      },
    },
  };

  const armourData = {
    name: 'Armour',
    type: 'armour',
    img: 'systems/tor1e/assets/images/icons/adversary_armour.png',
    system: {
      load: {
        value: 0,
      },
      equipped: {
        value: false,
      },
      protection: {
        value: 0,
      },
      group: {
        value: 'leather',
      },
    },
  };

  if (type === 'trait') {
    distinctiveFeatureData.name = name;
    distinctiveFeatureData.type = type;
    return distinctiveFeatureData;
  } else if (type === 'special-ability') {
    specialAbilityData.name = name;
    specialAbilityData.type = type;
    specialAbilityData.system.description.value = description;
    return specialAbilityData;
  } else if (type === 'weapon') {
    console.log('?????????????????????? -- Weapons -- ', weaponData);
    weaponData.name = name;
    weaponData.type = type;
    weaponData.system.skill.value = skill;
    weaponData.system.damage.value = damage;
    weaponData.system.injury.value = injury;
    weaponData.system.calledShot.value = calledShot;
    weaponData.system.edge.value = edge;
    weaponData.system.twoHandWeapon.value = twoHandWeapon;
    // Choose correct image and group
    if (/axe|club|cudgel|dagger|hammer|knife|mattock/i.test(name)) {
      weaponData.img =
        'systems/tor1e/assets/images/icons/adversary_weapon_close.png';
      weaponData.system.group.value = 'tor1e.weapons.groups.axes';
    } else if (/bow/i.test(name)) {
      weaponData.img =
        'systems/tor1e/assets/images/icons/adversary_weapon_ranged.png';
      weaponData.system.group.value = 'tor1e.weapons.groups.bows';
    } else if (/beak|bite|claw|crush|ensnare|rake|rend|sting/i.test(name)) {
      weaponData.img =
        'systems/tor1e/assets/images/icons/adversary_weapon_bestial.png';
      weaponData.system.group.value = 'tor1e.weapons.groups.bestial';
    } else if (/spear/i.test(name)) {
      weaponData.img =
        'systems/tor1e/assets/images/icons/adversary_weapon-spear.png';
      weaponData.system.group.value = 'tor1e.weapons.groups.spears';
    } else if (/blade|scimitar|sword/i.test(name)) {
      weaponData.img =
        'systems/tor1e/assets/images/icons/adversary_weapon-scimitar.png';
      weaponData.system.group.value = 'tor1e.weapons.groups.swords';
    }
    return weaponData;
  } else if (type === 'armour') {
    if (name === 'Shield') {
      switch (protection) {
        case 0:
          break;
        case 1:
          armourData.name = 'Buckler';
          armourData.system.group.value = 'shield';
          armourData.system.protection.value = protection;
          return armourData;
        case 2:
          armourData.name = 'Shield';
          armourData.system.group.value = 'shield';
          armourData.system.protection.value = protection;
          return armourData;
        case 3:
          armourData.name = 'Great shield';
          armourData.system.group.value = 'shield';
          armourData.system.protection.value = protection;
          return armourData;
      }

      armourData.name = '';
      armourData.system.group.value = 'shield';
      armourData.system.protection.value = protection;
      return armourData;
    } else {
      armourData.name = 'Armour';
      armourData.system.protection.value = protection;
      return armourData;
    }
  } else {
    console.log(`Type ${type} not found`);
  }
}
