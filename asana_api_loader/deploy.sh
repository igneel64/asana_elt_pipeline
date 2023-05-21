# Deployment examples
# Don't forget to compile before deploying. `npm run compile`

# gcloud functions deploy loadUsers --runtime=nodejs18 --trigger-topic=LOAD_USERS --env-vars-file=.env.yml
# gcloud functions deploy loadProjects --runtime=nodejs18 --trigger-topic=LOAD_PROJECTS --env-vars-file=.env.yml
# gcloud functions deploy loadTasks --runtime=nodejs18 --trigger-topic=LOAD_TASKS --env-vars-file=.env.yml
# gcloud functions deploy addRefinementTag --runtime=nodejs18 --trigger-topic=ADD_REFINEMENT_TAG --env-vars-file=.env.yml