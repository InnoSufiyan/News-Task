# News Aggregator Website - Docker Documentation

## Project Overview

The **News Aggregator Website** aggregates news from various sources and presents them in a user-friendly interface. The project uses **React** for the frontend and **Vite** as the build tool. The frontend application is fully containerized using Docker to make it easier to deploy and manage.

### Features:
- Aggregates news articles from different sources.
- Responsive design.
- State management using **Redux Toolkit**.
- Vite for fast development and bundling.

---

## Prerequisites

Before you can run the project inside a Docker container, ensure you have the following installed on your system:

- **Docker**: Install Docker from [here](https://www.docker.com/get-started).
- **Git**: Install Git from [here](https://git-scm.com/).
- **Node.js** (optional, for development purposes): You can download it from [here](https://nodejs.org/).

---

## Steps to Run the Project in Docker

### 1. **Clone the Repository**

Start by cloning the repository to your local machine.

```bash
git clone https://github.com/InnoSufiyan/News-Task.git
cd News-Task
```

### 2. **Building the Docker Image**

Now, you will build the Docker image for your frontend application. From the root directory of the cloned project, run:

```bash
docker build -t innoscripta-task .
```

This will build the Docker image using the `Dockerfile` and tag it as `innoscripta-task`.

### 3. **Running the Docker Container**

Once the image is built, you can run the application in a Docker container. Run the following command:

```bash
docker run -d -p 5173:5173 --name innoscripta-task-container innoscripta-task
```

- `-d`: Run the container in detached mode (in the background).
- `-p 5173:5173`: Map port 5173 on the host machine to port 5173 inside the container (this is the port on which Vite serves the app).
- `--name innoscripta-task-container`: Assign a name to the container for easier management.
- `innoscripta-task`: The name of the image you built earlier.

### 4. **Access the Application**

Once the container is running, open your browser and go to:

```
http://localhost:5173
```

You should now see your news aggregator website running inside a Docker container.

### 5. **Stopping the Docker Container**

To stop the running container, use the following command:

```bash
docker stop innoscripta-task-container
```