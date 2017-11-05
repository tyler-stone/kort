//load in functions
var study = require('./study_server');
var cardsort = require('./cardsort_server');
var treetest = require('./treetest_server');
var productreactioncards = require('./productreactioncards_server');
var user = require('./user_server');
var response = require('./response_server');
var upload = require('./upload_server');
var mongoose = require('mongoose');

const multer = require('multer');
const multerConf = {
	storage: multer.diskStorage({
		destination: function(req, file, next){
			next(null,'./uploads/images');
		},
		filename: function(req, file, next){
			const ext = file.mimetype.split('/')[1];
			next(null,file.fieldname + '-' + Date.now() + '.' + ext);
		}
	}),
	fileFilter: function(req, file, next){
		if(!file){
			next()
		}
		const image = file.mimetype.startsWith('image');
		if(image){
			next(null,true);
		} else {
			next({message: "File not supported"},false);
		}
	}
};

module.exports = function(app, passport, flash) {

	app.get('/', function (req, res) {
		res.render('index.ejs', { loginMessage: req.flash('loginMessage') });
	});

	//upload routes
	app.post('/upload', multer(multerConf).single('photo'), upload.create);
	app.get('/delupload/:id', upload.delete);
	//todo
	// app.post('/api/uploaddelete', multer(multerConf).single('photo'), upload.create);
	app.post('/upload/getPath', upload.getPathById);
	
	//sample page for upload testing
	app.get('/uploadtest', function (req, res) {
		res.render('upload.ejs',{imgpath: ""});
	});

	//card sort routes
	app.get('/createcardsort', isLoggedIn, cardsort.create);
	app.get('/editcardsort/:id', isLoggedIn, cardsort.edit);
	app.get('/cardsort/:id', study.view);
	app.get('/cardsort/preview/:id', isLoggedIn, study.preview);
	app.get('/cardsort/:id/:resid', study.view);
	app.get('/cardsortresults/:id', isLoggedIn, cardsort.results);
	app.post('/updatecardsort', isLoggedIn, cardsort.update);

	//tree test routes
	app.get('/createtreetest', isLoggedIn, treetest.create);
	app.get('/edittreetest/:id', isLoggedIn, treetest.edit);
	app.get('/treetest/:id', study.view);
	app.get('/treetest/preview/:id', isLoggedIn, study.preview);
	app.get('/treetest/:id/:resid', study.view);
	app.get('/treetestresults/:id', isLoggedIn, treetest.results);
	app.post('/updatetreetest', isLoggedIn, treetest.update);

	//product reaction cards routes
	app.get('/createproductreactioncards', isLoggedIn, productreactioncards.create);
	app.get('/editproductreactioncards/:id', isLoggedIn, productreactioncards.edit);
	app.get('/productreactioncards/:id', study.view);
	app.get('/productreactioncards/preview/:id', isLoggedIn, study.preview);
	app.get('/productreactioncards/:id/:resid', study.view);
	app.get('/productreactioncardsresults/:id', isLoggedIn, productreactioncards.results);
	app.post('/updateproductreactioncards', isLoggedIn, productreactioncards.update);

	//study routes
	app.get('/studies', isLoggedIn, study.home);
	app.get('/study/:id', study.view);
	app.get('/study/copy/:id', study.copy);
	app.get('/study/:id/:resid', study.view);
	app.get('/study/preview/:id', isLoggedIn, study.preview);
	app.post('/submitResult', isLoggedIn, study.submitResult);
	app.get('/deletestudy/:id', isLoggedIn, study.delete);
	app.get('/clearstudy/:id', isLoggedIn, study.clearResponses);

	app.get('/msg/:cm', function (req, res) {
		switch(req.params.cm) {
		    case "thanks":
		        res.render('msg.ejs', {titleline: "Thank you.", msg: "Your response has been recorded."});
		        break;
		    case "study404":
		        res.render('msg.ejs', {titleline: "Can't find the study. Sorry :(", msg: "Your study couldn't be found."});
		        break;
			case "notactive":
		        res.render('msg.ejs', {titleline: "Sorry. The study isn't accepting responses.", msg: "The study may be over or has yet to start. Contact your study coordinator or try again later."});
		        break;
		    default:
		        res.redirect('/');
		}
	});

	//response routes
	app.post('/createresponse_ajax/:studyID', isLoggedIn, response.create_ajax);
	app.post('/deleteresponse/:studyID/:resid', isLoggedIn, response.delete);

	//???
	app.get('/overview', isLoggedIn, function (req, res) {
		res.render('overview.ejs', {email: req.user.email});
	});

	//user routes
	app.get('/users', isLoggedIn, user.UserManagement);
	app.post('/createuser', isLoggedIn, passport.authenticate('local-signup', {
		successRedirect : '/users',
		failureRedirect : '/users',
		failureFlash : true
	}));
	app.get('/deleteuser/:id', isLoggedIn, user.deleteUser);
	app.post('/resetpassword', isLoggedIn, user.resetPassword);
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/overview',
		failureRedirect: '/',
		failureFlash : true
	}));
	app.get('/logout', function(req, res) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
