## v0.2.6
Now it should finally work with both V10 and V11 of FoundryVTT.

## v0.2.2
Updated manifest to be compatible with V11

## v0.2.1
Updated max core version compatibility.

## v0.2.0
Added support for all creatures in Bree and Darkening of Mirkwood

Improvements
* Correctly parses weapons for creatures with no special abilities
* Now correctly checks box if the weapon uses 2 hands

Fixed issues
* Special Abilities should not now create duplicates or be confused (before Great Leap would also trigger creation of Great Size and both would be added).

Known Issues
* The Messenger of Mordor's weapons do not parse correctly. The cause is unknown as other ringwraiths parse correctly.
* Darkening of Mirkwood Spiders have to type of beak attacks with the same name but different stats. Currently they are both added to the statsheet.

## v0.1.0

Initial release
