# visitDev
Node APIs interacting with mysql db

API
POST : 
Endpoint : /users/{user id}

Assumptions : 
The API will be used by a user, to upload his/her Steps and Calories, hence we will accept only files with a single user id
Create requests will only be accomodated, no older records of the user will be updated in the database
Authentication requirements are minimal
Basic response handling

Implementation : 
User ID will be added to the URL to match the User ID in the records for authentication
Responses
200 : Records added 
304 : ( when User id records not found/ invalid)
400 : Bad Request (for non CSV files)
CSV format : user id | name | steps |  calories


GET : 
Endpoint : /users/{user id}?date
Assumptions : 
A single user will be using the GET request to get his/her Steps and Calories for the all the previous days or a specific date
Implementation : 
Return a JSON object fields: 
Name, data , steps, calories


DATABASE
Table 1 : User id -> name 
Table 2 : (User id , Date)  -> Steps, calories


SCRIPT : 
Adds CSV files from a folder to DB.
Follows the schema
Creation is supported,  users name or historical data cannot be updated


PS : run npm install before testing, mode_modules have not been uploaded
   : Code cleanup and comments will be done later
