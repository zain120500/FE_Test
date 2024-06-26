import axios from 'axios'
import Cookies from 'js-cookie';

const API = process.env.BASE_URL

let token: any = Cookies.get('token')

export const useApi = () => {
    const baseURL = API 
    const axiosClient = axios.create({
        baseURL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })

    axiosClient.interceptors.response.use(function (response): any {
        return response;
    }, function (error) {
        const r = error.response.status
        if (error.config.url !== 'login') {
            if (r === 401 ) {
                token = null
                Cookies.remove('token')
                window.location.reload()
            }
        }
        return Promise.reject(error);
    })
    return axiosClient
}