import http from './http';

const User = {
    profile: (id) => http.get(`/api/registration/users/${id}`),
    updateProfile: (data) => http.post('/api/registration/users', {data}),
    createUser: (data) =>  http.post('http://ec2-3-95-152-173.compute-1.amazonaws.com:8080', '/api/registration/users', {data}),
    createService: (data) => http.post('http://ec2-54-221-115-44.compute-1.amazonaws.com:8080', '/api/contents/service', {data})
}

export default User;