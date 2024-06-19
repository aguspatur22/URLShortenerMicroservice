require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

//Simulate DB
let urlDatabase = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;
  let urlObj;
  try {
    urlObj = new URL(url);
    if (urlObj.protocol != 'http:' && urlObj.protocol != 'https:') {
      throw new Error('invalid url');
    }
  }
  catch (err) {
    return res.json({ error: 'invalid url' });
  }
  let key = urlDatabase.length + 1;
  urlDatabase[key] = url;
  res.json({ original_url: url, short_url: key });
});

app.get('/api/shorturl/:key', function(req, res) {
  let short_url = req.params.key;
  if (!urlDatabase[short_url]) {
    return res.json({ error: 'No short url found for given input' });
  }
  res.redirect(urlDatabase[short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
