var Card = MeteorApp.Card;

if (Card.find().count() == 0) {
    Card.insert({x: 0, y: 0});
    Card.insert({x: 0, y: 1});
    Card.insert({x: 0, y: 2});
}
