const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const {clientID, clientSecret} = require('.env');

const oAuth2Client = new OAuth2Client(
  clientID, // Sustituye con tu client ID
  clientSecret, // Sustituye con tu client secret
  'http://localhost:3000/oauth2callback' // URL de redirección
);

const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];

// Obtiene la URL para que el usuario inicie sesión y autorice la app
function getAuthUrl() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
}

// Intercambia el código por un token de acceso
async function getTokens(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  return tokens;
}

module.exports = {
  getAuthUrl,
  getTokens,
  oAuth2Client,
};
