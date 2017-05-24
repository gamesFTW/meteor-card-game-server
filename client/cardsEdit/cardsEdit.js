var addTypesToFilter = function(filter) {
    var filterType = Session.get('filterType');
    if (filterType === 'heroes') {
        filter = lodash.assign(filter, { hero: true , type: 'creature', draft: false, summoned: false });
    } else if (filterType === 'creatures' || filterType === null) {
        filter = lodash.assign(filter, { hero: false , type: 'creature', draft: false, summoned: false });
    } else if (filterType === 'spells') {
        filter = lodash.assign(filter, { type: 'spell', draft: false, summoned: false });
    } else if (filterType === 'areas') {
        filter = lodash.assign(filter, { type: 'area', draft: false, summoned: false });
    } else if (filterType === 'drafts') {
        filter = lodash.assign(filter, { draft: true });
    }  else if (filterType === 'summoneds') {
        filter = lodash.assign(filter, { summoned: true });
    }  else if (filterType === 'all') {
        filter = lodash.assign(filter, { draft: false });
    }

    return filter;
};


let getCards = function() {
    let title = Session.get('searchCardTitle') || '';
    let titleRe = new RegExp(title, 'i');

    let text = Session.get('searchCardText') || '';
    let textRe = new RegExp(text, 'i');

    let filter = { title: titleRe, text: textRe };

    let order = Session.get('order') || 'date';
    let sort = {};

    if (order == "date") {
    } else {
        sort[order] = 1;
    }
    sort['date'] = -1;

    addTypesToFilter(filter);


    let tagList = [];

    let searchTag = Session.get('searchTag') || null;
    if (searchTag) {
        tagList.push({tags: searchTag});
    }

    let raceTag = Session.get('raceTag') || null;
    if (raceTag) {
        tagList.push({tags: raceTag});
    }

    if (searchTag || raceTag) {
        filter = lodash.assign(filter, { $and: tagList} );
    }


    return MeteorApp.Cards.find(
        filter,
        { sort }
    );
};


let getAllTags = function(filter) {
    let cardsWithTags = MeteorApp.Cards.find(filter).fetch().reduce((list, c) => {
        if(c.tags) {
            return list.concat(c.tags)
        }
        return list;
    }, []);

    return _.uniq(cardsWithTags)
};


Template.cardsEdit.helpers({
    quantity: function() {
        return getCards().count();
    },
    cards: getCards,
    getSearchCardTitle: function () {
        return Session.get('searchCardTitle') || '';
    },
    tagsList: function () {
        let filter = {};

        addTypesToFilter(filter);

        let raceTag = Session.get('raceTag') || null;
        if (raceTag) {
            filter.tags = raceTag;
        }

        let uniqTags = getAllTags(filter);

        let tagWithoutRace = uniqTags.reduce(
            (list, tag) => {
                if(!lodash.includes(tag, '_race_')) {
                    return list.concat(tag)
                }

                return list;
            },
            []
        );

        return _.sortBy(tagWithoutRace, String);
    },
    raceList: function () {
        let filter = {};

        addTypesToFilter(filter);
        let uniqTags = getAllTags(filter);

        let tagWithRace = uniqTags.reduce(
            (list, tag) => {
                if(lodash.includes(tag, '_race_')) {
                    return list.concat(tag)
                }

                return list;
            },
            []
        );

        return _.sortBy(tagWithRace, String);
    },
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
            imageId: MeteorApp.Images.findOne()._id, // id картинки
            tags: []                                // теги
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
    },
    'change .cards-editor__tag-selector': function (e) {
        Session.set('searchTag', e.target.value);
    },
    'change .cards-editor__race-selector': function (e) {
        Session.set('raceTag', e.target.value);
    },
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
        var notUniqTags = MeteorApp.Cards.find().fetch().reduce((list, c) => {
            if(c.tags) {
                return list.concat(c.tags)
            }
            return list;
        }, []);

        return _.uniq(notUniqTags).map(c => ({value: c}));
    },

    tagsToStr: function () {
        var tags = this.tags || [];
        return tags.join(',');
    },

    tagsSelected: function (e, suggestion) {
        $(e.target).closest('.cardEdit').find('[name="add-tag"]').typeahead('val', '');
        addTagToCard($(e.target).closest('.cardEdit'), suggestion.value);
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
            tags: _.uniq(event.target.tags.value.split(',')),
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
            var tag = $(e.target).data('value');
            removeTagFromCard($(e.target).closest('.cardEdit'), tag);
        }
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


function addTagToCard($cardEdit, tag) {
    var $tagsStorage = $cardEdit.find('.cardEdit__tags-storage');
    if ($tagsStorage.val()) {
        $tagsStorage.val($tagsStorage.val() + ','+ tag);
    } else {
        $tagsStorage.val(tag);
    }
    $cardEdit.submit();
}

function removeTagFromCard($cardEdit, tag) {
    var $tagsStorage = $cardEdit.find('.cardEdit__tags-storage');
    var tags = $tagsStorage.val().split(',');
    var tagsWithoutRemoveTag = _.without(tags, tag);
    $tagsStorage.val(tagsWithoutRemoveTag.join(','));

    $cardEdit.submit();
}


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
