import http from 'k6/http';
import { check } from 'k6';

// This will export to HTML as filename "result.html" AND also stdout using the text summary..
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// export let options = {
//   vus: 11, 
//   duration: '30s', 
// };

export let options = {
  stages: [
  { duration: '5s', target: 2 }, 
  { duration: '10s', target: 3 },
  { duration: '10s', target: 4 }, 
  { duration: '5s', target: 3 }, 
  { duration: '30s', target: 7 },
  { duration: '30s', target: 0 },
  ],

  thresholds: {
   'http_req_duration': ['p(95)<3000'], 
   'http_req_failed': ['rate<0.01'], 
   'http_reqs': ['count <= 6000'], 
 },
};

export default function () {
  const url = 'https://api.mobee.io/api/AuthenticateUser';
  const payload = JSON.stringify({
    email: 'risna@harakirimail.com',
    password: 'Akuntes1',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = http.post(url, payload, params);

  check(response, {
    'is status 200': (r) => r.status === 200,
    'is success': (r) => JSON.parse(r.body).status === 'Success',
  });
}

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }