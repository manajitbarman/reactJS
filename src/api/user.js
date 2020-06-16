import http from './http';

const User = {
    profile: (id) => http.get(`/api/registration/users/${id}`),
    updateProfile: (data) => http.post('/api/registration/users', {data}),
    createUser: (data) =>  http.post('/api/registration/users', {data}),
    createService: (data) => http.post('/api/contents/service')
}

export default User;