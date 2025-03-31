const express = require('express');
const { getAuthUrl, getTokens, oAuth2Client } = require('./auth');
const { google } = require('googleapis');
require('dotenv').config(); // Carga las variables de entorno
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const app = express();

// Rutas de la aplicación
app.get('/', (req, res) => {
  res.send('<a href="/auth">Iniciar sesión con Google Classroom</a>');
});

// Ruta para iniciar sesión
app.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// Ruta de callback de OAuth2
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const tokens = await getTokens(code);
  res.send('Autenticación exitosa, tus tokens son: ' + JSON.stringify(tokens));
});

app.get('/classroom', async (req, res) => {
  try {
    if (!oAuth2Client.credentials) {
      return res.redirect('/auth'); // Redirige a login si no hay credenciales
    }

    const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
    const courses = await classroom.courses.list();
    res.json(courses.data);
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      res.send('La sesión expiró. <a href="/auth">Inicia sesión nuevamente</a>');
    } else {
      res.status(500).send('Error: ' + error.message);
    }
  }
});

// Exporta app para usarlo en otros archivos
module.exports = app;

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log({ clientID })
});
