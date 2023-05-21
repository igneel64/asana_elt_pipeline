import {getTasks} from '../asana/tasks';
import {getNDaysAgo} from './utils';
import {getProjects} from '../asana/projects';
import asana from 'asana';

const TASKS_MODIFIED_SINCE =
  Number(process.env.ASANA_TASKS_MODIFIED_SINCE) || 3;

export async function loadTasks() {
  const projectIds = await getProjects();
  const threeDaysAgo = getNDaysAgo(TASKS_MODIFIED_SINCE);
  let tasks: asana.resources.Tasks.Type[] = [];

  for (let i = 0; i < projectIds.length; i++) {
    const projectTasks = await getTasks(projectIds[i].gid, threeDaysAgo);
    if (projectTasks.length) {
      tasks = tasks.concat(projectTasks);
    }
  }
  return tasks;
}
