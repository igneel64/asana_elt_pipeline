import process from 'process';

export function getNDaysAgo(days: number) {
  const nDaysAgo = new Date();
  nDaysAgo.setDate(nDaysAgo.getDate() - days);
  return nDaysAgo;
}

export function getLoadId(externalId: string | number = process.pid) {
  return `node_loader_${externalId}_${Date.now()}`;
}

/* Format is standardized for JSON sources */
export function jsonFormat<T extends {gid: string; modified_at?: string}>(
  data: T[],
  loadId: string | number
) {
  const now = new Date();
  return data.map(element => {
    return {
      id: Number(element.gid),
      info: element,
      mt_loaded_at: now,
      mt_load_process: loadId,
      ...(element.modified_at && {updated_at: element.modified_at}),
    };
  });
}

/* Format is standardized for source tables */
export function tableFormat<T extends {gid: string; modified_at?: string}>(
  data: T[],
  loadId: string | number
) {
  const now = new Date();
  return data.map(element =>
    element.modified_at
      ? [element.gid, element, element.modified_at, now, loadId]
      : [element.gid, element, now, loadId]
  );
}
