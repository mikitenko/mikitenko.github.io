export function postToParentPath(to) {
  if (to.params.id) {
    let queries = Object.keys(to.query);
    let queryString = "";
    if (queries.length) {
      queries.forEach((el, index) => {
        queryString +=
          index === 0 ? `?${el}=${to.query[el]}` : `&${el}=${to.query[el]}`;
      });
    }
    const newUrl = to.path.split(to.params.id)[1] + queryString;
    const urlForWindow = `scandi-path-app:${newUrl}`;
    window.parent.postMessage(urlForWindow, "*");
  }
}
