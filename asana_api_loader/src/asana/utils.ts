export async function paginate<T>(action: any, args?: any): Promise<T> {
  const res = await action(undefined, args);
  let results = res.data;
  let nextPageOffset = res._response?.next_page?.offset;

  while (nextPageOffset) {
    const res = await action(nextPageOffset, args);
    results = results.concat(res.data);
    if (res._response?.next_page?.offset) {
      nextPageOffset = res._response.next_page.offset;
    } else {
      break;
    }
  }

  return results;
}
