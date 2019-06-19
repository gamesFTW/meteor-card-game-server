Template.soundsEdit.helpers({
    sounds: function() {
        return MeteorApp.Sounds.find({}, { sort: { 'original.name': 1 } });
    }
});


Template.soundsEdit.events({
    "click .delete-sound": function (e) {
        if (confirm("Точно точно удалить?")) {
            MeteorApp.Sounds.remove(this._id);
        }
    },
    'change .sound-upload': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            MeteorApp.Sounds.insert(file, function (err, fileObj) {

            }.bind(this));
        }.bind(this));
    }
});
