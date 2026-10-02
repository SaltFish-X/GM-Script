# 说明
基于 Go 开发，轻量级的勋章查询服务

**特点**
- 可以获取新版、旧版2种格式的勋章数据
- 可以获取全量数据
- 可以输入查询参数，获取指定条件的数据
- 程序运行后，可以通过改变JSON文件手动获得数据更新，或者通过网络地址自动获取数据更新

# 架构
语言：Golang
框架：Gin
文件监听：fsnotify
日志轮转：lumberjack.v2
接口文档：swagger
压缩二进制工具：upx

# 手动编译
## 编译为二进制可执行文件
```bash
# 克隆项目
git clone https://github.com/xxxx/xx.git
# 进入项目文件夹
cd go-medal-server
# 下载依赖
go mod download
# 编译为二进制文件（不带有swagger）
go build -p 4 -ldflags "-s -w" -o "z_prod.exe"

# （或者）编译为二进制文件（带有swagger）
# 1. 在包含main.go文件的项目根目录运行swag init。这将会解析注释并生成需要的文件（docs文件夹和docs/docs.go）。
swag init
# 2. 编译
go build -tags=dev -p 4 -ldflags "-s -w" -o "z_dev.exe"
```

## 编译打包为docker镜像

```bash
# 生成docker镜像
docker build  -f docker/Dockerfile -t gm_medal:1.0 .

# 运行（volumes、app_dir、app_port、update_url需要自行修改）
cd docker
docker compose up -d
```

# 项目结构
```bash
go-medal-server        # 项目
├─ json/               # 勋章数据JSON，默认为当前路径下，可通过-dir启动参数自定义配置
├─ config.go           # 启动配置
├─ logger.go           # 日志初始化，默认保存到server.log
├─ logger_docker.go    # 日志初始化，docker时候只输出到stdout，不会保存到server.log
├─ main.go             # 项目入口
├─ router.go           # 路由
├─ handler.go          # API控制
├─ service.go          # 服务层
├─ db.go               # 数据层，加载勋章数据
├─ model.go            # 数据结构体
├─ util.go             # 工具函数
├─ server.log          # 程序日志
└─ z_*.exe             # 编译的二进制文件（win）
```

# 运行使用
## 启动
window
```bash
双击 z_prod.exe
```
linux
```bash
# 授予执行权限
chomd +x z_prod
# 启动
nohup ./z_prod > /dev/null 2>&1 &
```

## 启动参数
```bash
#查看启动参数
./z_prod -h
# 输出
Usage of z_dev.exe:
  -dir string
        数据加载目录，可通过app_dir环境变量设置 (default "./json")
  -port string
        服务端口，可通过app_port环境变量设置 (default "8080")
  -url string
        网络URL定时更新data数据，可通过update_url环境变量设置

# 使用举例
./z_prod -dir ./json2 -port 8081 -url www.a.com/sss.json
```

# API 接口
部署启动dev程序
访问 `http://127.0.0.1:8080/swagger` 查看接口文档

## 获取新格式数据

|请求方法|请求地址|
| --- | --- |
|GET|/medal|
|GET|/medal/|
|POST|/medal|

|请求参数|类型|必填|说明|
| --- | --- | --- | --- |
|type|string|否|勋章类型|
|no|string|否|勋章编号|
|url_tid|string|否|勋章帖子Tid|
|name|strin|否|勋章名称|
|date|strin|否|勋章帖子日期|
|startdate|strin|否|勋章帖子日期查询起始时间|
|enddate| int |否|勋章帖子日期查询结束时间|
|buy_limit|strin|否|购买限制|
|backstory|strin|否|背景故事|
|duration|strin|否|持续时间|

> 不传name参数时候，默认返回所有数据
> GET 请求参数在URL中，键值对格式
> POST 请求参数才请求MSG中，JSON格式
> 此接口的所有参数都是模糊查询，没有精准查询

## 获取旧格式数据
旧格式数据的文本数据和图片数据不在一个结构，需要访问2个接口分别请求

### 获取旧格式数据（文本）

|请求方法|请求地址|
| --- | --- |
|GET|/info|
|GET|/info/|
|POST|/info|

|请求参数|类型|必填|说明|
| --- | --- | --- | --- |
|name|string|否|勋章名称|
|query| int |否|查询类型，1为模糊匹配，否则为精准查询|

> 不传name参数时候，默认返回所有数据
> GET 请求参数在URL中，键值对格式
> POST 请求参数才请求MSG中，JSON格式

### 获取旧格式数据（图片）

|请求方法|请求地址|
| --- | --- |
|GET|/imgs|
|GET|/imgs/|
|POST|/imgs|

|请求参数|类型|必填|说明|
| --- | --- | --- | --- |
|name|string|否|勋章名称|
|query| int |否|查询类型，1为模糊匹配，否则为精准查询|

> 不传name参数时候，默认返回所有数据
> GET 请求参数在URL中，键值对格式
> POST 请求参数才请求MSG中，JSON格式