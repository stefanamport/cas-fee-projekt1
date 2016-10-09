/*

  todo
  - evtl. priorität-auswahl verbessern
  - today date vorauswählen

  - code allgemein verbessern
  - timeline meldungen

  - alle muss-Punkte erfüllt?

  - responsive
  - schöneres styling

*/


function idGenerator() {
    return Math.floor(Math.random() * 10) + Date.now();
};

function getToday (){

  var today = new Date();

  var today = new Date();
  var tag = today.getDate();
  var monat = today.getMonth()+1;
  var jahr = today.getFullYear();

  var todayFormatted = jahr + "-" + monat + "-" + tag;

  return todayFormatted;

}

// Handlebar extension "for"
Handlebars.registerHelper('for', function(fortimes, tpl) {
    var output = '';
    for(var i = 0; i < fortimes; ++i)
        output += tpl.fn(i);
    return output;
});

Handlebars.registerHelper("formatDate", function(date, format) {

    if (moment && date.length > 1) {
      // can use other formats like 'lll' too
      
      var strippedDate = date.replace("/-/g", "");

      return moment(strippedDate).format(format);
    }
    else {
      return date;
    }

});


$(function(){

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
      todo.showEntryForm();
    });

    // Sorting / Filtering
    $('.sorting button').on('click', function(){
      $('.sorting button').removeClass('active');
      $(this).addClass('active');

      todo.displayEntries();
    });

    $('.filters button').on('click', function(){
        $(this).toggleClass('active');
        todo.displayEntries();
    });

    // Kick off
    todo = new todoClass();
    todo.displayEntries();
});





// The Todo Class

var todoClass = (function() {
  
  'use strict';

  function todoClass(arg1, arg2) {
    // enforces new
    if (!(this instanceof todoClass)) {
      return new todoClass();
    }

    this.entries = getEntriesFromServer();

  }
  

  function getEntriesFromServer(){

    // Testing purposes - no server yet
    // set array to session, if empty

    /*
    var entries = [
        {id: 2, done: false, todoDate: "1918-12-31", todoTitle: "Test 2", todoText: "lorem ipsum", priority: 1 },
        {id: 1, done: true, todoDate: "2015-12-31", todoTitle: "Test 1", todoText: "222 lorem ipsum", priority: 2 },
        {id: 3, done: false, todoDate: "1999-12-31", todoTitle: "Test 3", todoText: "222 lorem ipsum", priority: 3 },
      ];
    */

    if (localStorage.getItem('todoListEntries')) {
      var entries = JSON.parse(localStorage.getItem('todoListEntries'));
    } else {
      var entries = new Array();
    }

    return entries;

    //if (!sessionStorage.getItem('todoListEntries')) {

      // Set To Session Storage
      //sessionStorage.setItem('todoListEntries', JSON.stringify(entries));

    //}

  }

  todoClass.prototype.displayEntries = function (){

    //var entries = this.loadEntries();

    if (!this.entries) {
      return;
    }

    var source   = $("#todoEntry").html();

    var template = Handlebars.compile(source);
    var wrapper  = {entries: this.sortFilterEntries(this.entries)};

    $('#todo-entries').html(template(wrapper));
    this.addListTriggers();

  }


  todoClass.prototype.sortFilterEntries = function (entries) {

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


  // Close Form (Lightbox)
  todoClass.prototype.closeForm = function () {
    $('.lightbox').remove();
  }

  /*
  todoClass.prototype.getEntries = function () {

    // Get Entries from local storage
    var entries = JSON.parse(sessionStorage.getItem('todoListEntries'));

    return entries;

  }
  */

  todoClass.prototype.addEntry = function (newEntry) {

      var newEntryFormatted = {};
      $( newEntry ).each(function(index, obj) {
          newEntryFormatted[obj.name] = obj.value;
      });

      console.log();

      if (newEntryFormatted.id) {
        // update entry

        var eID  = this.getSingleEntry(newEntryFormatted.id, true);

        //console.log(newEntryFormatted.length);

        for (var key in newEntryFormatted) {
          //console.log(key + " -> " + newEntryFormatted[key]);
          console.log(this.entries[eID][key]);
          this.entries[eID][key] = newEntryFormatted[key];
        }

        
      } else {
        // new Entry
        newEntryFormatted.done = false;
        newEntryFormatted.id = idGenerator();
        this.entries.push(newEntryFormatted);
      }

      
      
      this.saveEntriesToServer();

  }


  // save The Entries to server
  todoClass.prototype.saveEntriesToServer = function () {

      localStorage.setItem('todoListEntries', JSON.stringify(this.entries));

      console.log('es würde dann was auf den server laden :-)');
  }

  todoClass.prototype.doneEntry = function (id) {

    var entryID = this.getSingleEntry(id, true);

    // nicht ganz entfernen :-)
    //this.entries.splice(entryID, 1);

    this.entries[entryID].done = true;
    this.entries[entryID].doneDate = getToday();
    this.saveEntriesToServer();

    // for DOM Animation
    $('.todo-entry[data-id="'+id+'"]').addClass('done doneAnimation');

  }


  todoClass.prototype.getSingleEntry = function (id, returnIndex = false) {

    var output = false;

    if (returnIndex) {
      // Return the Index in this.entries array

        for(var i = 0; i< this.entries.length; ++i) {
            if( this.entries[i].id == id)
            {
                output = i;
            }
        }

    } else {
      // returns the entry itself as a new array

      var entry = $.grep(this.entries,
      function(element){
        return element.id == id;
      });

      output = entry[0];

    }

    return output;
  }


   // Add Triggers
  todoClass.prototype.addFormTriggers = function () {

    // To Ask - Ist das sauber?
    // this wird von jquery überschrieben, mit self kann this (die Klasse) immer noch angesprochen werden
    var self = this;

    $( "form#newEntry" ).submit(function( event ) {

      event.preventDefault();

      self.addEntry($( this ).serializeArray());

      self.closeForm();
      self.displayEntries();

    });

    $( "form #closeForm" ).on('click', function( ) {
      self.closeForm();
    });

  }

  todoClass.prototype.addListTriggers = function () {

    // To Ask - Ist das sauber?
    var self = this;

    $('button.entryDone').on('click', function(){
       var entryID = $(this).parents('.todo-entry').data('id');
      self.doneEntry(entryID);
    });

    $('button.entryEdit').on('click', function(){

      var entryID = $(this).parents('.todo-entry').data('id');
      self.showEntryForm(entryID);
    });
  }

  // Show the Entry Form as Lightbox
  todoClass.prototype.showEntryForm = function (id) {
    var entrydates = [];

    if (id>0) {
      var entrydates = this.getSingleEntry(id);
    }

    var source   = $("#newNoteForm").html();
    var template = Handlebars.compile(source);
    var wrapper  = {entry: entrydates};

    //Show Lightbox
    $('body').append('<div class="lightbox"><div class="content"></div></div>');

    // Add Form To Lightbox
    $('.lightbox .content').append(template(wrapper));

    this.addFormTriggers();

  }


  return todoClass;

})(jQuery, window, document);
