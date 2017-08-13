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
    let raceQuery = null;

    if (raceTag == '_without-race') {
        let races = getAllRaces();
        raceQuery = {tags: {$nin: races}};
    } else if (raceTag) {
        tagList.push({tags: raceTag});
    }


    if (tagList.length > 0) {
        filter = lodash.assign(filter, { $and: tagList });
    } else if (raceQuery) {
        filter = lodash.assign(filter, raceQuery);
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

let getAllRaces = function() {
    return getAllTags({}).filter(tag => lodash.startsWith(tag, '_race_'));
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

        let tagWithRace = ['_without-race'];

        tagWithRace = uniqTags.reduce(
            (list, tag) => {
                if(lodash.includes(tag, '_race_')) {
                    return list.concat(tag)
                }

                return list;
            },
            tagWithRace
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
    'click .filter-type input': function(e) {
        Session.set('filterType', e.target.value);
        resetTagFilter();
        resetRaceFilter();
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
        resetTagFilter();
    },
});

// resetTagFilter и resetRaceFilter исправляют следующий баг:
// При если выбрать фильтр по тегу или рассе, а потом поменять другие фильтры
// так, чтобы кант не оказалось, в изначальном фильтре значение поменяется на
// '', но при этом не вызовится событие change.
// setTimeout нужен, потому, что действия после Session.set не успевают отработать.
function resetTagFilter() {
    setTimeout(() => {
        let tagInputValue = $('.cards-editor__tag-selector').val();
        Session.set('searchTag', tagInputValue);
    }, 0);
}

function resetRaceFilter() {
    setTimeout(() => {
        let tagInputValue = $('.cards-editor__race-selector').val();
        Session.set('raceTag', tagInputValue);
    }, 0);
}
