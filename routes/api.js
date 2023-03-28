const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const api = express.Router();
const db = new sqlite3.Database('sqlite.db');

api.get('/configs', (req, res) => {
    db.all('SELECT * FROM configs', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            res.json(rows);
        }
    });
});

api.get('/domains', (req, res) => {
    db.all('SELECT * FROM domains', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            res.json(rows);
        }
    });
});

module.exports = api;