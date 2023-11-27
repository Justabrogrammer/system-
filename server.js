const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dbPath = path.resolve(__dirname, 'project.db');
const db = new sqlite3.Database(dbPath);

// Create Projects table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Projects (
    ProjectID INTEGER PRIMARY KEY,
    ProjectName TEXT,
    ProjectDescription TEXT,
    StartDate DATE,
    EndDate DATE,
    Status TEXT
)`);

// Create Tasks table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Tasks (
    TaskID INTEGER PRIMARY KEY,
    TaskName TEXT,
    TaskDescription TEXT,
    ProjectID INTEGER,
    AssignedTo INTEGER,
    Deadline DATE,
    Status TEXT,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    FOREIGN KEY (AssignedTo) REFERENCES Resources(ResourceID)
)`);

// Create Resources table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Resources (
    ResourceID INTEGER PRIMARY KEY,
    ResourceName TEXT,
    Role TEXT,
    Email TEXT,
    Phone TEXT
)`);

// Create Collaboration table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Collaboration (
    DiscussionBoardID INTEGER PRIMARY KEY,
    ProjectID INTEGER,
    ThreadTitle TEXT,
    ThreadContent TEXT,
    Author TEXT,
    Timestamp TIMESTAMP,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
)`);

// Create FileSharing table if not exists
db.run(`CREATE TABLE IF NOT EXISTS FileSharing (
    FileID INTEGER PRIMARY KEY,
    ProjectID INTEGER,
    FileName TEXT,
    FilePath TEXT,
    UploadedBy TEXT,
    UploadTimestamp TIMESTAMP,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
)`);

// API endpoint to handle project creation
app.post('/addProject', (req, res) => {
    const { projectName, projectDescription, startDate, endDate, status } = req.body;
   console.log(req.body);
    db.run(`INSERT INTO Projects (ProjectName, ProjectDescription, StartDate, EndDate, Status) VALUES (?, ?, ?, ?, ?)`,
        [projectName, projectDescription, startDate, endDate, status],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
            } else {
                console.log(`Project added with ID: ${this.lastID}`);
                res.status(200).send('Project added successfully');
            }
        });
});

// API endpoint to fetch all projects
app.get('/getProjects', (req, res) => {
    db.all(`SELECT * FROM Projects`, (err, projects) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(projects);
        }
    });
});

// Other API endpoints for tasks, resources, collaboration, and file sharing can be similarly implemented

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
