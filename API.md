# The API Document for MyChat
#### Notice
+ response status code:
  + 200: ok
  + 400: incorrect request
  + 500: Internal Server Error (bug)
+ response data:
  + {code: "错误代码(包括myChat自定义,前段用途少)", message: "错误信息或者ok(前端可用)"}

#### User
#### signup
+ POST /api/users/signup
+ request
    ```
    {
	    "username": "weimumu333", //required
	    "password": "weimumu333" //required 请做一次md5再发过来
    }
    ```
+ response
  + success example
    ```
    {
        "username": "weimumu888",
        "password": "weimumu333",
        "userid": "a9eb584794e9085e4af0636d80141c43",
        "code": 0,
        "message": "ok"
    }
    ```
  + fail example
    ```
    {
        "code": 2,
        "message": "用户名已存在"
    }
    ```

#### signin
+ POST /api/users/signin
+ request
    ```
    {
	    "username": "weimumu333", //required
	    "password": "weimumu333" //required 请做一次md5再发过来
    }
    ```
+ response
  + success example
    ```
    {
        "username": "weimumu888",
        "password": "weimumu333",
        "userid": "a9eb584794e9085e4af0636d80141c43",
        "code": 0,
        "message": "ok"
    }
    ```
  + fail example
    ```
    {
        "code": 2,
        "message": "用户名不存在 or 密码错误"
    }
    ```  

#### upload
+ POST /api/users/upload
+ request 这里注意一下，因为涉及文件+文本，所以格式为form-data格式，不再是json
    ```
    {
	    "userid": "32位的userid", //required
	    "avatar": 文件 //required
    }
    ```

+ GET /avatar/userid.jpg 为头像url

#### Friends
#### GET Friends
+ GET /api/friends
+ request
    ```
    {
      "userid": "XXXXXXXXXXX",   // required  (md5的username)
      "mes": "1*3*2"  // required
    }
    ```
+ response
    ```
    {
        "data": [
            [
                {
                    "friendid": 5,
                    "friendname": "computer",
                    "gender": "male",
                    "birth": "20170908",
                    "roleid": "df53ca268240ca76670c8566ee54568a",
                    "attribute": "77e73f3a185e16d1f08ca5e057710b9d"
                }
            ],
            [
                {
                    "friendid": 6,
                    "friendname": "translator",
                    "gender": "female",
                    "birth": "20090908",
                    "roleid": "607f2f3099f2a347b327caa70e0be4b2",
                    "attribute": "fc46e26a907870744758b76166150f62"
                }
            ],
            [
                {
                    "friendid": 7,
                    "friendname": "Email",
                    "gender": "female",
                    "birth": "20030101",
                    "roleid": "ce8ae9da5b7cd6c3df2929543a9af92d",
                    "attribute": "0c83f57c786a0b4a39efab23731c7ebc"
                }
            ],
            [
                {
                    "friendid": 8,
                    "friendname": "Secure",
                    "gender": "female",
                    "birth": "20180308",
                    "roleid": "1c0b76fce779f78f51be339c49445c49",
                    "attribute": "1c0b76fce779f78f51be339c49445c49"
                }
            ]
        ],
        "code": 0,
        "message": "ok"
    }
    ```

#### Deal Message
+ POST /api/dealMessage
+ request
    ```
    {
	    "friendid": "1",              // required
	    "mes": "1*3*2"  // required
    }
    ```
+ response
  + success example
    ```
    {
        "result": 6,
        "code": 0,
        "message": "ok"
    }
    ```
    + failed example
    ```
    {
        "result": "更多功能敬请期待！",
        "code": 0,
        "message": "ok"
    }    ```
