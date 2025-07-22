/**
 * get sport Query.
 *
 * @returns {Object}
 */
exports.getSportsQry = (request) => {
  let search =
    request.keyword !== undefined && request.keyword !== ''
      ? `WHERE name LIKE '%${request.keyword}%'`
      : ''
  let select =
    request.select != undefined && request.select !== '' ? request.select : ''
  const query = `SELECT
    ${select}
    FROM  sports ${search}
    ORDER BY field(name, "Tennis" , "Soccer" , "Cricket") DESC,
    order_by ASC limit :limit offset :offset `
  return query
}
