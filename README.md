# todolist_backendapis 
Backend API Documentation for to do list using node js
1.End point : http://localhost:5000/register
Method: POST
Description: To register
Request Body:
Json
{
 "username": "vignesh",
 "name": "vignesh",
 "password": "123"
}
Responses
• 400 - All fields are mandatory
• 409 – Username already exits
• 200 – Register success
• 400 – Data is not valid
2.End point : http://localhost:5000/login
Method: POST
Description: To login
Request Body:
Json
{
 "username": "vignesh",
 "password": "123"
}
Responses
• 400 - All fields are mandatory
• 200 – login success, if login success it will give auth token
• 401 – Invalid username or password
3.End point : http://localhost:5000/user/addtask
Method: POST
Description: To add task
Request Body:
Json
{
 "username":"vignesh",
 "taskname":"wake-up",
 "taskdescription":"Dont sleep study for exams"
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 409 - Task is already in the list
• 404 - User not found
• 200 – Task added successfully
• 400 – Task data is not valid
4.End point : http://localhost:5000/user/updatetaskstatus
Method: POST
Description: To update status as completed for task
Request Body:
Json
{
 "username":"vignesh",
 "taskname":"wake-up"
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 404 - Task not found
• 200 – Changed successfully
• 400 – Updation failed
5.End point : http://localhost:5000/user/delete
Method: POST
Description: To delete not completed task from list
Request Body:
Json
{
 "username":"vignesh",
 "taskname":"wake-up"
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 404 - Task not found
• 200 – Deleted successfully
• 400 – Failed to delete task from list
6.End point : http://localhost:5000/user/gettask/completed
Method: POST
Description: To get all completed task of user
Request Body:
Json
{
 "username":"vignesh",
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 404 - User not found
• 200 – sent successfully
7.End point : http://localhost:5000/user/gettask/notcompleted
Method: POST
Description: To get all not completed task of user
Request Body:
Json
{
 "username":"vignesh",
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 404 - User not found
• 200 – sent successfully
8.End point : http://localhost:5000/user/getallusertask
Method: POST
Description: To get all task of user
Request Body:
Json
{
 "username":"vignesh",
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 404 - User not found
• 200 – sent successfully
9.End point : http://localhost:5000/user/logout
Method: POST
Description: To logout account
Request Body:
Json
{
 "username":"vignesh",
}
And Auth token
Responses
• 401 - Access Denied due to mismatch of username
• 200 – sent successfully
