/*
	todo:
	- Express server & gulp?

	Struktur / JS
	- Handlebars-Helpers: Besser in einem eigenen JS-File definieren -> nicht irgendwo mitten im Applikationscode definieren.
	- Immer 'use strict'; benutzen.

*/

;(function($, window, document, undefined) {

    "use strict";

    $(function () {
		
	   // Triggers && UI verändernde Klassen

	   $('#design').on('change', function(){
	   		var designname = $(this).find("option:selected").val();
	     $('body').addClass(designname);

	     // inaktive Design Klassen entfernen
	     $(this).find('option').not(':selected').each(function(){
	         $('body').removeClass($(this).val());
	     });
	   });

	   $('#showEntryForm').on('click', function(){
	     toDoView.showEntryForm();
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

	      	toDoView.displayEntries();
	    });

	    $('.mobile-filter-trigger').on('click', function(){
	    	$('.filteroptionen').toggleClass('visible');
	    	$(this).toggleClass('active');
	    });

	    $('.filters button').on('click', function(){
	        $(this).toggleClass('active');
	        toDoView.displayEntries();
	    });

		// Initial Show Entries
		toDoView.displayEntries();

    });

})(jQuery, window, document);