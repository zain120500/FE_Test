import axios from 'axios';
const API = process.env.BASE_URL

class authService{
    async LOGIN(username: string , password: string ){
        return await axios.post(API+ 'users/login', {
            username,
            password
        });
    }
}

export default new authService();
