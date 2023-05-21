import {addRefinementTagFunction} from './functions/addRefinementTag';
import {loadProjectsFunction} from './functions/loadProjects';
import {loadTasksFunction} from './functions/loadTasks';
import {loadUsersFunction} from './functions/loadUsers';

export const loadUsers = loadUsersFunction;
export const loadProjects = loadProjectsFunction;
export const loadTasks = loadTasksFunction;
export const addRefinementTag = addRefinementTagFunction;
