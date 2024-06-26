import { useApi } from '@/app/composables/useApi';

const api = useApi()
class jobService {
    async FETCH() {
        return await api({
            url: '/unit',
            method: 'GET',
        })
    }
}

export default new jobService();
