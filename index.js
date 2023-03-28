const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const db = new sqlite3.Database('sqlite.db');

app.get('/api/configs', (req, res) => {
    db.all('SELECT * FROM configs', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/domains', (req, res) => {
    db.all('SELECT * FROM domains', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            res.json(rows);
        }
    });
});

app.get('/ssl', (req, res) => {
    db.all('SELECT * FROM domains', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            function getDaysLeft(start_date) {
                var endDate = Date.parse(start_date);
                var startDate = new Date();
                var difference = endDate - startDate;
                var days = Math.ceil(difference / (1000 * 60 * 60 * 24));
                return days
            }
            for (let k in rows) {
                let daysLeft = getDaysLeft(rows[k].expiry);
                if (daysLeft > 15) {
                    rows[k].daysLeft = daysLeft + ' Days';
                    rows[k].daysLeftTextLabel = 'text-success';
                } else if (daysLeft > 0) {
                    rows[k].daysLeft = daysLeft + ' Days';
                    rows[k].daysLeftTextLabel = 'text-warning';
                } else if (daysLeft == 1) {
                    rows[k].daysLeft = daysLeft + ' Day';
                    rows[k].daysLeftTextLabel = 'text-danger';
                } else {
                    rows[k].daysLeft = "Expired";
                    rows[k].daysLeftTextLabel = 'text-danger';
                }
                rows[k].autorenew = rows[k].autorenew ? "Enabled" : "Disabled";
            }
            res.render('ssl', { data: rows });
        }
    });
});

app.get('/', (req, res) => {
    res.redirect('/ssl');
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.listen(8008, () => {
    console.log('Server started on port 8008');
});