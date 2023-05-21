import asana from 'asana';
import {client} from './client';
import {paginate} from './utils';

type AvailableTagColors =
  | 'dark-blue'
  | 'dark-brown'
  | 'dark-green'
  | 'dark-orange'
  | 'dark-pink'
  | 'dark-purple'
  | 'dark-red'
  | 'dark-teal'
  | 'dark-warm-gray'
  | 'light-blue'
  | 'light-green'
  | 'light-orange'
  | 'light-pink'
  | 'light-purple'
  | 'light-red'
  | 'light-teal'
  | 'light-warm-gray'
  | 'light-yellow'
  | 'none';

const tagFields = 'name';

async function fetchTags(offset?: string) {
  return await client.tags.findByWorkspace(
    Number(process.env.ASANA_WORKSPACE_ID),
    {
      offset,
      opt_fields: tagFields,
    }
  );
}

export async function getTags() {
  return await paginate<asana.resources.Tags.Type[]>(fetchTags);
}

const DEFAULT_TAG_COLOR = 'light-pink';

export async function createTag(
  name: string,
  color: AvailableTagColors = DEFAULT_TAG_COLOR
) {
  return await client.tags.createInWorkspace(
    Number(process.env.ASANA_WORKSPACE_ID),
    // @ts-expect-error Asana typing for this method are incorrect.
    // Available colors are AvailableTagColors
    {name, color}
  );
}
