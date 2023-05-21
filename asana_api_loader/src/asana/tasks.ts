import asana from 'asana';
import {client} from './client';
import {paginate} from './utils';

const taskFields =
  'actual_time_minutes,assignee,assignee_status,completed,completed_at,created_at,due_at,due_on,modified_at,name,tags,projects,memberships';

interface TaskOptions {
  projectId?: string;
  modifiedSince?: string;
}

async function fetchTasks(offset?: string, options?: TaskOptions) {
  return await client.tasks.findAll({
    offset,
    opt_fields: taskFields,
    project: options?.projectId,
    modified_since: options?.modifiedSince,
  });
}

export async function getTasks(
  projectId: string | number,
  modifiedSince: Date
) {
  return await paginate<asana.resources.Tasks.Type[]>(fetchTasks, {
    projectId,
    modifiedSince: modifiedSince.toISOString(),
  });
}

export async function addTagToTask(taskId: string | number, tag: string) {
  return await client.tasks.addTag(String(taskId), {tag});
}
