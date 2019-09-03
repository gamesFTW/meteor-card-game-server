const DEFAULT_SOUND_PACK = {
    attack: '',
    die: '',
    move: '',
    select: '',
    play: '',
};

Template.soundsEdit.helpers({
    sounds: function() {
        return MeteorApp.Sounds.find({}, { sort: { 'original.name': 1 } });
    },
    soundsList: function () {
        return MeteorApp.Sounds.find().map(i => ({id: i._id, value: i.original.name}));
    },
    soundPacks: function() {
        return MeteorApp.SoundPacks.find({}, { sort: { name: 1 } });
    },

    getSoundNameById: function(id) {
        if (id) {
            const sound = MeteorApp.Sounds.findOne(id);
            if (sound) {
                return sound.original.name;
            }
            return '';
        }
        return '';
    },

    getSoundUlrById: function(id) {
        if (id) {
            const sound = MeteorApp.Sounds.findOne(id);
            if (sound) {
                
                return sound.url();
            }
            return '';
        }
        return '';
    },

    soundSelected: function (e, suggestion) {
        $(e.target).closest('.soundpack__sound').find('input[name="soundId"]').val(suggestion.id);
        $(e.target).closest('.soundpack__form').submit();
    }
});


Template.soundsEdit.events({
    "click .delete-sound": function (e) {
        if (confirm("Точно точно удалить?")) {
            MeteorApp.Sounds.remove(this._id);
        }
    },
    'change .sound-upload': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            MeteorApp.Sounds.insert(file, function (err, fileObj) {
            }.bind(this));
        }.bind(this));
    },
    'click .soundpack__btn_add': function (e) {
        const name = $('.soundpack__name-input').val();
        if (!name) {
            alert('Insert name');
            return;
        }

        MeteorApp.SoundPacks.insert({
            name,
            sounds: DEFAULT_SOUND_PACK,
        });
        
    },
    "click .soundpack__input_sound": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject(e.currentTarget);
            $(target).focus();
        }
    },
    'click .soundpack__btn_remove': function (e) {
        if (confirm("Точно точно удалить?")) {
            MeteorApp.SoundPacks.remove(this._id);
        }
    },

    'submit .soundpack__form': function(e) {
        e.preventDefault();
        let soundsElement = $(e.currentTarget).find('.soundpack__sound');
        const sounds = this.sounds;
        soundsElement.each(function() {
            let soundName = $(this).find('[name="soundName"]').val();
            let soundId = $(this).find('[name="soundId"]').val();

            sounds[soundName] = soundId;
        });

        MeteorApp.SoundPacks.update(this._id, { ...this, sounds});
        
        return false
    }
});
