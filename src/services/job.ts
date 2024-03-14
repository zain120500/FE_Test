import axios from 'axios';
const API = process.env.BASE_URL
import { isNullOrEmpty } from "@/utils/helpers";

class jobService {
    async FETCH() {
        return await axios.get(API + 'job');
    }
    async GET(page: any , desc? :any, location?: any, fulltime?: any) {
        let params: any = {
        }
        if (page != 1) {
            params.page = page;
        }
        if (!isNullOrEmpty(desc)) {
            params.desc = desc;
        }
        if (!isNullOrEmpty(location)) {
            params.location = location;
        }
        if (!isNullOrEmpty(fulltime)) {
            params.fulltime = fulltime;
        }
    
        return await axios.get(API + 'job', {
            params: params
        });
    }

    async DETAIL(id: any) {
        return await axios.get(API + 'job/' + id);
    }
}

export default new jobService();
