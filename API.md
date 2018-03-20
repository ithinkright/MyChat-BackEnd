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
  + success example // JSON.stringify(result) 字符串化的JSON数据
  ```
  {
      "result": "{\"city\":\"广州\",\"updatetime\":\"11:31\",\"wendu\":\"17\",\"fengli\":\"6级\",\"shidu\":\"68%\",\"fengxiang\":\"北风\",\"sunrise_1\":\"06:32\",\"sunset_1\":\"18:38\",\"sunrise_2\":\"\",\"sunset_2\":\"\",\"environment\":{\"aqi\":\"19\",\"pm25\":\"10\",\"suggest\":\"各类人群可自由活动\",\"quality\":\"优\",\"MajorPollutants\":\"\",\"o3\":\"35\",\"co\":\"1\",\"pm10\":\"18\",\"so2\":\"9\",\"no2\":\"25\",\"time\":\"11:00:00\"},\"yesterday\":{\"date_1\":\"19日星期一\",\"high_1\":\"高温 25℃\",\"low_1\":\"低温 14℃\",\"day_1\":{\"type_1\":\"雷阵雨\",\"fx_1\":\"无持续风向\",\"fl_1\":\"<3级\"},\"night_1\":{\"type_1\":\"中到大雨\",\"fx_1\":\"北风\",\"fl_1\":\"3-4级\"}},\"forecast\":{\"weather\":{\"0\":{\"date\":\"20日星期二\",\"high\":\"高温 20℃\",\"low\":\"低温 11℃\",\"day\":{\"type\":\"多云\",\"fengxiang\":\"北风\",\"fengli\":\"4-5级\"},\"night\":{\"type\":\"多云\",\"fengxiang\":\"北风\",\"fengli\":\"3-4级\"}},\"1\":{\"date\":\"21日星期三\",\"high\":\"高温 21℃\",\"low\":\"低温 12℃\",\"day\":{\"type\":\"晴\",\"fengxiang\":\"北风\",\"fengli\":\"3-4级\"},\"night\":{\"type\":\"晴\",\"fengxiang\":\"北风\",\"fengli\":\"3-4级\"}},\"2\":{\"date\":\"22日星期四\",\"high\":\"高温 23℃\",\"low\":\"低温 13℃\",\"day\":{\"type\":\"晴\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"},\"night\":{\"type\":\"晴\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"}},\"3\":{\"date\":\"23日星期五\",\"high\":\"高温 24℃\",\"low\":\"低温 14℃\",\"day\":{\"type\":\"晴\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"},\"night\":{\"type\":\"多云\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"}},\"4\":{\"date\":\"24日星期六\",\"high\":\"高温 25℃\",\"low\":\"低温 15℃\",\"day\":{\"type\":\"多云\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"},\"night\":{\"type\":\"阴\",\"fengxiang\":\"无持续风向\",\"fengli\":\"<3级\"}}}},\"zhishus\":{\"zhishu\":{\"0\":{\"name\":\"晨练指数\",\"value\":\"不宜\",\"detail\":\"风力较大，请尽量避免户外晨练，若坚持晨练注意选择避风的地点，避免迎风锻炼。年老体弱人群适当减少晨练时间。\"},\"1\":{\"name\":\"舒适度\",\"value\":\"舒适\",\"detail\":\"白天不太热也不太冷，风力不大，相信您在这样的天气条件下，应会感到比较清爽和舒适。\"},\"2\":{\"name\":\"穿衣指数\",\"value\":\"较舒适\",\"detail\":\"建议着薄外套、开衫牛仔衫裤等服装。年老体弱者应适当添加衣物，宜着夹克衫、薄毛衣等。\"},\"3\":{\"name\":\"感冒指数\",\"value\":\"极易发\",\"detail\":\"昼夜温差极大，且风力较强，极易发生感冒，请特别注意增减衣服保暖防寒。\"},\"4\":{\"name\":\"晾晒指数\",\"value\":\"适宜\",\"detail\":\"天气不错，适宜晾晒。赶紧把久未见阳光的衣物搬出来吸收一下太阳的味道吧！\"},\"5\":{\"name\":\"旅游指数\",\"value\":\"适宜\",\"detail\":\"天气较好，温度适宜，但风稍微有点大。这样的天气适宜旅游，您可以尽情地享受大自然的无限风光。\"},\"6\":{\"name\":\"紫外线强度\",\"value\":\"弱\",\"detail\":\"紫外线强度较弱，建议出门前涂擦SPF在12-15之间、PA+的防晒护肤品。\"},\"7\":{\"name\":\"洗车指数\",\"value\":\"不宜\",\"detail\":\"不宜洗车，路面积水较多，不宜擦洗汽车。如果执意擦洗，要做好溅上泥水的心理准备。\"},\"8\":{\"name\":\"运动指数\",\"value\":\"较适宜\",\"detail\":\"天气较好，但考虑风力较强且气温较低，推荐您进行室内运动，若在户外运动注意防风并适当增减衣物。\"},\"9\":{\"name\":\"约会指数\",\"value\":\"较不适宜\",\"detail\":\"风力较大，建议尽量不要去室外约会，如果外出，请您挑选避风的地点。\"},\"10\":{\"name\":\"雨伞指数\",\"value\":\"不带伞\",\"detail\":\"天气较好，不会降水，因此您可放心出门，无须带雨伞。\"}}}}",
      "code": 0,
      "message": "ok"    
  }
  ```
  ```
  {
        "result": "输入城市有误,请重新输入",
        "code": 0,
        "message": "ok"
    }
  }
  ```
