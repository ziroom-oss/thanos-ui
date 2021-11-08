import request from '@/utils/request'

export function getMockMsgList (param, data) {
  return request(
    '/mockServer/mq/msg/list',
    {
      method: 'post',
      params: param,
      data
    },
    'godzilla'
  )
}

export function saveMockMqMsg (data) {
  return request(
    '/mockServer/mq/msg/save',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function updateMockMqMsg (data) {
  return request(
    '/mockServer/mq/msg/update',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}

export function deleteMockMqMsg (param) {
  return request(
    '/mockServer/mq/msg/delete',
    {
      method: 'post',
      params: param
    },
    'godzilla'
  )
}

export function getMockMqMsqCreators () {
  return request(
    '/mockServer/mq/msg/creator',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function getMockMqConfigList () {
  return request(
    '/mockServer/mq/msg/configList',
    {
      method: 'get'
    },
    'godzilla'
  )
}

export function getMockMqMsgInfo (param) {
  return request(
    '/mockServer/mq/msg/info',
    {
      method: 'get',
      params: param
    },
    'godzilla'
  )
}

export function sendMockMqMsg (param) {
  return request(
    '/mockServer/mq/msg/send',
    {
      method: 'post',
      params: param
    },
    'godzilla'
  )
}

export function sendMockMqMsgDirectly (data) {
  return request(
    '/mockServer/mq/msg/sendForm',
    {
      method: 'post',
      data
    },
    'godzilla'
  )
}
