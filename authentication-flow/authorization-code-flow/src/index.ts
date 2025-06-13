import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: 'test-client',
    scope: 'openid',
    redirect_uri: 'http://localhost:5000/callback',
  });

  const url = `http://localhost:8080/realms/test-realm/protocol/openid-connect/auth?${params.toString()}`;
  console.log('Redirecting to:', url);
  res.redirect(url);  
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const bodyParams = new URLSearchParams({
    client_id: 'test-client',
    grant_type: 'authorization_code',
    code: req.query.code as string,
    redirect_uri: 'http://localhost:5000/callback',
  });

  const url = `http://localhost:8080/realms/test-realm/protocol/openid-connect/token`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams.toString(),
  })

  const result = await response.json();
  console.log('Token response:', result);
  res.json(result);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

