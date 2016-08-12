var exp = require('express'),
    mstE = require('mustache-express'),
    app = exp()

var request = require('request');



app.engine('html',mstE());
app.set('view engine','html');
app.set('views',__dirname + '/views');
app.use('/', exp.static(__dirname + '/public'));
app.listen(3000, function(){
  console.log('alive on 3k, yo.');
});

app.get('/',function(req,res){

    var url = 'https://www.googleapis.com/books/v1/volumes?q=hitchikers+guide+to+the+galaxy'

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
    var ourData = {data:body}
    res.render('index',ourData)

  }
})


})
