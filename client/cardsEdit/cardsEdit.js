var getCards = function() {
    var title = Session.get('searchCardTitle') || '';
    var titleRe = new RegExp(title, 'i');

    var text = Session.get('searchCardText') || '';
    var textRe = new RegExp(text, 'i');

    var filter = { title: titleRe, text: textRe };

    var order = Session.get('order') || 'date';
    var sort = {};

    if (order == "date") {
        sort[order] = -1;
    } else {
        sort[order] = 1;
    }

    var filterType = Session.get('filterType');
    if (filterType === 'heroes') {
        filter = lodash.assign(filter, { hero: true , type: 'creature', draft: false, summoned: false });
    } else if (filterType === 'creatures') {
        filter = lodash.assign(filter, { hero: false , type: 'creature', draft: false, summoned: false });
    } else if (filterType === 'spells') {
        filter = lodash.assign(filter, { type: 'spell', draft: false, summoned: false });
    } else if (filterType === 'areas') {
        filter = lodash.assign(filter, { type: 'area', draft: false, summoned: false});
    } else if (filterType === 'drafts') {
        filter = lodash.assign(filter, { draft: true });
    }  else if (filterType === 'summoneds') {
        filter = lodash.assign(filter, { summoned: true });
    }

    return MeteorApp.Cards.find(
        filter,
        { sort }
    );
};


Meteor.typeahead.inject();


Template.cardsEdit.helpers({
    quantity: function() {
        return getCards().count();
    },
    cards: getCards,
    getSearchCardTitle: function () {
        return Session.get('searchCardTitle') || '';
    }
});


Template.cardsEdit.events({
    'click .add-card-btn': function() {
        MeteorApp.Cards.insert({
            title: 'Новая карта',                   // название
            health: 1,                              // здоровье
            dmg: 0,                                 // урон
            mana: 1,                                // мана
            counter: 0,                             // счетчик на карте(монетка)
            type: 'creature',                       // area/spell/creature
            text: 'Описание',                       // Описание карты
            date: new Date(),                       // дата-время создания
            hero: false,                            // гейро ли?
            big: false,                             // большая крича 2х2?
            draft: false,                           // в разработке? драфт?
            summoned: false,                        // является ли саммонедом
            imageId: MeteorApp.Images.findOne()._id // id картинки
        });
    },
    'keyup .cards-editor__card-search': function(e) {
        Session.set('searchCardTitle', e.target.value);
    },
    'click .filter-type': function(e) {
        Session.set('filterType', e.target.value);
    },
    'keyup .cards-editor__card-text-search': function(e) {
        Session.set('searchCardText', e.target.value);
    },
    'click .cardsEdit__order': function(e) {
        Session.set('order', e.target.value);
    }
});


Template.cardEdit.helpers({
    cardTypes: ['creature', 'area', 'spell'],

    image: function () {
        return MeteorApp.Images.findOne(this.imageId);
    },

    imageName: function () {
        var image = MeteorApp.Images.findOne(this.imageId);
        return image ? image.original.name : '';
    },

    images: function() {
        return MeteorApp.Images.find().map(i => ({id: i._id, value: i.original.name}));
    },
    
    imageSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit').find('input[name="imageId"]').val(suggestion.id);
        
        $(e.target).closest('.cardEdit').submit();
    },
    
    itMustHaveImage: function () {
        return this.type !== 'spell';
    }
    
});

Template.cardEdit.rendered = function () {
    Meteor.typeahead.inject();
};

Template.cardEdit.events({
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

        var card = lodash.assign(this, {
            title: event.target.title.value,
            health: Number(event.target.health.value),
            text: event.target.text.value,
            dmg: Number(event.target.dmg.value),
            mana: Number(event.target.mana.value),
            counter: Number(event.target.counter.value),
            type: event.target.type.value,
            hero: Boolean(event.target.hero.checked),
            big: Boolean(event.target.big.checked),
            draft: Boolean(event.target.draft.checked),
            summoned: Boolean(event.target.summoned.checked),
            imageId: event.target.imageId.value
        });

        // for old cards
        card.date = card.date || new Date();

        MeteorApp.Cards.update(this._id, card);

        var $form = $(event.target);

        blinkGreenBorder($form);
    },
    
    //TODO удалить так как решение в лоб
    "click .cardEdit__createTestGame": function (e) {
        var card = this;
        
        var playerId = 'test_images';
        
        var deck = MeteorApp.getDeck(playerId);

        MeteorApp.clearDeck(playerId);
        MeteorApp.addCardToHandDeck(playerId, card._id);
        
        // Создаем героя для теста арий
        var heroCard = MeteorApp.Cards.findOne({hero: true});
        MeteorApp.addCardToHandDeck(playerId, heroCard._id);
        
        var gameId = MeteorApp.createLobbyGame(deck._id);
        MeteorApp.startLobbyGame(gameId);
        window.location = '/game/' + gameId + '/' + deck._id;
    }
});


var blinkGreenBorder = function($selector) {
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
