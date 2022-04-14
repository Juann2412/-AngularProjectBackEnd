let Matiere = require('../model/matiere');

// Récupérer tous les assignments (GET)
function getMatiere(req, res){
    Matiere.find((err, matiere) => {
        if(err){
            res.send(err)
        }

        res.send(matiere);
    });
}


module.exports = { getMatiere };
