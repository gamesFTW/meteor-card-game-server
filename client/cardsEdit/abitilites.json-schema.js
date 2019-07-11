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
        "range"
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
    },
    "speed": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "speed": {
          "type": "number"
        }
      },
      "required": [
        "speed"
      ]
    },
    "flanking": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "damage": {
          "type": "number"
        }
      },
      "required": [
        "damage"
      ]
    },
    "healing": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "range": {
          "type": "number"
        },
        "heal": {
          "type": "number"
        }
      },
      "required": [
        "range",
        "heal"
      ]
    },
    "push": {
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
          "range"
      ]
    },
    "ricochet": {
      "type": "boolean",
      "format": "checkbox"
    },
    "block": {
      "type": "object",
      "options": {
        "collapsed": true
      },
      "additionalProperties": false,
      "properties": {
        "range": {
          "type": "number"
        },
        "blockingDamage": {
          "type": "number"
        }
      },
      "required": [
        "range",
        "blockingDamage"
      ]
    }
  },
  "additionalProperties": false
}
