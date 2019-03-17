import Fingerprint2 from 'fingerprintjs2'

function getDeviceFingerprint(app) {
  return new Promise(resolve => {
    if (app.$cookies.get('fingerprint')) {
      resolve(app.$cookies.get('fingerprint'))
    } else {
      Fingerprint2.get({}, components => {
        const values = components.map(component => {
          return component.value
        })
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
        resolve(fingerprint)
      })
    }
  })
}

export default ({ app }, inject) => {
  inject('getDeviceFingerprint', () => getDeviceFingerprint(app))
}
