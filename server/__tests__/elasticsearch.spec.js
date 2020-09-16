const request = require('supertest')
const express = require('express')
const app = express()
const router = require('../elasticsearch')
const createElasticSearchRequestBody = require('../util/createElasticSearchRequestBody')

const mockSearchResponse = {
  took: 7,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 1,
      relation: 'eq'
    },
    max_score: null,
    hits: [
      {
        _index: 'tv.posts',
        _type: '_doc',
        _id: '7',
        _score: null,
        _source: {
          id: '7',
          slug: 'slug',
          title: 'something',
          subtitle: '',
          publishTime: '2020-09-02T09:30:38.355Z',
          categories: [],
          writers: [],
          photographers: [],
          cameraOperators: [],
          designers: [],
          engineers: [],
          vocals: [],
          otherbyline: '',
          heroVideo: null,
          heroImage: {
            title: 'lionelmessi',
            keywords: null,
            urlMobileSized:
              'https://storage.googleapis.com/static-mnews-tw-dev/assets/images/20200901045917-5f4dd5259e6e6400249ff1fd-mobile'
          },
          heroCaption: '',
          style: null,
          topics: null,
          tags: [],
          audio: null,
          ogTitle: '',
          ogDescription: '',
          ogImage: null,
          brief: '',
          content: ''
        },
        sort: [1599039038355]
      }
    ]
  }
}

let mockElasticSearchMethod = jest.fn(() => Promise.resolve(mockSearchResponse))
jest.mock('@elastic/elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        search: mockElasticSearchMethod
      }
    })
  }
})

app.use('/', router)

describe('/api/search', function() {
  beforeEach(() => {
    mockElasticSearchMethod = jest.fn(() => Promise.resolve(mockSearchResponse))
  })

  test('Should response successfully and call search method with proper args by default "from", "size"', async function() {
    expect.assertions(3)

    const query = 'something'
    const res = await request(app)
      .post('/')
      .send({
        query
      })

    expect(mockElasticSearchMethod).toHaveBeenCalledWith({
      index: 'tv.posts',
      from: 0,
      size: 12,
      body: createElasticSearchRequestBody(query),
      sort: 'publishTime:desc'
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(mockSearchResponse)
  })

  test('Should response successfully and call search method with proper args by user provided "from", "size"', async function() {
    expect.assertions(3)

    const query = 'something'
    const from = 10
    const size = 123
    const res = await request(app)
      .post('/')
      .send({
        query,
        from,
        size
      })

    expect(mockElasticSearchMethod).toHaveBeenCalledWith({
      index: 'tv.posts',
      from,
      size,
      body: createElasticSearchRequestBody(query),
      sort: 'publishTime:desc'
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(mockSearchResponse)
  })

  test('Should response error throw by search method', async function() {
    expect.assertions(2)

    mockElasticSearchMethod = jest.fn(() =>
      Promise.reject(new Error('error throw by elasticsearch'))
    )

    const res = await request(app).post('/')
    expect(res.statusCode).toBe(500)
    expect(res.text).toContain('error throw by elasticsearch')
  })
})
