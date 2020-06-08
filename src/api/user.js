import http from './http';

const User = {
    profile: (id) => http.get(`/api/registration/users/${id}`),
    updateProfile: (data) => http.post('/api/registration/users', {data})
}

export default User;