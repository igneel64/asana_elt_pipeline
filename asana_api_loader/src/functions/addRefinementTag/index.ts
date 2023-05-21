import type {
  Context,
  EventFunction,
} from '@google-cloud/functions-framework/build/src/functions';
import type {PubsubMessage} from '@google-cloud/pubsub/build/src/publisher';
import {
  bigQuery,
  ASANA_SOURCE_DATASET_ID,
  ASANA_TASKS_TO_BE_REFINED_TABLE_ID,
} from '../../gcp';
import {createTag, getTags} from '../../asana/tags';
import {addTagToTask} from '../../asana/tasks';

const REFINEMENT_TAG_NAME = 'to-be-refined';

export const addRefinementTagFunction: EventFunction = async (
  _: PubsubMessage,
  __: Context
) => {
  const tags = await getTags();
  let refinementTagId = '';

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.name === REFINEMENT_TAG_NAME) {
      refinementTagId = tag.gid;
      break;
    }
  }
  if (!refinementTagId) {
    const refinementTag = await createTag(REFINEMENT_TAG_NAME);
    refinementTagId = refinementTag.gid;
  }

  const getRefinementTaskIdsQuery = `SELECT CAST(task_id as FLOAT64) AS task_id FROM \`${ASANA_SOURCE_DATASET_ID}.${ASANA_TASKS_TO_BE_REFINED_TABLE_ID}\`;`;

  console.log(getRefinementTaskIdsQuery);

  const [job] = await bigQuery.createQueryJob(getRefinementTaskIdsQuery);
  console.log(`Job ${job.id} started.`);

  const [taskIds] = await job.getQueryResults();

  for (let i = 0; i < taskIds.length; i++) {
    const taskId = taskIds[i].task_id;
    await addTagToTask(taskId, refinementTagId);
  }
};
