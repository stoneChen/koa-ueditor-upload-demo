# koa@2.x + ueditor@1.4.3.3 上传功能演示


### 如何运行
克隆本工程后:
* npm i
* 复制工程根目录下的`upyun.config.example.js`为`upyun.config.js`,并将里面的`bucket`,`oprator`,`password`三个字段补充为你的信息。
* `npm start`

### 注意事项
* 本人实际项目中以vue+webpack为基础，这里为了排除干扰，将前端部分简化至最少
* 本工程仅演示上传图片功能，其他功能忽略- -
* koa-body必须显示声明为2.0.0版本
* chrome@50左右版本开始，对image/*类型的file元素，弹出文件选择器将会非常慢，于是将ueditor的源码改了一下下，使得文件选择器更快弹出，`server/middlewares/ueditor/index.js`中有注释说明



