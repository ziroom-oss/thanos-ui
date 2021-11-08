import XEUtils from 'xe-utils'
import {
  isJSON
} from '@/utils/base'
import {
  parseJson
} from '@/api/model/singleApiList'

// 解析表单参数
export function parseParams (params) {
  const res = {}
  params = Object.values(JSON.parse(JSON.stringify(params)))
  for (const item of params) {
    if (item.key) {
      res[item.key] = item.value
    }
  }
  return XEUtils.isEmpty(res) ? '' : JSON.stringify(res).replace(/\r\n/g, '').replace(/\n/g, '')
}

// 解析JSON为数组
export function parseParamToArr (requestParam) {
  return new Promise((resolve, reject) => {
    const params = []
    if (requestParam) {
      if (!isJSON(requestParam) && requestParam.indexOf('=') !== -1) {
        return getFormatList(requestParam).then(res => {
          if (res.success) {
            return resolve(JSON.parse(res.data))
          }
        })
      } else if (isJSON(requestParam)) {
        const json = JSON.parse(requestParam)
        for (const [key, value] of Object.entries(json)) {
          params.push({
            key,
            value
          })
        }
      }
    }
    return resolve(params)
  })
}

// 参数格式化-----获取param
async function getFormatList (param) {
  const obj = {
    paramterStr: param
  }
  const params = new URLSearchParams()
  for (const item in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, item)) {
      params.append(item, obj[item])
    }
  }
  return await parseJson(params)
}

// 解析header参数
export function parseHeader (header = []) {
  const arr = []

  if (header) {
    header.split(';').map((item) => {
      const [key, value] = item.split(':')
      if (key) {
        arr.push({
          key,
          value
        })
      }
    })
  }
  arr.push({
    key: '',
    value: ''
  })
  return arr
}

/**
 * @description: 提交时解析header
 * @param {Array} header
 * @return {*}
 */
export function parseHeaderTostring (header = []) {
  let str = ''
  for (const key of Object.keys(header)) {
    if (header[key].key !== '') {
      str += `${header[key].key}:${header[key].value};`
    }
  }
  return str
}

export function parseParamsUrl (params) {
  let str = ''
  for (const item of params) {
    if (item.key !== '') {
      str += `${item.key}=${item.value}&`
    }
  }
  return str.slice(0, str.length - 1)
}

// 解析断言
export function parseTests (tests = []) {
  const res = []
  for (const item of tests) {
    let str = ''
    switch (item.assertType) {
      case 0: {
        if (item.normalContent) {
          res.push({
            assertContent: item.normalContent,
            assertType: item.assertType
          })
        }
        continue
      }
      case 1: {
        if (item.schemaContent) {
          res.push({
            assertContent: JSON.stringify(item.schemaContent).replace(/(\\r\\n)|(\\n)|( )/g, '').replaceAll('\\', ''),
            assertType: item.assertType
          })
        }
        continue
      }
      case 2: {
        const map = item.pathContent.map(item => {
          if (item.express && item.operator && item.expectValue && item.link) {
            return `${item.express}${item.operator}${item.expectValue}${item.link}`
          }
        })
        for (const item of map) {
          if (item) {
            str += item
          }
        }
        res.push({
          assertContent: str,
          assertType: item.assertType
        })
        continue
      }
      default:
        continue
    }
  }

  return res
}

export function getJsonPathAssert (tab) {
  let content = ''
  const array = tab.pathContent
  for (let i = 0; i < array.length; i++) {
    content += (array[i].express + array[i].operator + array[i].expectValue + array[i].link)
  }
  if (content.substring(content.length - 4) === 'null') {
    return content.substring(0, content.length - 4)
  }
  return content
}
