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
    
    REDIRECT_URI = 'http://google-oauth2.threestoogesdc.c9.io/oauth2callback',
    SCOPES = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');
    
var _oa;

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
  res.send(200, 'home');
});

app.get('/auth', function(req, res) {
  var _response_type = 'code';
  
  //clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders
  _oa = new oauth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    BASE_SITE,
    AUTH_PATH,
    TOKEN_PATH
  );
  
  res.redirect(_oa.getAuthorizeUrl({
    scope: SCOPES,
    response_type: _response_type,
    redirect_uri: REDIRECT_URI
  }));
});

app.get('/oauth2callback', function(req, res) {
  var _code = req.param('code', false);
  
  _oa.getOAuthAccessToken(_code, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  }, function(err, access_token, refresh_token) {
    if(err) {
      res.end('error: ' + JSON.stringify(err));
    }
    else {
      res.write('access token: ' + access_token + '\n');
      res.write('refresh token: ' + refresh_token);
      res.end();
    }
  });
});

app.listen(port, host);
console.log('Listening on host:port', port, ':', host);

