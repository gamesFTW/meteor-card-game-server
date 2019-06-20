Template.cardEdit.helpers({
    cardTypes: ['creature', 'area', 'spell'],

    image: function () {
        return MeteorApp.Images.findOne(this.imageId);
    },

    sound: function () {
        return MeteorApp.Sounds.findOne(this.soundId);
    },

    imageName: function () {
        let image = MeteorApp.Images.findOne(this.imageId);
        return image ? image.original.name : '';
    },

    images: function () {
        return MeteorApp.Images.find().map(i => ({id: i._id, value: i.original.name}));
    },

    sounds: function () {
        return MeteorApp.Sounds.find().map(i => ({id: i._id, value: i.original.name}));
    },
    
    imageSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit').find('input[name="imageId"]').val(suggestion.id);
        
        $(e.target).closest('.cardEdit').submit();
    },

    soundSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit__sound').find('input[name="soundId"]').val(suggestion.id);

        $(e.target).closest('.cardEdit').submit();
    },
    
    itMustHaveImage: function () {
        return this.type !== 'spell';
    },

    isShowAbilities: function () {
        return Session.get('showAbilities');
    },

    tagsList: function () {
        let notUniqTags = MeteorApp.Cards.find().fetch().reduce((list, c) => {
            if(c.tags) {
                return list.concat(c.tags)
            }
            return list;
        }, []);

        return _.uniq(notUniqTags).map(c => ({value: c}));
    },

    tagsToStr: function () {
        let tags = this.tags || [];
        return tags.join(',');
    },

    tagsSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit').find('[name="add-tag"]').typeahead('val', '');
        addTagToCard($(e.target).closest('.cardEdit'), suggestion.value);
    },

    cardSounds: function() {
        let soundsList = [];
        for (let sound in this.sounds) {
            soundsList.push(this.sounds[sound]);
        }
        return soundsList;
    }
});


Template.cardEdit.events({
    "click .cardEdit__addSound": function(e) {
        e.preventDefault();

        let sounds = this.sounds ? this.sounds : {};
        sounds.new = {soundName: 'new'};

        this.sounds = sounds;

        MeteorApp.Cards.update(this._id, this);
    },
    "click .cardEdit__saveSounds": function(e) {
        e.preventDefault();

        $(e.target).closest('.cardEdit').submit();
        var element = $(e.target).closest('.cardEdit').find('.cardEdit__sounds').toggle();
    },
    "click .cardEdit__remove-sound": function(e) {
        e.preventDefault();

        let soundName = $(e.currentTarget).parent().find('[name="soundName"]').val();

        delete this.sounds[soundName];

        MeteorApp.Cards.update(this._id, this);
    },
    "click .cardEdit__add-tag": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject(e.currentTarget);
            $(target).focus();
        }
    },
    "click .cardEdit__imageId": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject(e.currentTarget);
            $(target).focus();
        }
    },
    "click .cardEdit__attackSoundId": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject(e.currentTarget);
            $(target).focus();
        }
    },
    "click .card-remove": function(e) {
        e.preventDefault();
        if (confirm("Точно точно удалить " + this.name + "?")) {
            MeteorApp.Cards.remove(this._id);
        }
    },

    "click .cardEdit__toogleAbilities": function(e) {
        e.preventDefault();
        var element = $(e.target).closest('.cardEdit').find('.cardEdit__abilities')[0];
        toogleAbilities(element, this.abilities);
    },

    "click .cardEdit__toogleSounds": function(e) {
        e.preventDefault();
        var element = $(e.target).closest('.cardEdit').find('.cardEdit__sounds').toggle();
    },

    'click .cardEdit__saveAbilities': function(e) {
        e.preventDefault();
        if (window.editor) {
            var errors = editor.validate();
            if (errors.length) {
                console.error(errors, editor.getValue());
                alert('hui tebe sm console');
            } else {
                var abilities = getNotDefaultFromAbilities(editor.getValue());
                // save
                MeteorApp.Cards.update({_id: this._id}, { 
                    $set: {
                        abilities: abilities
                    }
                });

                // toogle Abilities
                var element = $(e.target).closest('.cardEdit').find('.cardEdit__abilities')[0];
                toogleAbilities(element, this.abilities);
                let $form = $(e.target).closest('.cardEdit');
                blinkGreenBorder($form);
            }
        }
    },
    
    'blur .cardEdit__blurSave': function(e) {
        $(e.target).closest('.cardEdit').submit();
    },

    'click .cardEdit__clickSave': function(e) {
        $(e.target).closest('.cardEdit').submit();
    },
    
    'change .cardEdit__changeSave': function(e) {
        $(e.target).closest('.cardEdit').submit();
    },

    "submit .cardEdit": function(event) {
        event.preventDefault();

        let sounds = {};

        let soundsElement = $(event.currentTarget).find('.cardEdit__sound');
        soundsElement.each(function() {
            let soundName = $(this).find('[name="soundName"]').val();
            let fileName = $(this).find('.cardEdit__attackSoundId').eq(1).val();
            let soundId = $(this).find('[name="soundId"]').val();

            sounds[soundName] = {
                soundName, fileName, soundId
            };
        });

        let card = lodash.assign(this, {
            name: event.target.name.value,
            maxHp: Number(event.target.maxHp.value),
            text: event.target.text.value,
            damage: Number(event.target.damage.value),
            manaCost: Number(event.target.manaCost.value),
            counter: Number(event.target.counter.value),
            type: event.target.type.value,
            hero: Boolean(event.target.hero.checked),
            big: Boolean(event.target.big.checked),
            tags: _.uniq(event.target.tags.value.split(',')),
            draft: Boolean(event.target.draft.checked),
            summoned: Boolean(event.target.summoned.checked),
            imageId: event.target.imageId.value,
            sounds: sounds
        });

        // for old cards
        card.date = card.date || new Date();

        MeteorApp.Cards.update(this._id, card);

        let $form = $(event.target);

        blinkGreenBorder($form);
    },

    "keypress .cardEdit__add-tag": function (e, template) {
        // if enter pressed
        if (e.which === 13) {
            e.preventDefault();
            addTagToCard($(e.target).closest('.cardEdit'), e.target.value);
            $(e.target).typeahead('val', '');
        }
    },
    
    "click .cardEdit__remove-tag": function (e) {
        if (confirm('Точно?')) {
            let tag = $(e.target).data('value');
            removeTagFromCard($(e.target).closest('.cardEdit'), tag);
        }
    },
    
});

function addTagToCard($cardEdit, tag) {
    let $tagsStorage = $cardEdit.find('.cardEdit__tags-storage');
    if ($tagsStorage.val()) {
        $tagsStorage.val($tagsStorage.val() + ','+ tag);
    } else {
        $tagsStorage.val(tag);
    }
    $cardEdit.submit();
}

function removeTagFromCard($cardEdit, tag) {
    let $tagsStorage = $cardEdit.find('.cardEdit__tags-storage');
    let tags = $tagsStorage.val().split(',');
    let tagsWithoutRemoveTag = _.without(tags, tag);
    $tagsStorage.val(tagsWithoutRemoveTag.join(','));

    $cardEdit.submit();
}


let blinkGreenBorder = function($selector) {
    $selector
        .delay(1)
        .queue(function (next) {
            $(this).css({'borderColor': 'green'});
            next();
        })
        .delay(2000)
        .queue(function (next) {
            $(this).removeAttr('style');
            next();
        });
};


function getNotDefaultFromAbilities (obj) {
    var newObj = {};
    var def = window.defaultAbilities;
    _.forEach(obj, function(value, key) {
        if (typeof value == "object") {
            if (!_.isEqual(def[key], value)) {
                newObj[key] = value;
            }
        } else {
            if (def[key] !== value) {
                newObj[key] = value;
            }
        }
    });

    return newObj;
}

function toogleAbilities (element, abilities) {
    var show = Session.get('showAbilities', false);
    show = !show;
    Session.set('showAbilities', show);

    if (show) {
        editor = new JSONEditor(element, { 
            schema: MeteorApp.schemeAbilities,
            disable_properties: true,
            disable_edit_json: true,
            // Seed the form with a starting value
            startval: abilities || {},
            // Disable additional properties
            // no_additional_properties: true,
            // Require all properties by default
            required_by_default: false,
            display_required_only: true,
           
        });
    } else {
        window.editor && editor.destroy();
    }
}
