Template.cardsEdit.helpers({
    cards: MeteorApp.Cards.find({})
});

Template.cardsEdit.events({
    'click .add-card': function() {
        MeteorApp.Cards.insert({title: 'Новая карта'});
    }
});


Template.cardEdit.helpers({
    cardTypes: ['creature', 'area', 'spell']

});

Template.cardEdit.events({
    "click .card-remove": function(e) {
        e.preventDefault();
        MeteorApp.Cards.remove(this._id);
    },


    "submit .cardEdit": function(e) {
        e.preventDefault();
        var card = {
            title: event.target.title.value,
            health: event.target.health.value,
            text: event.target.text.value,
            imageName: event.target.imageName.value,
            dmg: event.target.dmg.value,
            mana: event.target.mana.value,
            type: event.target.type.value
        };

        MeteorApp.Cards.update(this._id, card);
    }
});