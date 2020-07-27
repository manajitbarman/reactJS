import http from './http';

const Content = {
    createContent: (data) => http.post('http://ec2-54-221-115-44.compute-1.amazonaws.com:8080', '/api/contents/content', {data})
}

export default Content;