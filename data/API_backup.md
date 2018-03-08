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
#### Add friend
+ POST /api/friends
+ request
    ```
    {
	    "userid": "1",              // required
	    "friendname": "weilinmumu"  // required
      "gender": "male"            // required
      "birth": "20170908" (暂时没做规定，后面再商量格式)   // required
      "roleid": "1"               // option
    }
    ```
+ response
  + success example
    ```
    {
        "userid": "1",
        "friendname": "weilinmumu",
        "gender": "male,
        "birth": "20170908",
        "friendid": 13,  (自增长)
        "code": 0,
        "message": "ok"
    }
    ```
    + failed example
    ```
    {
        "code": 2,
        "message": "该朋友不存在"
    }
    ```

    ```
    {
        "code": 2,
        "message": "该角色id指向的角色不存在"
    }
    ```
#### Delete friend
+ DELETE /api/friends
+ request
    ```
    {
      "friendid": "1",              // required
    }
    ```
+ response
  + success example
    ```
    {
        "mes": "DELETE SUCCESSFULLY",
        "code": 0,
        "message": "ok"
    }
    ```  
    + failed example
    ```
    {
        "code": 2,
        "message": "该朋友不存在"
    }
    ```

#### Roles 给指定朋友添加角色 这一块的数据库增删还未做好
#### Assign Role 仅限一个角色
+ Post /api/roles
+ request
    ```
    {
      "friendid": "8",              // required
      "roleid": "1"                 // required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 8,
        "friendname": "aa",
        "gender": "female",
        "birth": "female",   (有错误尚未修改)
        "roleid": "2",
        "attribute": "abcd", (有错误尚未修改)
        "code": 0,
        "message": "ok"
    }
    ```  
    + failed example
    ```
    {
        "code": 2,
        "message": "找不到此角色"
    }
    ```

#### Remove Role
+ DELETE /api/roles
+ request
    ```
    {
      "friendid": "1",              // required
      "roleid": "2"                 // required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 8,
        "friendname": "aa",
        "gender": "female",
        "birth": "female",
        "roleid": null,
        "attribute": "",
        "code": 0,
        "message": "ok"
    }
    ```  
  + failed example
    ```
    {
        "code": 2,
        "message": "找不到此朋友"
    }
    ```  

#### Attributes 给指定朋友添加属性
#### Add Attribute
+ Post /api/attributes
+ request
    ```
    {
      "friendid": "8",              // required
      "attributeid": "2"                 // required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 8,
        "friendname": "aa",
        "gender": "female",
        "birth": "female",   (有错误尚未修改)
        "roleid": "2",
        "attribute": "abcd", (有错误尚未修改)
        "code": 0,
        "message": "ok"
    }
    ```  
    + failed example
    ```
    {
        "code": 2,
        "message": "找不到此角色"
    }
    ```

#### Remove Role
+ DELETE /api/roles
+ request
    ```
    {
      "friendid": "1",              // required
      "attributeid": "2"                 // required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 8,
        "friendname": "aa",
        "gender": "female",
        "birth": "female",
        "roleid": null,
        "attribute": "",
        "code": 0,
        "message": "ok"
    }
    ```  
  + failed example
    ```
    {
        "code": 2,
        "message": "找不到此朋友"
    }
    ```  
