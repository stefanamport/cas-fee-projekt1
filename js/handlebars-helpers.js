
Handlebars.registerHelper('for', function(fortimes, tpl) {
    var output = '';
    for(var i = 0; i < fortimes; ++i)
        output += tpl.fn(i);
    return output;
});

Handlebars.registerHelper("formatDate", function(date, format) {

    if (moment && date.length > 1) {
      
      var strippedDate = date.replace("/-/g", "");

      return moment(strippedDate).format(format);
    }
    else {
      return date;
    }

});