Template.game.helpers({
    summonWindow: () => Session.get('summonWindow'),


    creatures: function() {
        return MeteorApp.Cards.find().map(i => ({id: i._id, value: i.title}));
    },

    summonSelected: function (e, suggestion) {
        Session.set('summonWindow', false);

        Meteor.call(
            'createCardInPlayerHand',
            MeteorApp.data.gameId,
            MeteorApp.data.currentPlayerId,
            suggestion.id
        );
    }
});


Template.game.rendered = function () {
    $(window).on('keydown', function (e) {
        var sKey = 83;
        var escKey = 27;
        var summonWindow = Session.get('summonWindow');

        if (e.which == sKey && !summonWindow) {
            Session.set('summonWindow', true);

            setTimeout(function() {
                $('.game__summon-window-input').focus();
            }, 0);// Горжусь собой
        }

        if (e.which == escKey) {
            Session.set('summonWindow', false);
        }
    });

    Meteor.typeahead.inject();
};
