import express from 'express';

import movies from './db/movies.js';

const app = express();

app.get('/movies', (req, res) => {
    res.json(movies);
});


// app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>');
// });

// app.get('/contacts', (req, res) => {
//     console.log(req.method);
//     console.log(req.url);
//     res.send('<h1>Contacts page</h1>');
// });

app.listen(3000, () => console.log('Server is running on port 3000'));
