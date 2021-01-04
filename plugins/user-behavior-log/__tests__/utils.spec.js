import { createUserBehaviorLog } from '../utils'

describe('properties of log', () => {
  test('target', async () => {
    const mockTarget = {
      tagName: 'A',
      className: 'mock-class-name',
      id: 'mock-id',
    }

    const log = await createUserBehaviorLog({ target: mockTarget })
    expect(log).toMatchObject({
      target_class_name: mockTarget.className,
      target_id: mockTarget.id,
      target_tag_name: mockTarget.tagName,
    })
  })
  test('referrer', async () => {
    const mockReferrer = 'abc'
    jest.spyOn(document, 'referrer', 'get').mockReturnValue(mockReferrer)

    const log = await createUserBehaviorLog()
    expect(log).toMatchObject({
      referrer: mockReferrer,
    })
  })
  test('datetime', async () => {
    const now = Date.now()
    jest.spyOn(Date, 'now').mockReturnValue(now)

    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      datetime: now,
    })
  })
  test('viewport_size', async () => {
    const mockWidth = 123
    jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockImplementation(() => mockWidth)
    const mockHeight = 123
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => mockHeight)

    const log = await createUserBehaviorLog()
    expect(log).toMatchObject({
      viewport_size: `${mockWidth}x${mockHeight}`,
    })
  })
  test('screen_resolution', async () => {
    const mockWidth = 123
    jest
      .spyOn(window.screen, 'width', 'get')
      .mockImplementation(() => mockWidth)
    const mockHeight = 123
    jest
      .spyOn(window.screen, 'height', 'get')
      .mockImplementation(() => mockHeight)

    const log = await createUserBehaviorLog()
    expect(log).toMatchObject({
      screen_resolution: `${mockWidth}x${mockHeight}`,
    })
  })
})
