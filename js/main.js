/*

  todo
  - addEntry function not working
    add id

  - responsive

*/

// evtl. benötigt??
Array.prototype.findByID = function(id) {
    for(var i = 0; i< this.length; ++i) {
        if( this[i].id == id)
        {
            return this[i];
        }
    }
};

function idGenerator() {
    return Math.floor(Math.random() * 10) + Date.now();
};

$(function(){

  // Inital Load Entries, set to local Storage and load into DOM
  getEntriesFromServer();
  displayEntries();

 // General Triggers
   $('#design').on('change', function(){
   		var designname = $(this).find("option:selected").val();
      $('body').addClass(designname);

      // inaktive Design Klassen entfernen
      $(this).find('option').not(':selected').each(function(){
        $('body').removeClass($(this).val());
      });
   });

    $('#showEntryForm').on('click', function(){
      showEntryForm();
    });

    // Sorting / Filtering
    $('.sorting button').on('click', function(){
      $('.sorting button').removeClass('active');
      $(this).addClass('active');

      displayEntries();
    });

    $('.filters button').on('click', function(){
        $(this).toggleClass('active');
        displayEntries();
    });

});


// Functions

  // Add Triggers
  function addFormTriggers (){
    $('#closeForm').on('click', function(){
      closeForm();
    });

    $( "form#newEntry" ).submit(function( event ) {

      addEntry($( this ).serializeArray());

      event.preventDefault();

      closeForm();
      displayEntries();

    });

  }

  function addListTriggers (){
    $('button.entryDone').on('click', function(){
      //todo - editEntry();
    });

    $('button.entryEdit').on('click', function(){

      var entryID = $(this).parents('.todo-entry').data('id');
      showEntryForm(entryID);
    });
  }

  // Show the Entry Form as Lightbox
  function showEntryForm(id) {

    var entrydates = [];

    if (id>0) {
      var entrydates = getSingleEntry(id);
    }

    var source   = $("#newNoteForm").html();
    var template = Handlebars.compile(source);
    var wrapper  = {entry: entrydates};

    //Show Lightbox
    $('body').append('<div class="lightbox"><div class="content"></div></div>');

    // Add Form To Lightbox
    $('.lightbox .content').append(template(wrapper));

    addFormTriggers();

  }

  // Close Form (Lightbox)
  function closeForm() {
    $('.lightbox').remove();
  }


  function getEntries (){

    // Get Entries from local storage
    entries = JSON.parse(sessionStorage.getItem('todoListEntries'));

    return entries;

  }

  function addEntry (newEntry){

      /*
    var newEntryFormatted = [];

    for (var i = 0; i < newEntry.length; ++i) {
      newEntryFormatted[newEntry[i].name] = newEntry[i].value;
    }

    console.log(newEntryFormatted);

    var entries = getEntries();

    entries.push(newEntryFormatted);

    setEntries(entries);
    */

      var entries = getEntries();

      newEntryFormatted = {};
      $( newEntry ).each(function(index, obj) {
          newEntryFormatted[obj.name] = obj.value;
          console.log(newEntryFormatted);
      });

      entries.push(newEntryFormatted);

      newEntryFormatted.done = false;
      newEntryFormatted.id = idGenerator();

      console.log(JSON.stringify(entries));

      setEntries(entries);

  }

  function setEntries (entries){

    // Load into session
    sessionStorage.setItem('todoListEntries', JSON.stringify(entries));

    // and load copy to server
    saveEntriesToServer(entries);

  }

  // Get The Entries form Server
  // & load to local storage
  function getEntriesFromServer () {

    // Testing purposes - no server yet
    // set array to session, if empty

    if (!sessionStorage.getItem('todoListEntries')) {

      var entries = [
        {id: 2, done: false, todoDate: "1918-12-31", todoTitle: "Test 2", todoText: "lorem ipsum", priority: 1 },
        {id: 1, done: true, todoDate: "2015-12-31", todoTitle: "Test 1", todoText: "222 lorem ipsum", priority: 2 },
        {id: 3, done: false, todoDate: "1999-12-31", todoTitle: "Test 3", todoText: "222 lorem ipsum", priority: 3 },
      ];

      // Set To Session Storage
      sessionStorage.setItem('todoListEntries', JSON.stringify(entries));

    }

  }

  // save The Entries to server
  function saveEntriesToServer (){
      // Not yet learned :-D - do nothing
      console.log('es würde dann was auf den server laden :-)');
  }

  // Load Entries from local Storage
  function loadEntries() {

    var entries = getEntries();

    // Get Sort Values
    var sortorder = $('.sorting button.active').data('sortorder');
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

  function getSingleEntry(id){
    var entries = loadEntries();

    var entry = $.grep(entries,
      function(element){
        return element.id == id;
      });

    return entry[0];
  }

  function displayEntries (){

    var entries = loadEntries();

    var source   = $("#todoEntry").html();
    var template = Handlebars.compile(source);
    var wrapper  = {entries: entries};

    $('#todo-entries').html(template(wrapper));
    addListTriggers();

  }


// Handlebar helper
Handlebars.registerHelper('for', function(fortimes, tpl) {
    var output = '';
    for(var i = 0; i < fortimes; ++i)
        output += tpl.fn(i);
    return output;
});