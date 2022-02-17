University of Arizona: Computer Science Tutoring Center Queue

Contributors:
Connor Brett
Hung Le Ba

# How to Run Locally
1. Open the workspace file in the directory in VSCode. You will see two folders, front-end and server.
2. Navigate to the "Run and Debug" tab of the VSCode project.
3. Run the `Start (front-end)` and `Python: Django (server)` options.
4. Navigate to `http://localhost:4200` to view the front end and `http://localhost:8000/swagger` to view the API docs.

## First Time Setup
To initialize the project, you will have to two sets of commands.
### Server
1. In the `server` folder, run `python3 -m venv env`, then `source ./env/bin/activate`, and then `pip install -r requirements.txt`. This will install all required packages into a virtual environment.
2. In the `front-end` folder, run `npm i`.
