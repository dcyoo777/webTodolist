import axios from 'axios';

const hostUrl = 'http://43.200.220.233:15749'

let serverInstance = axios.create({
  baseURL: hostUrl,
  timeout: 10000,
});

const serverRequestInterceptor = (apiKey: string) => {
  serverInstance.defaults.headers['api-key'] = apiKey
};

const changeServerDomain = (baseURL: string) => {
  serverInstance = axios.create({
    baseURL,
    timeout: 10000,
  });
}

export {
  serverInstance as todolistServer,
  serverRequestInterceptor as setTodolistServerInterceptors_request,
  changeServerDomain, 
  hostUrl
};
