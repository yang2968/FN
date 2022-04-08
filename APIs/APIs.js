const URL = 'http://15.164.227.45:3000';

export default {
    // 앱 설치 시 토큰 등록 API
    async setJoin(device_token, latitude, longitude) {
        const joinURL = URL + '/users/join'
        try {
            const request = await fetch(joinURL, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "device_token": device_token,
                    "latitude": latitude,
                    "longitude": longitude
                })
            })

            const responseData = await request.json();
            return responseData;
        } catch (error) {
            // 에러 발생
            //const errorData = await error.text();
            return error;
        }
    },
    // 앱 토큰 업데이트 API
    async setDeviceToken(user_index, device_token) {
        const deviceTokenURL = URL + '/users/devicetoken'
        try {
            const request = await fetch(deviceTokenURL, {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user_index": user_index,
                    "device_token": device_token
                })
            })

            const responseData = await request.text();
            return responseData;
        } catch (error) {
            // 에러 발생
            return error;
        }
    },

    // 사용자 position 업데이트 API
    async setPosition(user_index, latitude, longitude) {
        const positionURL = URL + '/users/position'
        try {
            const request = await fetch(positionURL, {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user_index": user_index,
                    "latitude": latitude,
                    "longitude": longitude
                })
            })

            const responseData = await request.text();
            return responseData;
        } catch (error) {
            // 에러 발생
            return error;
        }
    },
    // 서비스 리스트 가져오기
    async getServiceList() {
        const listURL = URL + "/service/service-list";
        try {
            const request = await fetch(listURL, {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json',
                },
            })
            const responseData = await request.json();
            return responseData;
        } catch (error) {
            // 에러 발생
            console.log(error);
            return "error";
        }
    },
     // 서비스 조회
     async serviceInfo(service_index) {
        const serviceInfoURL = URL + "/service/serviceinfo?service_index=" + service_index;
        try {
            const request = await fetch(serviceInfoURL, {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json',
                },
            })
            const responseData = await request.json();
            return responseData;
        } catch (error) {
            // 에러 발생
            console.log(error);
            return "error";
        }
    },
    // 서비스 조회
    async detectInfo(service_index) {
        const detectInfoURL = URL + "/fire/detectinfo?service_index=" + service_index;
        try {
            const request = await fetch(detectInfoURL, {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json',
                },
            })
            const responseData = await request.json();
            return responseData;
        } catch (error) {
            // 에러 발생
            console.log(error);
            return "error";
        }
    },
    async testImageURL(URL) {
        try {
            const imageStatus = await fetch(URL, {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json',
                },
            })
            console.log("응답 값 : ", imageStatus);
            return imageStatus.ok;
        } catch (error) {
            return error;
        }
    }
}