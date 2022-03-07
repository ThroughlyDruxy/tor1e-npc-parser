## Installation

Install from FoundryVTT setup / Add-on modules / Install module with Manifest URl : https://raw.githubusercontent.com/ThroughlyDruxy/tor1e-npc-parser/main/module.json

## Description

This module allows for copy and pasting a statblock directly from the book to create a adversary character sheet.

1. Navigate to actor tab in the sidebar and at the bottle will be a new button called "Parse Statblock". Click that.
2. A textbox will open. Copy directly from the PDF starting at the creatures name through till the final special ability. If no description exists copy from the creatures name.
4. Paste it into the textbox and hit Go.

It is somewhat tested and should work for all of the adversaries in the Core Rule Book. Support for other supplements will be coming in the future. If you have a particular book you'd like prioritized create an issue here on Github requesting it and I'll see what I can do. Additionally you can DM me on discord @ ThroughlyDruxy#4390.

## Known Issues
* Unfortunatly due to how the data is copied, the underlining to indicate something is favoured is not transferred over. So after copying, make sure to go through and favour the items that should be favoured.
* Due to how special abilities are parsed sometimes one ability will parse as two (such as Great Size causing both Great Size and Great Leap to be added). This is known so please always double check the special abilities and notify me (discord or an issue on github) of which statblock, which abilities and as much detail as possible.
* Only creatures from Core Rules will be parsed correctly right now as stated above. The selection will be expanded in the future.
* Special Abilities that include a TN (such as Thing of Terror) are not currently parsed.

## License
The One Ring, Middle-­earth, and The Lord of the Rings and the characters, items, events, and places therein are trademarks or registered trademarks of the Saul Zaentz Company d/b/a Middle-­earth Enterprises (SZC) and are used under license by Sophisticated Games Ltd. and their respective licensees. All rights reserved.
