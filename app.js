let express = require("express");
let mysql = require("mysql");
let http = require("http");

let multer = require('multer');
let csv = require('fast-csv');
let fs = require('fs');
const upload = multer({ dest: 'tmp/csv/' });




let app  = express();


http.createServer(app).listen(3306, function() {
    console.log("Listening on http://localhost:" + 3306);
});


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shonhitTesting"
    // port: 8000
});

connection.connect(function(err) {
  if (err){
  	console.log("could not connect");
  	throw err;
  } 
  console.log("Connected!");
  // connection.query("CREATE DATABASE mydb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
});

app.post('/users/:id',upload.single('file'), function(req,resp){
	const fileRows = [];

	console.log("POSTING STARTED");

	// let uuid = req.params.id;

  csv.fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
            console.log(data) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column

    })
     .on("end", function () {
      // console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      let uuid = req.params.id;

			

			 if(fileRows.length > 1){
			 	for(itr = 1; itr < fileRows.length ; itr++){
			 		if(fileRows[itr].length != 5){
			     		resp.send("INVALID CSV FILE");
			     		resp.status(400).end();
			     			throw Error;
			     			break;
			     	}

			     	

				connection.query("INSERT INTO users(userid,name) VALUES (" + fileRows[itr][1] + ",'" + fileRows[itr][0] + "')", 
					function(err,result,fields){
						if(err){
							console.log("unable to add user " + fileRows[itr]);
						}
						// console.log(result);
					});
			// console.log("querying for " + fileRows[itr]);
			  // console.log("INSERT INTO usersdata(userid, date , steps , calories) VALUES (" + fileRows[itr][1] + "," + fileRows[itr][2] + ","+ fileRows[itr][3] + "," +  fileRows[itr][4] +")");

				connection.query("INSERT INTO usersdata(userid, date , steps , calories) VALUES (" + fileRows[itr][1] + "," + fileRows[itr][2] + "," + fileRows[itr][3] + "," +  fileRows[itr][4] +")", 
					function(err,result,fields){
						if(err){
							console.log("unable to add usersData " + fileRows[itr]);
						}
					});

			 	}
			 }
			 else{
			 	resp.status(304);
			 }

			 resp.end();

			     	
      
    })



});


app.get('/users/:id',function(req,resp){
	console.log("");
	let userID = req.params.id;
	let qDate = req.query.date;

	if(!qDate){

		connection.query("SELECT a.userid, a.name, b.date, b.steps, b.calories FROM users a, usersdata b WHERE a.userid = b.userid AND a.userid=" 
			+ userID, function (err, result, fields) {
		    if (err) {
		    	// resp.json({});
		    	resp.send("DB inaccessible");
		    	console.log("ERROR CASE");
		    	throw err;
		    }
			// console.log("PRINTING USER SPECIFIC JOINS ETC")
		    // console.log(fields);
		    
		    		if(result.length >0){
		    			resp.send(result);
		    		}
		    		else{
		    			resp.send("No results found for this id");
		    			// resp.status(304);
		    		}
		  });

	}else{
		connection.query("SELECT a.userid, a.name, b.date, b.steps, b.calories FROM users a, usersdata b WHERE a.userid = b.userid AND a.userid=" 
			+ userID + " AND b.date = " + qDate, function (err, result, fields) {
		    		if (err) {
		    			resp.send("DB inaccessible");
		    			console.log("ERROR CASE");
		    			throw err;
		    		}
		    		// console.log("PRINTING DATE SPECIFIC JOINS ETC");

		    		
		    		if(result.length >0){
		    			resp.send(result);
		    		}
		    		else{
		    			resp.send("No results found for this id and date");
		    			// resp.status(304);
		    		}
		  });

	}

	// connection.query("SELECT * FROM example", function (error, rows, fields){
	// 	// callback function after query is complete while handling the error as well
	// 	if(error){
	// 		console.log("ERROR MYSQL QUERY");
	// 	}
	// 	else{
	// 		console.log("SUCCESS MYSQL QUERY");
	// 	}
	// });
});


// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
// connection.end();

