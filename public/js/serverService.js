/* Connection to Server */

var toDoServerService = (function() {

	function publicUpdateOnServer (entry){
		postBody = {"values" : JSON.stringify(entry)};

		$.post( "/entries/"+ entry['_id'] + "/update" , postBody ,function( entry ) {
			
		});

	}

	function publicGetAllEntriesJSON (response){
		return $.ajax({
	      type: "GET",
	      url: "/entries"
	    });
	 }

	 //function publicNewEntryToServer (newEntry){
	 function publicNewEntryToServer (response){
	 	var output = false;
	 	var postBody = {'values' : JSON.stringify(response)};

	 	return $.ajax({
	      type: "POST",
	      url: "/entries",
	      data: postBody
	    });
	 }

	return {
	    updateOnServer : publicUpdateOnServer,
	    getAllEntriesJSON  : publicGetAllEntriesJSON,
	    newEntryToServer : publicNewEntryToServer
	};

})();