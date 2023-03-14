Download the https://data.sfgov.org/api/views/vw6y-z8j6/rows.csv?accessType=DOWNLOAD csv file and place in this folder (github doesn't let me upload more than 25MB file) as 311_Cases.csv

Install the dependencies
>npm install

Start the server
>node app.js

Starts the app in port 3000
Takes about 25s in my 12G laptop to initialize the db in memory from the csv file.

After that UI should be able to hit the endpoints as needed.
