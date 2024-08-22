import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosApiInstance = axios.create();

const AUTH_TKN = "NEB_ACC";

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config: any) => {
    const token = localStorage.getItem(AUTH_TKN);
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

const signOut = async () => {
  const token = localStorage.getItem(AUTH_TKN);
  await axios.post('/api/v1/users/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem(AUTH_TKN);
  //window.location.reload()
};

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    let refreshAuth = true;
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await signOut();
      return axiosApiInstance(originalRequest);
    } else if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshAuth) {
        try {
          const response = await axios.post('/api/v1/users/refresh-token', {});
          const accessToken = response.data.accessToken;
          localStorage.setItem(AUTH_TKN, accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosApiInstance(originalRequest);
        } catch (err: any) {
          if (err?.response.status === 403) {
            refreshAuth = false;
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          await signOut();
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
