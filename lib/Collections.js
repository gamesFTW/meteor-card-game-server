MeteorApp = {};

MeteorApp.data = {
    playerId: null
};

MeteorApp.CardsInGame = new Mongo.Collection("CardsInGame");
MeteorApp.Cards = new Mongo.Collection("Cards");
MeteorApp.Decks = new Mongo.Collection("Decks");
MeteorApp.Games = new Mongo.Collection("Games");
MeteorApp.SoundPacks = new Mongo.Collection("SoundPacks");


var imageStore = new FS.Store.GridFS("Images", {});

MeteorApp.Images = new FS.Collection("Images", {
    stores: [imageStore]
});


var soundStore = new FS.Store.GridFS("Sounds", {});

MeteorApp.Sounds = new FS.Collection("Sounds", {
    stores: [soundStore]
});
