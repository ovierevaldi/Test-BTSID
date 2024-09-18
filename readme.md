node used: 20

how to run:
1. install node,
2. npm install
3. node .\app.js or node app.js
4. For testing only use the assigned username & pass for login
5. for bearer token, make sure get it when calling login API
6. In code you will find the dummy data for user & checklist since we not use any DB
7. For secrets, i use .env file but since it's only simple test the .env will be pushed to the git also
8. Check the id for the items and checklist dummydata on the routes/checklist.js

List API TEST

<!-- Register User API -->
 POST http://localhost:8080/register HTTP/1.1
 content-type: application/json
 {
     "username": "ovierevaldi",
     "email": "revaldiovie3@gmail.com",
    "password": "pass123"
 }

<!-- Login API -->
 POST http://localhost:8080/login HTTP/1.1
 content-type: application/json

 {
     "username": "ovierevaldi",
     "password": "pass123"
 }

<!-- Insert a new checklist with task inside it -->
 POST http://localhost:8080/checklist HTTP/1.1
 Authorization: Bearer {token}
 content-type: application/json
 {
    "tasks": [
         { "task": "Go for a run", "completeStatus": false },
         { "task": "Write a blog post", "completeStatus": false }
     ]
 }

<!-- Get All checklist-->
GET http://localhost:8080/checklist HTTP/1.1
Authorization: Bearer {token}

<!-- Delete Checklist By ID-->
DELETE http://localhost:8080/checklist/2
Authorization: Bearer {token}

<!-- Get Checklist By ID-->
GET http://localhost:8080/checklist/2
Authorization: Bearer {token}

<!-- Insert Item By checklist ID -->
POST http://localhost:8080/checklist/1/item HTTP/1.1
content-type: application/json
Authorization: Bearer {token}
{
   "task": "Go for a run", "completeStatus": false
}

<!-- GEt specific Item By checklist ID -->
GET http://localhost:8080/checklist/1/item/2
Authorization: Bearer {token}

<!-- Update specific Item status By checklist ID -->
PUT http://localhost:8080/checklist/1/item/1
Content-Type: application/json

{
    "completedStatus": true
}

<!-- Delete specific Item By checklist ID -->
DELETE http://localhost:8080/checklist/2/item/3


<!-- Update Item Name By checklist ID -->
PUT http://localhost:8080/checklist/1/item/rename/1
Content-Type: application/json
{
     "newTaskName": "new task renamed"
}


