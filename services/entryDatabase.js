var entries = [];

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'db/entries', autoload: true });

//var store = require("../services/orderStore.js");

module.exports.showEntryAll = function(req, res) {

    db.find({}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });

    
}

module.exports.showEntry = function(req, res) {

    //var entry = db.get( req.params["_id"] );
    //console.log(req);
    //console.log(req.params["_id"]);

    db.find({ "_id": id }, function (err, docs) {
        
    });

};

module.exports.addEntry = function(req,res){

    var entry = JSON.parse(req.body.values);

    var newDoc = [];
    
    db.insert(entry, function (err, newDoc) {
        res.send(newDoc);
    });

}

module.exports.deleteEntry = function(req,res){

}

module.exports.updateEntry = function(req,res){

    var entry = JSON.parse(req.body.values);
    
    db.update({ "_id": req.params.id }, entry, {}, function (err, numReplaced) {

    });


}


