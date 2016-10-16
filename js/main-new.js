/*
	todo
	- abgelaufene einträge auffälliger markieren

	 - responsive
  	- schöneres styling

  - code allgemein verbessern
  - timeline meldungen

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

	    		console.log($(this).data('sortorder'));
	    		

	    	} else {
	    		$('.sorting button').removeClass('active');
	      		$(this).addClass('active');
	    	}

	      	toDoDesign.displayEntries();
	    });

	    $('.filters button').on('click', function(){
	        $(this).toggleClass('active');
	        toDoDesign.displayEntries();
	    });


		// Initial Show Entries
		toDoDesign.displayEntries();


    });

})(jQuery, window, document);



/**************/

var toDoDesign = (function() {

	function test (){
		console.log(toDo.entries())
	}

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

	    // To Ask - Ist das sauber?
	    var self = this;

	    $('button.entryDone').on('click', function(){
	       var entryID = $(this).parents('.todo-entry').data('id');

	      toDo.setToDone(entryID);
	      
	      $('.todo-entry[data-id="'+entryID+'"]').addClass('done doneAnimation');


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

	    $('form input[type="text"]').first().focus();

	}

	// Close Form (Lightbox)
	 function closeForm () {
	 	$('.lightbox').removeClass('loaded');
	    
	    setTimeout(function() {
	    	$('.lightbox').remove();
	    }, 400);
	    
	}

	 


     

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


	// Publics
	function displayEntries (){

	    var source   = $("#todoEntry").html();

	    var template = Handlebars.compile(source);
	    var wrapper  = {entries: sortFilterEntries(toDo.entries())};

	    $('#todo-entries').html(template(wrapper));
	    addListTriggers();

	    //toDo.entries();
    }

    // Show the Entry Form as Lightbox
	 function showEntryForm (id) {
	    
	    var entrydates = [];

	    if (id>0) {
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

/**************/


var toDo  = (function() {

	var entries = getEntriesFromServer();

	// Entry Prototype
	function Entry(settings){
	
		this.todoTitle = "";
		this.text = "";
		this.prioritaet = 3;
		this.todoDate = "";

		this.done = false;

		this.abgelaufen = function (){
			return getToday().replace('-', '') > this.todoDate.replace('-', '')
		};


		// Variabeln überladen, falls settings mitgegeben
		for (var property in settings) { 
			this[property] = settings[property];
		}

		if (!this.id) {
			this.id = idGenerator();
		}

	}

	Entry.prototype.setToDone = function () {

	    //var entryID = this.getSingleEntry(id, true);

	    // nicht ganz entfernen :-)
	    //this.entries.splice(entryID, 1);

	    this.done = true;
	    this.doneDate = getToday();
	    saveEntriesToServer();

	    // for DOM Animation
	    return true;

	}

	Entry.prototype.updateEntry = function (changedValues){

		var entryObject = this;

		$.each( changedValues, function( key, value ) {
			console.log(entryObject[key]);
			entryObject[key] = value;

		});

		saveEntriesToServer();

	}


	// Intern Methods / Functions

	function idGenerator() {
	    return Math.floor(Math.random() * 10) + Date.now();
	};

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
		if (localStorage.getItem('todoListEntries')) {
	      var entries = JSON.parse(localStorage.getItem('todoListEntries'));
	    } else {
	      var entries = new Array();
	    }

	    // make a "Entry" Object from each entry
	    var objEntries = [];

	    $.each( entries, function( key, value ) {

	    	var NewEntry = new Entry(value);

	    	objEntries.push(NewEntry);

		});

	    return objEntries;
	}

	function saveEntriesToServer () {

      localStorage.setItem('todoListEntries', JSON.stringify(entries));

      console.log('es würde dann was auf den server laden :-)');
	}

	

	function getEntryByID (entryID) {

	    var entry = $.grep(entries,
	      function(element){
	        return element.id == entryID;
	      });

	    var output = entry[0];

	    return output;

	}

	

	function addEntry (values){

		NewEntry = new Entry(values);

		entries.push(NewEntry);
		saveEntriesToServer();

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


	      if (newEntryFormatted.id) {
	        
	        entry = toDo.singleEntry(newEntryFormatted.id);

	        entry.updateEntry(newEntryFormatted);
	        
	      } else {
	        // new Entry
	        addEntry(newEntryFormatted);
	      }

	      

	}

	function publicSetToDone(entryID) {

		entry = getEntryByID(entryID);

		entry.setToDone();

	}


	return {
       entries : publicOutputEntries,
       singleEntry : getEntryByID,
       setToDone : publicSetToDone,

       addEntryForm : publicAddChangeEntryFromForm,

       getToday : getToday //bessere lösung???
    };

})();