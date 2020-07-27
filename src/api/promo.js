import http from './http';

const Promo = {
    createPromo: (data) => http.post('http://ec2-35-173-211-25.compute-1.amazonaws.com:8080', '/api/promotions', {data})
}

export default Promo;