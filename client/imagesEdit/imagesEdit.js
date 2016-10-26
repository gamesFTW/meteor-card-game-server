Template.imagesEdit.helpers({
    images: function() {
        return MeteorApp.Images.find({}, { sort: { 'original.name': 1 } });
    }
});


Template.imagesEdit.events({
    "click .delete-image": function (e) {
        if (confirm("Точно точно удалить?")) {
            MeteorApp.Images.remove(this._id);
        }
    },
    'change .image-upload': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            MeteorApp.Images.insert(file, function (err, fileObj) {

            }.bind(this));
        }.bind(this));
    }
});
