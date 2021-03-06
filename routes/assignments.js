let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)

/*function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/
/*
function getAssignments(req, res){

    Assignment.aggregate([
        {
            $lookup : {
                from : 'matieres',
                localField : 'matiere',
                foreignField : 'id',
                as : 'matieres'
            }
        },{
            $unwind: "$matieres",
          },]).then( (result) =>{
        res.send(result)
    })
}
*/
function getAssignments(req, res){
    var isRendu = (req.query.rendu === 'true');
    var aggregateQuery = Assignment.aggregate([
        {
            $lookup : {
                from : 'matieres',
                localField : 'matiere',
                foreignField : 'id',
                as : 'matieres'
            }
        },{
            $unwind: "$matieres",
          },{
            $match : { rendu: isRendu}
        }
        ]);
    Assignment.aggregatePaginate(aggregateQuery,
    {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    },
    (err,assignments)=> {
        if (err) {
            res.send(err);
          }
          res.send(assignments);
    })
}


// Récupérer un assignment par son id (GET)

function getAssignment(req, res){
    var assignmentId = req.params.id;
    Assignment.aggregate([   
        {
            $lookup : {
                from : 'matieres',
                localField : 'matiere',
                foreignField : 'id',
                as : 'matieres'
            }
        },
        {
            $unwind: "$matieres",
        },    
        {
            $match : { id: +assignmentId}
        },
        {
            $limit : 1
        }          
   ]).then((result) =>{
       res.send(Object.values(result)[0])
    })
}
  
 /*
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}
 */
// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.matiere = req.body.matiere;
    assignment.eleve = req.body.eleve;
    assignment.remarque = req.body.remarque;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved dans le version heroku!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
