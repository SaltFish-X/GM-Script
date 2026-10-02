package main

import (
	"bytes"
	"io"
	"log/slog"
	"net/http"
	"os"
	"reflect"
	"strings"
	"time"

	"github.com/go-co-op/gocron/v2"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

type Config struct {
	Port      string
	DataDir   string
	UpdateUrl string
}

var cfg Config

// 验证器去读取 json 标签
func InitValidator() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			// 读取 json 标签定义的名字
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			// 如果 json 标签是 "-"（代表忽略），则不使用它
			if name == "-" {
				return ""
			}
			return name
		})
	}
}

// GinSlogLogger 自定义的 Gin 中间件，用于将请求日志桥接到 slog
func GinSlogLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 记录请求开始时间
		startTime := time.Now()

		// Get 请求参数
		queryParams := c.Request.URL.RawQuery

		// POST/PUT 的 JSON Body 参数
		var bodyParams string
		if c.Request.Method == http.MethodPost || c.Request.Method == http.MethodPut {
			// 仅在前端声明了是 JSON 传输时才去读取
			if c.ContentType() == "application/json" && c.Request.Body != nil {
				// 读取原始 Body 字节
				bodyBytes, err := io.ReadAll(c.Request.Body)
				if err == nil {
					bodyParams = string(bodyBytes)

					// 🎯 核心魔法：读取完后，必须把 Body 重新塞回去！
					// 否则后面的 c.ShouldBindJSON(&q) 就会因为读不到数据而报错
					c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
				}
			}
		}

		// 挂起，先让后面的实际业务逻辑/控制器（Handler）执行
		c.Next()

		// 业务执行完毕后，计算总耗时
		latency := time.Since(startTime)

		// 收集本次请求的核心元数据
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method
		path := c.Request.URL.Path

		logAttrs := []any{
			"status", statusCode,
			"method", method,
			"path", path,
			"ip", clientIP,
			"latency", latency.String(),
		}
		if queryParams != "" {
			logAttrs = append(logAttrs, "query_args", queryParams)
		}
		if bodyParams != "" {
			// 如果 Body 太长，长度截断逻辑，防止日志文件瞬间爆满
			if len(bodyParams) > 1000 {
				bodyParams = bodyParams[:1000] + "...(truncated)"
			}
			logAttrs = append(logAttrs, "body_args", bodyParams)
		}
		slog.Info("HTTP请求", logAttrs...)
	}
}

// Swagger 路由
var setExtRoutes func(r *gin.Engine)

// 定时任务
func initCron(db *DB) {

	s, err := gocron.NewScheduler(gocron.WithLocation(time.Local))
	if err != nil {
		slog.Error("Scheduler初始化失败", "err", err)
	}
	// 定义定时任务：每天在固定时间（凌晨 02:00）执行
	job, err := s.NewJob(
		gocron.DailyJob(
			1, // 每 1 天
			gocron.NewAtTimes(
				gocron.NewAtTime(2, 14, 0), // 每天凌晨 02:00:00 执行
			),
		),
		gocron.NewTask(
			func() {
				maxRetries := 5
				retryInterval := 1 * time.Minute // 每次重试等待 1 分钟
				for attempt := 1; attempt <= maxRetries; attempt++ {
					err := db.checkOnlineUpdate(cfg.UpdateUrl)
					if err == nil {
						slog.Info("定时任务执行成功")
						return
					}

					slog.Warn("定时任务执行失败",
						"当前次数", attempt,
						"延迟时间", retryInterval,
						"最大重试次数", maxRetries,
						"err", err,
					)

					// 如果已经达到了最大重试次数，不再等待，直接报错结束
					if attempt > maxRetries {
						slog.Error("定时任务达到最大重试次数，彻底失败")
						return
					}
					time.Sleep(retryInterval)
				}
			},
		),
		gocron.WithSingletonMode(gocron.LimitModeReschedule),
	)
	if err != nil {
		slog.Error("定时任务创建失败", "err", err)
	}

	// 异步启动调度器（不阻塞主线程）
	s.Start()

	nextRun, nextRunErr := job.NextRun()
	if nextRunErr != nil {
		slog.Warn("无法获取下一次运行时间", "err", nextRunErr)
	} else {
		slog.Info("定时任务成功启动", "下一次运行时间", nextRun)
	}

}

// @title           勋章服务API
// @version         1.0
func main() {

	initLogger()

	loadConfig()
	medalData, _ := getJsonData(medalRaw)
	db := NewDB(medalData)

	watchFiles(db)

	if cfg.UpdateUrl != "" {
		initCron(db)
	}

	InitValidator()

	gin.SetMode(gin.ReleaseMode)

	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(GinSlogLogger())
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")

		c.Next()
	})

	setRoutes(r, db)
	if setExtRoutes != nil {
		setExtRoutes(r)
	}

	addr := ":" + cfg.Port

	slog.Info("====================================")
	slog.Info("🚀 服务启动")
	slog.Info("====================================")

	if err := r.Run(addr); err != nil {
		slog.Error("服务启动失败", "err", err)
		os.Exit(1)
	}
}
