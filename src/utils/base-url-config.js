// 切换 baseUrl

export function getBaseURL (baseOriginal) {
  let baseURL
  const base = window.location.host
  switch (baseOriginal) {
    case 'quality':
      if (base.includes('.l.')) {
        baseURL = 'http://quality.l.ziroom.com:8080'
      } else if (base.includes('.d.')) {
        baseURL = 'http://quality.d.ziroom.com'
      } else if (base.includes('.t.')) {
        baseURL = 'http://quality.t.ziroom.com'
      }
      break

    case 'godzilla':
      if (base.includes('.l.')) {
        baseURL = 'http://godzilla.l.ziroom.com:8089'
        // baseURL = 'http://godzilla.kt.ziroom.com';
      } else if (base.includes('.d.')) {
        baseURL = 'http://godzilla.d.ziroom.com'
        // baseURL = 'godzilla.uat.ziroom.com';
      } else if (base.includes('.t.')) {
        baseURL = 'http://godzilla.t.ziroom.com'
        // baseURL = 'godzilla.kp.ziroom.com';
      } else if (base.includes('.kt.')) {
        baseURL = 'http://telot.kt.ziroom.com'
      } else if (base.includes('.uat.')) {
        baseURL = 'http://telot.uat.ziroom.com'
      } else if (base.includes('.kp.')) {
        baseURL = 'http://telot.kp.ziroom.com'
      } else if (base.includes('.kq.')) {
        baseURL = 'http://telot.kq.ziroom.com'
      }
      break

    case 'schedule':
      if (base.includes('.l.')) {
        baseURL = 'http://localhost:8088'
      } else if (base.includes('.d.')) {
        baseURL = 'http://10.16.37.162:8088'
      } else if (base.includes('.kp.')) {
        baseURL = 'http://qa-schedule.kp.ziroom.com'
      } else if (base.includes('.kq.')) {
        baseURL = 'http://qa-schedule.kq.ziroom.com'
      } else {
        baseURL = 'http://10.16.34.205:9000'
      }
      break

    case 'ZHome':
      // TODO 区分智能家居后台域名环境
      if (base.includes('.l.')) {
        baseURL = 'http://localhost:8000'
      } else if (base.includes('.d.')) {
        baseURL = 'http://10.216.4.190:8000'
      } else {
        baseURL = 'http://10.16.34.205:8000'
      }
      break
    case 'godzilla_t':
      baseURL = 'http://godzilla.t.ziroom.com'
      break
    case 'qa':
      baseURL = 'http://qaapi.kt.ziroom.com'
      break

    default:
  }

  return baseURL
}
