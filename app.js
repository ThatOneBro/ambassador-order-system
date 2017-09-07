var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var autoIncrement = require('mongoose-auto-increment');

var port = process.env.PORT || 8080;
var dbConfig = require('./config/database.js');
var connection = mongoose.createConnection(dbConfig.url, { useMongoClient: true });

autoIncrement.initialize(connection);

var menuItemSchema = require('./app/models/menu-item.js');
menuItemSchema.plugin(autoIncrement.plugin, {model: 'MenuItem'});
var MenuItem = connection.model('MenuItem', menuItemSchema);

app.use(bodyParser.urlencoded({'extended': true}));

app.set('view engine', 'pug');
app.set('views', __dirname + '/public');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(__dirname + '/public/styles'));


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/additem', function(req, res) {
	res.render('itemform.pug');
});

app.post('/createitem', function(req, res) {
	if(!req.body.name || !req.body.price || !req.body.category) {
		res.redirect('/failure');
		return;
	}
	
	var newItem = new MenuItem({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		popular: req.body.popular ? true : false,
		spicy: req.body.spicy ? true : false,
		veg: req.body.veg ? true : false,
		pickup: req.body.pickup ? true : false
	});
	
	newItem.save(function(err){
		if(err){
			console.log(err);
			res.redirect('/failure');
		}
		res.redirect('/success');
	});
});

app.get('/success', function(req, res) {
	res.render('success.pug');
});

app.get('/failure', function(req, res) {
	res.render('failure.pug');
});

/* app.get('/about', function(req, res) {
	res.sendFile(__dirname + '/public/about.html');
}); */


var menu = [];
var categories = {
	'appetizers': 'Appetizers',
	'soups': 'Soups',
	'beef': 'Beef',
	'poultry': 'Chicken and Duck'
};

Object.keys(categories).forEach(function(key) {
	MenuItem.find({'category': key}).lean().exec(function(err, items) {
		if(err){
			console.log(err);
			return;
		}
		if(!items[0]){
			console.log("No menu items found");
			return;
		}
		menu.push({
			name: categories[key],
			items: items
		});
	});
});

app.get('/menu', function(req, res) {
	res.render('menu.pug', {menu: menu});
});

/* app.get('/contact', function(req, res) {
	res.sendFile(__dirname + '/public/contact.html');
});
 */
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/404.html');
});

//implement https later
app.listen(port, function(){
	console.log('Server listening on port %d!', port);
});
