const request = require('request')

const base_url = "http://localhost:3000/"

describe('login', () => {
    let urlloginoptions = {
        url: base_url + 'login',
        body: {
            "username": "Dummyuser",
            "password": "1234"
        }
    }
    it('should return 201 created', (done) => {
        request.post(urlloginoptions, (err, res) => {
            console.log(res)
            expect(res.statusCode).toEqual(201)
            done()
        })

    })

    it('should contain access_token', (done) => {
        request.post(urlloginoptions, (err, res) => {
            console.log(res)
            expect(res.body).toContain('access_token')
            done()
        })
    })
})

describe('getUsers', () => {
    let urloptions = {
        url: base_url + 'admin',
        headers: {
            'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkR1bW15dXNlciIsInJvbGUiOiJhZG1pbiIsImludGVyZmFjZSI6e30sImlhdCI6MTY3MTg5MDY3NywiZXhwIjoxNjcxOTM4Njc3fQ.I8oSt7jSLuVFxbdxqy_w67x8YWWrNtl0r2s2Eo41az8'
        }
    }

    it('should return 200 ok', (done) => {
        request.get(urloptions, (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('should return user data', (done) => {
        request.get(urloptions, (err, res) => {
            expect(res.body.length).toBeGreaterThan(0)
            done()
        })
    })
})


// const serverlogin = async()=>{

//     urloptions = {
//         url : base_url+'login',
//         body: {"username": "Dummyuser",
//         "password": "1234"}
//     }

//     request.post(urloptions,(err,res)=>{
//         return res.body.access_token
//     })
// }