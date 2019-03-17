import axios from 'axios'

export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  const axiosClient = axios.create({
    baseURL: process.env.baseUrl,
    browserBaseURL: ''
  })

  axiosClient.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
  })

  axiosClient.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
  })
  app.axios = axiosClient
}
