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

#### auth
+ POST /api/users/auth
+ request
    ```
    {
        "username": "zhengweimumu@163.com", //required
    }
    ```
+ response
  + success example
    ```
    {
        "authcode": "616476",
        "code": 0,
        "message": "ok"
    }
    ```
  + fail example
    ```
    {
        "code": 2,
        "message": "验证码无法成功发送，请重新输入邮箱"
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

#### upload
+ POST /api/friends/upload
+ request 这里注意一下，因为涉及文件+文本，所以格式为form-data格式，不再是json
    ```
    {
        "friendid": "1", //required
        "friendAvatar": 文件 //required
    }
    ```

+ GET /friendAvatar/friendid.jpg 为头像url

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
    }    
    ```


#### Roles

####Add Role 给数据库添加角色

* POST /api/roles

* request

  ```
  {
  	"name": "张园园"
      "description": "弹吉他"
      "attribute": "6f9335a067141bac576e067c05086717"
      "usercount": "999999"
      // all required
  }
  ```

* response

  * success example

    ```
    {
        "name": "张园园",
        "description": "弹吉他",
        "attribute": "6f9335a067141bac576e067c05086717",
        "usercount": "99999",
        "roleid": "e19e31457ca313062b9834c5e0d760b7",
        "code": 0,
        "message": "ok"
    }
    ```

  * failed example

    ```
    {
        "code": 2,
        "message": "角色已存在"
    }
    ```

#### DELETE Role 删除数据库角色

* DELETE /api/roles

* request

  ```
  {
  	"roleid": "e19e31457ca313062b9834c5e0d760b7"
  	// required
  }
  ```

* response

  * success example

    ```
    {
        "roleid": "e19e31457ca313062b9834c5e0d760b7",
        "code": 0,
        "message": "ok"
    }
    ```

  * failed example

    ```
    {
        "code": 2,
        "message": "角色不存在"
    }
    ```

#### Assign Role 给某个朋友仅限一个角色，超过一个直接覆盖

+ POST /api/friendsroles
+ request
    ```
    {
        "friendid": "1",                                            
        "roleid": "ce8ae9da5b7cd6c3df2929543a9af92d"
        // required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 1,
        "friendname": "1212",
        "gender": "mela",
        "birth": "20170909",
        "roleid": "ce8ae9da5b7cd6c3df2929543a9af92d",
        "attribute": "0c83f57c786a0b4a39efab23731c7ebc",
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

#### Remove Role 给某个朋友移除角色
+ DELETE /api/friendsroles
+ request
    ```
    {
        "friendid": "1",                                            
        "roleid": "0c83f57c786a0b4a39efab23731c7ebc"
        // all required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 1,
        "friendname": "1212",
        "gender": "mela",
        "birth": "20170909",
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

#### Attributes

#### Add Attribute 给数据库添加属性

* POST /api/attributes

* request

  ```
  {
  	"name": "打代码",
  	"description": "一夜千行",
   	"usercount": "99999"
    	// all required
  }
  ```

* response

  * success example

    ```
    {
        "name": "打代码",
        "description": "一夜千行",
        "usercount": "99999",
        "attributeid": "6f9335a067141bac576e067c05086717",
        "code": 0,
        "message": "ok"
    }
    ```

  * failed example

    ```
    {
        "code": 2,
        "message": "该属性已存在"
    }
    ```

#### Delete Attributes 删除数据库中的属性

* DELETE /api/attributes

* request

  ```
  {
  	"attributeid": "6f9335a067141bac576e067c05086717"
  	// all required
  }
  ```

* response

  * success example

    ```
    {
        "attributeid": "6f9335a067141bac576e067c05086717",
        "name": "打代码",
        "description": "一夜千行",
        "usercount": "99999",
        "code": 0,
        "message": "ok"
    }
    ```

  * failed example

    ```
    {
        "code": 2,
        "message": "该属性不存在"
    }
    ```

#### Add Attribute to friends 给好友添加属性

+ POST /api/friendsattr
+ request
    ```
    {
        "friendid": "1",                                            
        "attributeid": "0c83f57c786a0b4a39efab23731c7ebc"   
        // all required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 1,
        "friendname": "1212",
        "gender": "mela",
        "birth": "20170909",
        "roleid": null,
        "attribute": "0c83f57c786a0b4a39efab23731c7ebc",
        "code": 0,
        "message": "ok"
    }
    ```
    + failed example
    ```
    {
        "code": 2,
        "message": "找不到此属性"
    }
    ```

#### Delete attributes 给某个朋友删除属性
+ DELETE /api/freindsattr
+ request
    ```
    {
        "friendid": "1",                                                  
        "attributeid": "0c83f57c786a0b4a39efab23731c7ebc"     
        // all required
    }
    ```
+ response
  + success example
    ```
    {
        "friendid": 1,
        "friendname": "1212",
        "gender": "mela",
        "birth": "20170909",
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
        "message": "试图从空属性值中删除属性"
    }
    ```

#### Weather
+ GET /api/weather
+ request
  ```
  {
      "place": "广州"
      // all required
  }
  ```
+ response
  + success example
  ```
  {
      "result": "城市: 广州\n温度: 13\n风力: 3级\n湿度: 63%\n风向: 北风\n日升时间: 06:30\n日落时间: 18:39\n空气质量：优\n出行建议：各类人群可自由活动\n未来六天预报：\n22日星期四\t高温 22℃\t低温 12℃\t白天：晴\t晚上：多云\n23日星期五\t高温 23℃\t低温 14℃\t白天：多云\t晚上：阴\n24日星期六\t高温 25℃\t低温 17℃\t白天：阴\t晚上：阴\n25日星期天\t高温 25℃\t低温 17℃\t白天：阵雨\t晚上：多云\n26日星期一\t高温 26℃\t低温 17℃\t白天：多云\t晚上：多云\n",
      "code": 0,
      "message": "ok"    
  }
  ```
  + failed example
  ```
  {
        "result": "输入城市有误,请重新输入",
        "code": 0,
        "message": "ok"
    }
  }
  ```

#### Verify Code // 邮箱验证码
+ GET /api/verify
+ request
  ```
  {
      "email": "1042651820@qq.com"
      // all required
  }
  ```
+ response
  + success example
  ```
  {
      "result": "03cf87174debaccd689c90c34577b82f",  // md5后的值
      "code": 0,
      "message": "ok"
  }
  ```
