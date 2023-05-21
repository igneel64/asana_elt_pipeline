import type {
  Context,
  EventFunction,
} from '@google-cloud/functions-framework/build/src/functions';
import type {PubsubMessage} from '@google-cloud/pubsub/build/src/publisher';
import {loadTasks} from '../../jobs';
import {getLoadId, jsonFormat} from '../../jobs/utils';
import {
  createExternalTableFromGCSBucket,
  bigQuery,
  ASANA_SOURCE_DATASET_ID,
  ASANA_TASKS_SOURCE_TABLE_ID,
  TASKS_SOURCE_SCHEMA,
} from '../../gcp';

export const loadTasksFunction: EventFunction = async (
  _: PubsubMessage,
  context: Context
) => {
  const tasks = await loadTasks();
  const loadId = getLoadId(context.eventId as string);
  const formattedTasks = jsonFormat(tasks, loadId);

  const externalTableId = await createExternalTableFromGCSBucket({
    prefix: 'asana_tasks',
    schema: TASKS_SOURCE_SCHEMA,
    data: formattedTasks,
    loadId,
  });

  const tasksMergeQuery = `MERGE INTO \`${ASANA_SOURCE_DATASET_ID}.${ASANA_TASKS_SOURCE_TABLE_ID}\` T
    USING \`${ASANA_SOURCE_DATASET_ID}.${externalTableId}\` S
    ON T.id = S.id AND T.updated_at = S.updated_at
    WHEN NOT MATCHED THEN
      INSERT (id, updated_at, mt_loaded_at, mt_load_process, info) VALUES (id, updated_at, mt_loaded_at, mt_load_process, info)`;

  console.log(tasksMergeQuery);

  const [job] = await bigQuery.createQueryJob(tasksMergeQuery);
  console.log(`Job ${job.id} started.`);

  const [metadata] = await job.getMetadata();
  console.log(metadata);
};
