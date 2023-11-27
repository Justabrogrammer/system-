// Function to add a new project
function addProject() {
    const projectName = document.getElementById("projectName").value;
    const projectDescription = document.getElementById("projectDescription").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const status = document.getElementById("status").value;

    // Send data to the server
    fetch('/addProject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectName,
            projectDescription,
            startDate,
            endDate,
            status,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response);
        return response.text();
    })
    .then(data => {
        console.log(data);
        // After successful project addition, refresh the projects list
        getProjects();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
    });
}

// Function to fetch and display all projects



function getProjects() {
    fetch('/getProjects')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(projects => {
        // ... your existing codeconst projectsUl = document.getElementById("projectsUl");
        projectsUl.innerHTML = '';

        projects.forEach(project => {
            const listItem = document.createElement("li");
            listItem.textContent = `Project: ${project.ProjectName}, Description: ${project.ProjectDescription}, Status: ${project.Status}`;
            projectsUl.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
    });
}
// Initial fetch of projects when the page loads
getProjects();