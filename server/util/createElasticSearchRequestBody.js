module.exports = function createElasticSearchRequestBody(queryString = '') {
  const queries = queryString.split(' ')
  return {
    query: {
      bool: {
        should: createMustClauses(queries)
      }
    }
  }

  function createMustClauses(queries = []) {
    return queries.map((query) => ({
      multi_match: {
        query,
        type: 'phrase',
        fields: ['title^2', 'brief', 'content']
      }
    }))
  }
}
