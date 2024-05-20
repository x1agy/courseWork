<h1>Andrews course work, music online school</h1>

<p>For installation: </p>
<code>
    cd backend
    npm ci
    npm start
    cd ../
    cd front
    npm ci
    npm start
</code>

<h2>For database include</h2>
<p>Open yours mongoDB, make db, name it courseDB, create new collection and name it users</p>
<p>Copy url of DB, and paste it in backend/.env in DB_URL</p>

<h2>For create teacher account add field 'role: "teacher"' for new user in your DB</h2>

<h2>For environment variables: </h2>

<p>In front folder remove .example from .env.example file name</p>

<p>In backend folder get your google login and password for emailer (https://myaccount.google.com/apppasswords) and paste them in .env.example.</p>
<p>Copy your mongoDB link and paste it in it too. Remove .example from filename</p>

<h2>Creating google meets:</h2>

<p>Go to: https://developers.google.com/meet/api/guides/quickstart/nodejs?hl=ru#set_up_your_environment and get credentials.json</p>
<p>then paste file in backend folder, on first try to create meeting you will be redirected in google auth, and then your token will appear</p>