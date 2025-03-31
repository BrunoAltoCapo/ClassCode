// auth.js

const scopes = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me'
];


const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config(); // Carga las variables de entorno
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let oauth2Client; // Inicializa el cliente OAuth

// Función para obtener la URL de autorización
const getAuthUrl = () => {
  oauth2Client = new OAuth2(
    process.env.CLIENT_ID,   // El CLIENT_ID que obtuviste de la consola de Google
    process.env.CLIENT_SECRET,   // El CLIENT_SECRET que obtuviste de la consola de Google
    'http://localhost:3000/oauth2callback'   // La URI de redirección que debe coincidir con la configuración en Google Cloud
  );

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/classroom.courses.readonly']
  });
};

// Función para obtener los tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Exporta las funciones
module.exports = {
  getAuthUrl,
  getTokens,
  oAuth2Client: oauth2Client,
};
