import { useApi } from '@/app/composables/useApi';

const api = useApi()
class ruasService {
    async FETCH(size: number, page: number, showActive: boolean) {
        let query = `?per_page=${size}&page=${page}`
        if (showActive) {
            query += '&show=active_only'
        }
        return await api({
            url: '/ruas' + query,
            method: 'GET',
        })
    }

    async POST_RUAS(payload:any) {
        return await api({
            method: 'POST',
            url: `ruas`,
            data: payload,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }
  
    async PUT_RUAS(id:string,payload:any) {
        return await api({
            method: 'POST',
            url: `ruas/${id}`,
            data: payload,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    async DELETE_RUAS(id:string) {
        return await api({
            method: 'DELETE',
            url: `ruas/${id}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }
}

export default new ruasService();
