export default function generateQuery(queries: object) {
  let query = "?";
  Object.keys(queries).forEach(function (key, _) {
    // @ts-ignore
    const ne: any = queries[key];
    if (ne != null) {
      query += `${key}=${ne}&`;
    }
  });
  return query;
}
