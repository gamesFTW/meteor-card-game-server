Template.cardEdit.helpers({
    cardTypes: ['creature', 'area', 'spell'],

    image: function () {
        return MeteorApp.Images.findOne(this.imageId);
    },

    imageName: function () {
        let image = MeteorApp.Images.findOne(this.imageId);
        return image ? image.original.name : '';
    },

    images: function () {
        return MeteorApp.Images.find().map(i => ({id: i._id, value: i.original.name}));
    },
    
    imageSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit').find('input[name="imageId"]').val(suggestion.id);
        
        $(e.target).closest('.cardEdit').submit();
    },
    
    itMustHaveImage: function () {
        return this.type !== 'spell';
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
    }
});


Template.cardEdit.events({
    "click .cardEdit__add-tag": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject();
            $(target).focus();
        }
    },
    "click .cardEdit__imageId": function(e) {
        let target = $(e.currentTarget);
        if(!target.hasClass('tt-input')) {
            Meteor.typeahead.inject();
            $(target).focus();
        }
    },
    "click .card-remove": function(e) {
        e.preventDefault();
        if (confirm("Точно точно удалить " + this.title + "?")) {
            MeteorApp.Cards.remove(this._id);
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

        let card = lodash.assign(this, {
            title: event.target.title.value,
            health: Number(event.target.health.value),
            text: event.target.text.value,
            dmg: Number(event.target.dmg.value),
            mana: Number(event.target.mana.value),
            counter: Number(event.target.counter.value),
            type: event.target.type.value,
            hero: Boolean(event.target.hero.checked),
            big: Boolean(event.target.big.checked),
            tags: _.uniq(event.target.tags.value.split(',')),
            draft: Boolean(event.target.draft.checked),
            summoned: Boolean(event.target.summoned.checked),
            imageId: event.target.imageId.value
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
    
    //TODO удалить так как решение в лоб
    "click .cardEdit__createTestGame": function (e) {
        let card = this;
        
        let playerId = 'test_images';
        
        let deck = MeteorApp.getDeck(playerId);

        MeteorApp.clearDeck(playerId);
        MeteorApp.addCardToHandDeck(playerId, card._id);
        
        // Создаем героя для теста арий
        let heroCard = MeteorApp.Cards.findOne({hero: true});
        MeteorApp.addCardToHandDeck(playerId, heroCard._id);
        
        let gameId = MeteorApp.createLobbyGame(deck._id);
        MeteorApp.startLobbyGame(gameId);
        window.location = '/game/' + gameId + '/' + deck._id;
    }
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
