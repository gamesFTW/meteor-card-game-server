MeteorApp = {};

MeteorApp.CardsInGame = new Mongo.Collection("CardsInGame");
MeteorApp.Cards = new Mongo.Collection("Cards");
MeteorApp.Decks = new Mongo.Collection("Decks");
MeteorApp.Actions = new Mongo.Collection("Actions");
MeteorApp.Games = new Mongo.Collection("Games");


var imageStore = new FS.Store.GridFS("Images", {});

MeteorApp.Images = new FS.Collection("Images", {
  stores: [imageStore]
});
