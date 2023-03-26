const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Create a new database instance and open a connection to it
const db = new sqlite3.Database('sqlite.db');

// Define a route to retrieve data from the database
app.get('/api/configs', (req, res) => {
    // Execute a SQL query to retrieve data from the database
    db.all('SELECT * FROM configs', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      } else {
        // Send the retrieved data as a JSON response
        res.json(rows);
      }
    });
  });

  // Define a route to retrieve data from the database
app.get('/api/domains', (req, res) => {
    // Execute a SQL query to retrieve data from the database
    db.all('SELECT * FROM domains', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      } else {
        // Send the retrieved data as a JSON response
        res.json(rows);
      }
    });
  });

app.get('/ssl', (req, res) => {
  // Execute a SQL query to retrieve data from the database
  db.all('SELECT * FROM domains', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
      function getDaysLeft(start_date) {
        // Parse the start and end dates as Date objects
        var endDate = Date.parse(start_date);
        var startDate = new Date();

        // Calculate the number of milliseconds between the start and end dates
        var difference = endDate - startDate;

        // Calculate the number of days from the difference in milliseconds
        var days = Math.ceil(difference / (1000 * 60 * 60 * 24));

        // Return the number of days left or "Expired" if the end date has passed
        return days
      }
      for (let k in rows) {
        rows[k].daysLeft = getDaysLeft(rows[k].expiry)
        if(rows[k].daysLeft > 15){
            rows[k].daysLeft = rows[k].daysLeft + ' Days';
            rows[k].daysLeftTextLabel = 'text-success';
        }else if(rows[k].daysLeft < 15 && rows[k].daysLeft > 0){
            rows[k].daysLeft = rows[k].daysLeft + ' Days';
            rows[k].daysLeftTextLabel = 'text-warning';
        }else if(rows[k].daysLeft == 1) {
            rows[k].daysLeft = rows[k].daysLeft + ' Day';
            rows[k].daysLeftTextLabel = 'text-danger';
        }else {
            rows[k].daysLeft = "Expired";
            rows[k].daysLeftTextLabel = 'text-danger';
        }
        if(rows[k].autorenew == true) {
            rows[k].autorenew = "Enabled"
        }else{
            rows[k].autorenew = "Disabled"
        }
      }
      res.render('ssl', { data: rows });
    }
  });
});

app.get('/', (req, res) => {
    // Redirect the user to the SSL version of the site
    res.redirect('/ssl');
});

// Define a route to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Start the server and listen on port 8008
app.listen(8008, () => {
  console.log('Server started on port 8008');
});