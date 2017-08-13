function renameTag(oldName, newName) {
    let cards = MeteorApp.Cards.find({tags: oldName}).fetch();

    cards.forEach(card => {
        console.log('******');
        console.log(card.tags);
        lodash.remove(card.tags, tag => tag == oldName);
        card.tags.push(newName);
        MeteorApp.Cards.update(card._id, card);
        console.log(card.tags);
    });
}
