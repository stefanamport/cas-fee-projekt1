/* Output/Design/Filtering related Methods */

var toDoView = (function() {

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

	      // just show all Entries

	      entries = $.grep(entries,
	      function(element){
	        return element.done == false;
	      });

	    }

	    return entries;
	  }

	 // Triggers for Handlebar Template "entry list"
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

	 
	// Triggers for Handlebar Template "Form"
	function addFormTriggers () {

	    $( "form#newEntry" ).submit(function( event ) {

	      event.preventDefault();

	      var response = toDo.addEntryForm($( this ).serializeArray());
	      closeForm();

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