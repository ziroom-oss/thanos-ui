import request from '@/utils/request'

export function getOrderList (id) {
  return request('/getSceneStepOrderListByCaseId',
    {
      method: 'get',
      params: id
    },
    'godzilla'
  )
}
