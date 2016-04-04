var getCards = function() {
    var title = Session.get('searchCardTitle') || '';
        var titleRe = new RegExp(title, 'i');
        return MeteorApp.Cards.find(
            { title: titleRe },
            { sort: {date: -1}}
        );
};


Template.cardsEdit.helpers({
    quantity: function() {
        return getCards().count();
    },
    cards: getCards
});


Template.cardsEdit.events({
    'click .add-card-btn': function() {
        MeteorApp.Cards.insert({
            title: 'Новая карта',
            health: 1,
            dmg: 0,
            mana: 1,
            counter: 0,
            type: 'creature',
            imageName: 'ninja',
            text: 'Описание',
            date: new Date(),
            hero: false,
            imageId: MeteorApp.Images.findOne()._id
        });
    },
    'keyup .card-search': function(e) {
        Session.set('searchCardTitle', e.target.value);
    }

});


Template.cardEdit.helpers({
    cardTypes: ['creature', 'area', 'spell'],
    image: function () {
        return MeteorApp.Images.findOne({_id: this.imageId});
    },
    images: function() {
        return MeteorApp.Images.find({});
    }
});


Template.cardEdit.events({
    "change .cardEdit__images": function(e) {
        this.imageId = e.target.value;
        MeteorApp.Cards.update(this._id, this);
    },

    "click .card-remove": function(e) {
        e.preventDefault();
        if (confirm("Точно точно удалить " + this.title + "?")) {
            MeteorApp.Cards.remove(this._id);
        }
    },

    'blur .cardEdit__blurSave': function(e) {
        $(e.target).parent('.cardEdit').submit();
    },

    'click t .cardEdit__clickSave': function(e) {
        $(e.target).parent('.cardEdit').submit();
    },

    "submit .cardEdit": function(event) {
        event.preventDefault();

        var card = lodash.assign(this, {
            title: event.target.title.value,
            health: Number(event.target.health.value),
            text: event.target.text.value,
            imageName: event.target.imageName.value,
            dmg: Number(event.target.dmg.value),
            mana: Number(event.target.mana.value),
            counter: Number(event.target.counter.value),
            type: event.target.type.value,
            hero: Boolean(event.target.hero.checked)
        });

        // for old cards
        card.date = card.date || new Date();

        MeteorApp.Cards.update(this._id, card);

        var $form = $(event.target);

        blinkGreenBorder($form);
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
