import type {
  Context,
  EventFunction,
} from '@google-cloud/functions-framework/build/src/functions';
import type {PubsubMessage} from '@google-cloud/pubsub/build/src/publisher';
import {loadProjects} from '../../jobs';
import {getLoadId, jsonFormat} from '../../jobs/utils';
import {
  createExternalTableFromGCSBucket,
  bigQuery,
  ASANA_SOURCE_DATASET_ID,
  ASANA_PROJECTS_SOURCE_TABLE_ID,
  PROJECTS_SOURCE_SCHEMA,
} from '../../gcp';

export const loadProjectsFunction: EventFunction = async (
  _: PubsubMessage,
  context: Context
) => {
  const projects = await loadProjects();
  const loadId = getLoadId(context.eventId as string);
  const formattedProjects = jsonFormat(projects, loadId);

  const externalTableId = await createExternalTableFromGCSBucket({
    prefix: 'asana_projects',
    schema: PROJECTS_SOURCE_SCHEMA,
    data: formattedProjects,
    loadId,
  });

  const projectsMergeQuery = `MERGE INTO \`${ASANA_SOURCE_DATASET_ID}.${ASANA_PROJECTS_SOURCE_TABLE_ID}\` T
  USING \`${ASANA_SOURCE_DATASET_ID}.${externalTableId}\` S
  ON T.id = S.id AND T.updated_at = S.updated_at
  WHEN NOT MATCHED THEN
    INSERT (id, updated_at, mt_loaded_at, mt_load_process, info) VALUES (id, updated_at, mt_loaded_at, mt_load_process, info)`;

  console.log(projectsMergeQuery);

  const [job] = await bigQuery.createQueryJob(projectsMergeQuery);
  console.log(`Job ${job.id} started.`);

  const [metadata] = await job.getMetadata();
  console.log(metadata);
};
