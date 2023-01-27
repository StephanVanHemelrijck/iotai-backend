### **Backend for [EvoMission](https://github.com/EHB-MCT/full-projects-3-iotai)**

<hr>

Read more about what end points are available to use when you clone this repository to your local device, running it and surfing to the root end point. You will see a web page with documentation that briefly expects how a request works and what it returns.

### **.ENV File**

<hr>

Before running the application, create a new .env file in the root directory of your project and paste the following code:

```
### DATABASE CONNECTION
DB_HOST=iotai-db.c8gkzkzor7rb.eu-west-3.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=iotai123
DB_PORT=3306
DB_NAME=iotai_db

### PASSWORD HASHING
PW_SALT=9
```

### **Render URL**

<hr>

Backend is being hosted on a free to use service called [Render](https://render.com/). The link used to access our backend is: https://iotai-backend.onrender.com/

### **Run code on your device**

<hr>

You can alter/view this project code by following the guide down below.

### **Before cloning this repo**

This project is compatible with the following versions:

-   Node: v16.13.0+
-   Windows: Windows 10 Build 19044.2130
-   MySQL Workbench: Version 8.0.28 Source distribution
-   Postman: v10
-   Git: Version 2.28.0.windows.1
-   VSCode: Version 1.74.3+

### **Cloning the repository using the command line**

Paste the following command in to your terminal of choice, to clone the repository on to your device

```
gh repo clone EHB-MCT/full-projects-3-iotai
```

Or use the GitHub Desktop client to clone the repository that way using the following link

```
https://github.com/EHB-MCT/full-projects-3-iotai.git
```

### **Before running the code**

Make sure you have installed all the packages needed based on the package.json.
To do this, you need to open a terminal and navigate to the folder's directory, or open an integrated terminal (possible in VSCode). In that terminal type the following command to download the packages needed.

```
npm install
```

You can head over to package.json to find out about what packages we use, listed under 'dependencies'

To install additional packages use the following command:

```
npm i <package_name>
```

or multiple at once

```
npm i <package_name1> <package_name2> <package_name3> ...
```

Recommend heading to [NPM](https://www.npmjs.com/) which is a package manager for Node, to find packages you would like to add to the project, or to read what the implemented ones are about.

### Run the code

In the same terminal, simply use the command

```
npm run dev
```

to run the project. 'dev' is a script that uses nodemon to have the application automatically refresh upon any changes towards the application.

<p align='center'>
<br>
&copy; IOTAI - 2023
<br>
<small>Van Hemelrijck STEPHAN - Vannerum CEDRIC - Van Uden Rachelle - Asselman YORAN - Adahchour NAWFAL - Vankriekinge RYAN<small>
