/* Functional / Database-Connection related Methods */

var toDo  = (function() {

	//loadEntries
	entries = [];
	getEntriesFromServer();

	// Entry Prototype
	function Entry(settings){
	
		this.todoTitle = "";
		this.text = "";
		this.prioritaet = 3;
		this.todoDate = "";
		this.createDate = getToday();

		this.done = false;

		this.abgelaufen = function (){
			return getToday().replace('-', '') > this.todoDate.replace('-', '')
		};

		// Variabeln überladen, falls settings mitgegeben
		for (var property in settings) { 
			this[property] = settings[property];
		}

	}

	//Entry Methods

	Entry.prototype.toggleDone = function () {

		var doneValues = {};

	    if (this.done){
	    	doneValues = {
	    		"done" : false,
	    		"doneDate" : ""
	    	};
	    } else {
	    	doneValues = {
	    		"done" : true,
	    		"doneDate" : getToday()
	    	};
	    }
	    
	    this.updateEntry(doneValues);
	}

	Entry.prototype.updateEntry = function (changedValues){

		var entryObject = this;

		// Update in Object
	    for (var atr in changedValues) {
	    	this[atr] = changedValues[atr];
	    }

	    postBody = {"values" : JSON.stringify(this)};

		// Push new Objects to Server
		this.updateThisOnServer();

	}

	Entry.prototype.updateThisOnServer = function  (){

		toDoServerService.updateOnServer(this);

	}

	function getToday (){

	  var today = new Date();

	  var today = new Date();
	  var tag = ('0' + today.getDate()).slice(-2);
	  var monat = ('0' + (today.getMonth()+1)).slice(-2);
	  var jahr = today.getFullYear();

	  var todayFormatted = jahr + "-" + monat + "-" + tag;

	  return todayFormatted;
	}


	function getEntriesFromServer (){

		// Get Entries from Server

		toDoServerService.getAllEntriesJSON().done(function(result){
	    	
			var entries = JSON.parse(result);

	    	var objEntries = [];

		    $.each( entries, function( key, value ) {

		    	var NewEntry = new Entry(value);

		    	objEntries.push(NewEntry);

			});

			setEntriesToLocal(objEntries);

	    });
	    
	}

	function setEntriesToLocal(objEntries){
		this.entries = objEntries;
	}


	function getEntryByID (entryID) {

	    var entry = $.grep(entries,
	      function(element){
	        return element._id == entryID;
	      });

	    var output = entry[0];

	    return output;

	}

	function addEntry (values){

		var newEntry = new Entry(values);
		this.entries.push(newEntry);


		function setEntryLocal (result){
			newEntry['_id'] = result['_id'];

			// Evtl. etwas unsaubere lösung? :-)
			toDoView.displayEntries();
		};

		toDoServerService.newEntryToServer(newEntry).done(function(result){
			setEntryLocal(result);
		});

	}


	// Public Methods
	function publicOutputEntries (){
		return entries;
	}

	
	function publicAddChangeEntryFromForm (serializedForm){

	      var newEntryFormatted = {};
	      $( serializedForm ).each(function(index, obj) {
	          newEntryFormatted[obj.name] = obj.value;
	      });


	      if (newEntryFormatted._id) {
	        
	        entry = toDo.singleEntry(newEntryFormatted._id);
	        entry.updateEntry(newEntryFormatted);

	        // Evtl. etwas unsaubere lösung? :-)
			toDoView.displayEntries();
	        
	      } else {
	        // new Entry
	        addEntry(newEntryFormatted);
	      }

	}

	function publicToggleDone(entryID) {

			entry = getEntryByID(entryID);

			entry.toggleDone();
	}


	return {
       entries : publicOutputEntries,
       singleEntry : getEntryByID,
       toggleDone : publicToggleDone,

       addEntryForm : publicAddChangeEntryFromForm,

       getToday : getToday
    };

})();