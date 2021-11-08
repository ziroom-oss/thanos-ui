import { instance } from '@/api/http'

const request = (url, config = {}, baseOriginal, preInterface = 'telot') => {
  if (config.formData) {
    Object.assign(config, {
      transformRequest: [
        function (data) {
          let ret = ''
          for (const it in data) {
            if (Object.prototype.hasOwnProperty.call(data, it)) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
          }
          return ret
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  return instance({
    url: `/${preInterface}${url}`,
    ...config
  })
}

export default request
