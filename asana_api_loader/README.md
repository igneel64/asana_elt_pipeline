# asana-api-loader (tasks-projects-users)

## Running the jobs (Local)
Currently there are three jobs available. You can find them under the [jobs folder](./src/jobs/).
1. loadUsers
2. loadProjects
3. loadTasks

To run this jobs in the cloud or locally, you can 

## Dev environment steps (Postgres)
1. Clone the repo
2. `npm install`
3. Copy the .env.sample file. Fill it with values of your choice and rename it as .env
4. Use the index.sample.ts file to test the behaviour in a dev/test database.

In the [pg folder](./src/pg/) you can find an implementation for Postgres type loading.

### Notes
- The usage of 
- On `loadTasks` we retrieve the tasks modified in the last 3 days. This is just for demonstration purposes and can be configured based on the size of the project and job scheduling.