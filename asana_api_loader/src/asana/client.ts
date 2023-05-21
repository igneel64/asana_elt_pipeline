import {Client} from 'asana';

if (typeof process.env.ASANA_API_KEY === 'undefined') {
  throw Error('No Asana API key detected');
}

export const client = Client.create({
  defaultHeaders: {'asana-disable': 'new_goal_memberships,new_user_task_lists'},
}).useAccessToken(process.env.ASANA_API_KEY);
