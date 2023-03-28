const express = require('express');
const path = require('path');
const app = express();

const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

app.use('/', webRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.listen(8008, () => {
    console.log('Server started on port 8008');
});