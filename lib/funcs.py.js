UI.registerHelper('equals', function (a, b) {
    return a === b;
});

UI.registerHelper('not', function (a) {
    return !a;
});

function isAIDeck(deck) {
    return deck.name.startsWith("AI");
}
