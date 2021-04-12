const createElasticSearchRequestBody = require('../createElasticSearchRequestBody')

test('Should return proper value', function () {
  const queryString = 'one two three'
  expect(createElasticSearchRequestBody(queryString)).toEqual({
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: 'one',
              type: 'phrase',
              fields: ['name', 'briefHtml', 'contentHtml'],
            },
          },
          {
            multi_match: {
              query: 'two',
              type: 'phrase',
              fields: ['name', 'briefHtml', 'contentHtml'],
            },
          },
          {
            multi_match: {
              query: 'three',
              type: 'phrase',
              fields: ['name', 'briefHtml', 'contentHtml'],
            },
          },
        ],
      },
    },
  })
})
