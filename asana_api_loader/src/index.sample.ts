import dotenv from 'dotenv';
dotenv.config();

import {loadProjects, loadTasks, loadUsers} from './jobs';
import {pgInsertProjects, pgInsertTasks, pgInsertUsers} from './pg/load';
import {addTagToTask} from './asana/tasks';
import {createTag, getTags} from './asana/tags';

(async function () {
  /** You can enable any job you want to test this. */
  // const users = await loadUsers();
  // await pgInsertUsers(users);
  // const projects = await loadProjects();
  // await pgInsertProjects(projects);
  // const tasks = await loadTasks();
  // await pgInsertTasks(tasks);
})();
