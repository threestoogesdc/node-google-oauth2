var express = require('express'),
    http = require("http"),
    oauth = require('oauth'),
    app = express(),
    port = process.env.PORT || 8080,
    host = process.env.IP || 'localhost';
    
var CLIENT_ID = '670315590273',
    CLIENT_SECRET = 'x9B27gYdmnwlBWbf3jwI0QCQ',
    BASE_SITE = 'https://accounts.google.com/o',
    AUTH_PATH = '/oauth2/auth',
    TOKEN_PATH = '/oauth2/token',
    oa;

//configure environment
app.configure(function() {
  app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
});

app.get('/?', function(req, res) {
  res.send(200, 'index');
});

app.get('/home', function(req, res) {
  oa = new oauth.OAuth2();
});

app.get('/auth', function(req, res) {
  var _scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      _response_type = 'code',
      _redirect_uri = 'http://google-oauth2.threestoogesdc.c9.io/oauth2callback';
  
  //clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders
  var oa = new oauth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    BASE_SITE,
    AUTH_PATH,
    TOKEN_PATH
  );
  
  res.redirect(oa.getAuthorizeUrl({
    scope: _scope,
    response_type: _response_type,
    redirect_uri: _redirect_uri
  }));
});

app.get('/oauth2callback', function(req, res) {
  
  res.send(200, 'callback'); 
});

app.listen(port, host);
console.log('Listening on host:port', port, ':', host);

