# Online Examination System (OES)
An online examination system made using Angular JS 1.x. 

## Taxonomy of OES
Users of OES are classified into two categories: Administrators and Students (Users). Administrators are responsible for management of system users, subjects, generating various result reports, system backup and recovery, etc. They are also responsible for preparing subjects, tests and questions. Students are the candidates appearing for the Examination.

How to Run
-------------------

* Install [npm](https://www.npmjs.com/get-npm). Install ```bower``` using ```npm install -g bower```.

* Clone the repository.

* Open terminal and move inside the project folder and run ```bower install```.

* Install JSON server:

  ```
  npm install -g json-server
  ```

* Running JSON server:
  ```
  json-server --static . --port 3000 --watch data.json
  ```

* Go to ```http://localhost:3000``` in your browser.


## Screenshots

### Sign In
![alt text](screenshots/SignIn.png "Sign In Page")

### Admin
![alt text](screenshots/CreateAssessment.png "Create Assessment")
![alt text](screenshots/AddQuestion.png "Add Question")
![alt text](screenshots/UploadQuestions.png "Upload Questions")
![alt text](screenshots/Report.png "Examination Report")
![alt text](screenshots/Schedule.png "Schedule Examination")

### Examinee
![alt text](screenshots/Examinee.png "Examinee")
![alt text](screenshots/TakeExam.png "Take Exam")
![alt text](screenshots/Exam.png "Exam")
