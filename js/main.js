/*

  todo
  - addEntry
    add id

- add triggers funktionieren nicht mehr, this konflikt?

  this.showEntryForm(entryID);

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

 // General Triggers - integrate in class?
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

});



// Handlebar helper
Handlebars.registerHelper('for', function(fortimes, tpl) {
    var output = '';
    for(var i = 0; i < fortimes; ++i)
        output += tpl.fn(i);
    return output;
});



// OOP Versuch

var todoClass = (function() {
  
  'use strict';

  function todoClass(arg1, arg2) {
    // enforces new
    if (!(this instanceof todoClass)) {
      return new todoClass();
    }
    // constructor body
  }
  
  todoClass.prototype.init = function() {
    console.log('run');
    this.getEntriesFromServer();
    this.displayEntries();

  }

  todoClass.prototype.displayEntries = function (){

    var entries = this.loadEntries();

    var source   = $("#todoEntry").html();

    var template = Handlebars.compile(source);
    var wrapper  = {entries: entries};

    $('#todo-entries').html(template(wrapper));
    this.addListTriggers();

  }


  todoClass.prototype.getEntriesFromServer = function (){

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

  todoClass.prototype.loadEntries = function () {

    var entries = this.getEntries();


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


  todoClass.prototype.getEntries = function () {

    // Get Entries from local storage
    var entries = JSON.parse(sessionStorage.getItem('todoListEntries'));

    return entries;

  }

  todoClass.prototype.addEntry = function (newEntry) {

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

      var entries = this.getEntries();

      var newEntryFormatted = {};
      $( newEntry ).each(function(index, obj) {
          newEntryFormatted[obj.name] = obj.value;
          console.log(newEntryFormatted);
      });

      entries.push(newEntryFormatted);

      newEntryFormatted.done = false;
      newEntryFormatted.id = idGenerator();

      console.log(JSON.stringify(entries));

      this.setEntries(entries);

  }


  todoClass.prototype.setEntries = function (entries) {

    // Load into session
    sessionStorage.setItem('todoListEntries', JSON.stringify(entries));

    // and load copy to server
    this.saveEntriesToServer(entries);

  }

  // save The Entries to server
  todoClass.prototype.saveEntriesToServer = function () {
      // Not yet learned :-D - do nothing
      console.log('es würde dann was auf den server laden :-)');
  }


  todoClass.prototype.getSingleEntry = function (id) {
    var entries = this.loadEntries();

    var entry = $.grep(entries,
      function(element){
        return element.id == id;
      });

    return entry[0];
  }


   // Add Triggers
  todoClass.prototype.addFormTriggers = function () {

    // To Ask - Ist das sauber?
    // this wird von jquery überschrieben, mit self kann this (die Klasse) immer noch angesprochen werden
    var self = this;

    $( "form#newEntry" ).submit(function( event ) {

      event.preventDefault();

      console.log($( this ).serializeArray());

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
      //todo - editEntry();
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

// Kick off
todo = new todoClass();
todo.init();
