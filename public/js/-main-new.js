/*
	todo:
	- Express server & gulp?
	- Installationsanleitung

	Struktur / JS
	- js in files aufteilen
	- Handlebars-Helpers: Besser in einem eigenen JS-File definieren -> nicht irgendwo mitten im Applikationscode definieren.
	- Immer 'use strict'; benutzen.

  - alle muss-Punkte erfüllt?

*/

;(function($, window, document, undefined) {

    "use strict";

    $(function () {
		
	   // Triggers
	   $('#design').on('change', function(){
	   		var designname = $(this).find("option:selected").val();
	     $('body').addClass(designname);

	     // inaktive Design Klassen entfernen
	     $(this).find('option').not(':selected').each(function(){
	         $('body').removeClass($(this).val());
	     });
	   });

	   $('#showEntryForm').on('click', function(){
	     toDoDesign.showEntryForm();
	   });

	    // Sorting / Filtering
	    $('.sorting button').on('click', function(){

	    	if ($(this).hasClass('sortorder')) {

	    		$(this).toggleClass('asc');
	    		$(this).toggleClass('desc');

	    		if($(this).hasClass('asc')) {
	    			$(this).html('&darr;');
	    			$(this).data('sortorder', 'ASC');
	    		} else {
	    			$(this).html('&uarr;');
	    			$(this).data('sortorder', 'DESC');
	    		}

	    		
	    	} else {
	    		$('.sorting button').removeClass('active');
	      		$(this).addClass('active');
	    	}

	      	toDoDesign.displayEntries();
	    });

	    $('.mobile-filter-trigger').on('click', function(){
	    	$('.filteroptionen').toggleClass('visible');
	    	$(this).toggleClass('active');
	    });

	    $('.filters button').on('click', function(){
	        $(this).toggleClass('active');
	        toDoDesign.displayEntries();
	    });


		// Initial Show Entries
		toDoDesign.displayEntries();

    });

})(jQuery, window, document);


/* Output/Design related Methods *************/

var toDoDesign = (function() {

	function sortFilterEntries (entries) {

	    // Get Sort Values
	    var sortorder = $('.sorting button.sortorder').data('sortorder');
	    var sortby = $('.sorting button.active').data('sortby');

	    // Get Filter
	    var filter = false;

	    $('.filters button').each(function(){

	      if ($(this).hasClass('active')) {
	        filter = $(this).data('filter');
	      }

	    });

	    // Sorting

	    if (sortorder == "ASC") {
	      // ASC Sorting
	      entries = entries.sort(
	        function (a, b) {
	          if (a[sortby] < b[sortby]) {
	              return -1;
	          }
	          if (a[sortby] > b[sortby]) {
	              return 1
	          }
	      });
	    } else if (sortorder == "DESC") {
	      entries = entries.sort(
	        function (a, b) {
	          if (a[sortby] > b[sortby]) {
	              return -1;
	          }
	          if (a[sortby] < b[sortby]) {
	              return 1
	          }
	      });
	    }

	    // Filtering

	    if (!filter) {

	      // just show

	      entries = $.grep(entries,
	      function(element){
	        return element.done == false;
	      });


	    } else if (filter == "showAll") {
	        // Do Nothing, show all entries ;-)
	    }

	    return entries;
	  }

	 // Triggers for adding after handlebars
    function addListTriggers () {

	    $('button.entryDone, button.entryUndone').on('click', function(){
	      var entryID = $(this).parents('.todo-entry').data('id');

	      toDo.toggleDone(entryID);
	      
	      $('.todo-entry[data-id="'+entryID+'"]').toggleClass('done doneAnimation');

	    });
	    

	    $('button.entryEdit').on('click', function(){

	      var entryID = $(this).parents('.todo-entry').data('id');
	      showEntryForm(entryID);
	    });
	}

	 

	function addFormTriggers () {

	    $( "form#newEntry" ).submit(function( event ) {

	      event.preventDefault();

	      toDo.addEntryForm($( this ).serializeArray());

	      closeForm();
	      displayEntries();

	    });

	    $( "form #closeForm, .lightbox .overlay" ).on('click', function( ) {
	      closeForm();
	    });

	    $('body').keydown(function(key){
		    if (key.which == 27) {
		        closeForm();
		    }
		});

	    $('form input[type="text"]').first().focus();

	}

	// Close Form (Lightbox)
	 function closeForm () {
	 	$('.lightbox').removeClass('loaded');
	    
	    setTimeout(function() {
	    	$('.lightbox').remove();
	    }, 400);
	    
	}

	 
     
	/* UNUSED...
	  function formSubmit(newEntryFromForm) {

	  	  var newEntryFormatted = {};

	      $( newEntryFromForm ).each(function(index, obj) {
	          newEntryFormatted[obj.name] = obj.value;
	      });

	      if (newEntryFormatted.id) {
	        // update entry
	        entry.updateEntry(newEntryFormatted);
	    
	      } else {
	        // new Entry
	        newEntryFormatted.done = false;
	        newEntryFormatted.id = idGenerator();
	        this.entries.push(newEntryFormatted);
	      }

	  }
	  */


	// Publics
	function displayEntries (){

		var entries = sortFilterEntries(toDo.entries());

	    var source   = $("#todoEntry").html();

	    var template = Handlebars.compile(source);
	    var wrapper  = {entries: entries};

	    $('#todo-entries').html(template(wrapper));
	    addListTriggers();

	    if (entries.length > 1){
	    	$('.filteroptionen .sorting button').attr("disabled", false);
	    } else {
	    	$('.filteroptionen .sorting button').attr("disabled", true);
	    }

    }

    // Show the Entry Form as Lightbox
	 function showEntryForm (id) {
	    
	    var entrydates = [];

	    if (id) {
	      var entrydates = toDo.singleEntry(id);
	    }

	    entrydates.today = toDo.getToday();
	  
	    var source   = $("#newNoteForm").html();
	    var template = Handlebars.compile(source);
	    var wrapper  = {entry: entrydates};

	    //Show Lightbox
	    $('body').append('<div class="lightbox"><div class="overlay"></div><div class="content"></div></div>');

	    // Add Form To Lightbox
	    $('.lightbox .content').append(template(wrapper));
	    addFormTriggers();

	    // Show with CSS Animation
	    $('.lightbox').addClass('loaded');

	}



	return {
	    displayEntries : displayEntries,
	    showEntryForm : showEntryForm
	};

})();


/* Functional / Entry-Database related Methods *************/

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

		/*
		$.each( changedValues, function( key, value ) {
			entryObject[key] = value;
			console.log(entryObject[key]);
		});
		*/

		// Update in Object
	    for (var atr in changedValues) {
	    	this[atr] = changedValues[atr];
	    }

	    

	    postBody = {"values" : JSON.stringify(this)};

		// Push new Objects to Server
		this.updateThisOnServer();

	}

	

	Entry.prototype.updateThisOnServer = function  (){
		
		postBody = {"values" : JSON.stringify(this)};

		$.post( "/entries/"+ this['_id'] + "/update" , postBody ,function( NewEntry ) {
			
		});

	}


	// Global Namespace Methods
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

		// Get Entries from Express Server

		var entries = [];

		$.get( "/entries", function( data ) {

		  var entries = JSON.parse(data);

		  // make a "Entry" Object from each entry
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


	function newEntryToServer (NewEntry){

		var postBody = {'values' : JSON.stringify(NewEntry)};
		var serverFeedback = null;

		$.ajax({
		  async: false,
	      type: "POST",
	      url: "/entries",
	      data: postBody,
	      success : function(response) {
	         serverFeedback = response;
	      }
	    });

	    return serverFeedback;

	};


	function getEntryByID (entryID) {

	    var entry = $.grep(entries,
	      function(element){
	        return element._id == entryID;
	      });

	    var output = entry[0];

	    return output;

	}

	function addEntry (values){

		// Make Entry Object
		var newEntry = new Entry(values);

		// Send Entry to Server
		var serverFeedback = newEntryToServer(newEntry);

		// Align Generated ID to Object
		newEntry['_id'] = serverFeedback['_id'];

		// Push Entry Object Array
		this.entries.push(newEntry);

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

       getToday : getToday //bessere lösung???
    };

})();