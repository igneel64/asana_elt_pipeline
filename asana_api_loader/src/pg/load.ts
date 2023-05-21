import format from 'pg-format';
import {
  ASANA_PROJECTS_TABLE,
  ASANA_TASKS_TABLE,
  ASANA_USERS_TABLE,
} from './constants';
import {query} from '.';
import {getLoadId, tableFormat} from '../jobs/utils';

export async function pgInsertUsers(users: any) {
  const loadId = getLoadId();
  const formattedUsers = tableFormat(users, loadId);
  const stm = format(
    `insert into ${ASANA_USERS_TABLE} (id, info, mt_loaded_at, mt_load_process) values %L on conflict do nothing`,
    formattedUsers
  );
  await query(stm);
}

export async function pgInsertTasks(tasks: any) {
  const loadId = getLoadId();
  const formattedTasks = tableFormat(tasks, loadId);
  const stm = format(
    `insert into ${ASANA_TASKS_TABLE} (id, info, updated_at, mt_loaded_at, mt_load_process) values %L on conflict do nothing`,
    formattedTasks
  );
  await query(stm);
}

export async function pgInsertProjects(projects: any) {
  const loadId = getLoadId();
  const formattedProjects = tableFormat(projects, loadId);
  const stm = format(
    `insert into ${ASANA_PROJECTS_TABLE} (id, info, updated_at, mt_loaded_at, mt_load_process) values %L on conflict do nothing`,
    formattedProjects
  );
  await query(stm);
}
