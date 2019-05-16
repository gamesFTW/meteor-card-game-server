MeteorApp.schemeAbilities =  {
  "id": "Abilities",
  "title": "Abilities",
  "type": "object",
  "properties": {
    "range": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "range": {
          "type": "number"
        }
      },
      "required": [
        "range",
        "blockedInBeginningOfTurn"
      ]
    },
    "firstStrike": {
      "type": "boolean",
      "format": "checkbox"
    },
    "armored": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "armor": {
          "type": "number"
        }
      },
      "required": [
        "armor"
      ]
    },
    "vampiric": {
      "type": "boolean",
      "format": "checkbox"
    },
    "noEnemyRetaliation": {
      "type": "boolean",
      "format": "checkbox"
    },
    "piercing": {
      "type": "boolean",
      "format": "checkbox"
    }
  },
  "additionalProperties": false
}
