export default ({ route, app, redirect }) => {
  // console.log('route.params.channel:', route.params.channel)
  // console.log('userName:', app.$cookies.get('userName'))
  if (!route.params.channel) {
    return redirect('/')
  }
  if (!app.$cookies.get('userName')) {
    return redirect('/')
  }
  if (!app.$cookies.get('fingerprint')) {
    return redirect('/')
  }
}
