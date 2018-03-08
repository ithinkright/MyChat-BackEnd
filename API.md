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
