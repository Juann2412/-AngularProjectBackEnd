let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({
    id: Number,
    eleve: String,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    matiere:   Number ,
    note :Number,
    remarque: String
});

// Pour ajouter la pagination
AssignmentSchema.plugin(aggregatePaginate);
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
