package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
)

var (
	cacheLock sync.RWMutex
)

var (
	reloadTimer  *time.Timer
	reloadMu     sync.Mutex
	changedFiles = make(map[string]bool)
)

var watchedFiles = map[string]struct{}{
	medalRaw: {},
}

func isWatchedFile(path string) bool {
	_, ok := watchedFiles[filepath.Base(path)]
	return ok
}

func getJsonData(jsonFile string) ([]byte, error) {
	fPath := filepath.Join(cfg.DataDir, jsonFile)
	content, err := os.ReadFile(fPath)
	if err != nil {
		return nil, fmt.Errorf("%s 文件读取错误: %w", fPath, err)
	}
	return content, nil
}

func reloadCacheSelective(db *DB) {
	reloadMu.Lock()
	// 将变动的文件名提出来，然后清空待办列表，以便腾出锁
	todoFiles := changedFiles
	changedFiles = make(map[string]bool)
	reloadMu.Unlock()

	// 如果没有文件变动，直接返回
	if len(todoFiles) == 0 {
		return
	}

	// 加缓存锁，开始局部更新
	cacheLock.Lock()
	defer cacheLock.Unlock()

	// 根据变化，精准加载变动的文件
	for filePath := range todoFiles {
		baseName := filepath.Base(filePath)

		switch baseName {
		case medalRaw:
			medalData, err := getJsonData(medalRaw)
			if err != nil {
				log.Printf("❌ 读取文件失败: %v，本次不更新", err)
				return
			}
			db.setData(medalData)
			log.Printf("✨ 热重载成功: %s", medalRaw)
		}
	}
}

// 防止短时间内文件多次改变触发重复解析
func scheduleReload(fileName string, db *DB) {
	reloadMu.Lock()
	defer reloadMu.Unlock()

	changedFiles[fileName] = true

	//防抖：如果已有定时器，先停掉
	if reloadTimer != nil {
		reloadTimer.Stop()
	}

	// 重新拉起定时器
	reloadTimer = time.AfterFunc(
		1000*time.Millisecond,
		func() {
			// 定时器触发时，去执行局部重载
			reloadCacheSelective(db)
		},
	)
}

// 监控指定文件夹
func watchFiles(db *DB) {

	watcher, err := fsnotify.NewWatcher()

	if err != nil {
		log.Fatalf("监控 watcher 创建失败: %v", err)
	}

	err = watcher.Add(cfg.DataDir)

	if err != nil {
		log.Fatalf("监控目录失败: %v", err)
	}

	slog.Info("监控目录", "init", cfg.DataDir)

	go func() {

		defer watcher.Close()

		for {
			select {
			case event, ok := <-watcher.Events:

				if !ok {
					return
				}

				if !isWatchedFile(event.Name) {
					continue
				}

				if event.Op&(fsnotify.Write|fsnotify.Create|fsnotify.Remove|fsnotify.Rename) == 0 {
					continue
				}
				slog.Info("监控目录", "事件", event.Op.String(), "文件", filepath.Base(event.Name))
				scheduleReload(event.Name, db)

			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				slog.Info("监控目录", "err", err)

			}
		}
	}()
}

func parseDateToUnix(dateStr string) int64 {
	// Go 的时间格式化模板：2006对应年，1对应月，2对应日
	// "2006-1-2" 可以完美自动兼容 "2023-5-16" 和 "2023-05-16"
	layout := "2006-1-2"

	// 使用本地时区解析，避免时区转换导致日期多一天或少一天
	t, err := time.ParseInLocation(layout, dateStr, time.Local)
	if err != nil {
		return 0 // 解析失败的数据，给个默认戳（或者记录日志）
	}
	return t.Unix()
}

// SwaggerResponseSuccess 专门用于 Swagger 文档渲染的成功结构
type SwaggerResponseSuccess struct {
	Code  int    `json:"code" example:"200"`    // 业务状态码
	Msg   string `json:"msg" example:"success"` // 提示信息
	Total int    `json:"total" example:"10"`    // 数据总数
	Data  any    `json:"data"`                  // 核心数据
}

// SwaggerResponseError 专门用于 Swagger 文档渲染的失败结构
type SwaggerResponseError struct {
	Code int    `json:"code" example:"400"`  // 错误状态码
	Msg  string `json:"msg" example:"error"` // 错误提示
	Data any    `json:"data"`                // 错误详情
}

// Success 成功响应
func ResponseSuccess(c *gin.Context, data any, total int) {
	c.JSON(http.StatusOK, gin.H{
		"code":  200,
		"msg":   "success",
		"data":  data,
		"total": total,
	})
}

// Error 失败响应
func ResponseError(c *gin.Context, code int, errData any) {
	c.JSON(http.StatusOK, gin.H{
		"code": code,
		"msg":  "error",
		"data": errData,
	})
}

// 结构体的所有指针字段是否都未空
func IsAllFieldsEmpty(obj any) bool {
	v := reflect.ValueOf(obj)
	// 如果传入的是指针，先获取它指向的结构体
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)

		// 针对 *string 类型的处理
		if field.Kind() == reflect.Ptr && !field.IsNil() {
			// 指针不为 nil，再看它指向的字符串是不是空字串
			if str, ok := field.Elem().Interface().(string); ok && str != "" {
				return false
			}
		}
	}
	return true
}

// 入参清洗以及空判断
func CleanAndCheckFieldsEmpty(obj any) bool {
	v := reflect.ValueOf(obj)

	// 传入指针，可以修改内部的值
	if v.Kind() != reflect.Ptr || v.IsNil() {
		return true
	}

	// 获取指针指向的实际结构体
	v = v.Elem()

	allEmpty := true

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)

		// 只处理 *string 类型的字段
		if field.Kind() == reflect.Ptr && field.Type().Elem().Kind() == reflect.String {
			// 如果指针不为 nil
			if !field.IsNil() {
				// 获取当前指针指向的字符串值，并去除首尾空格
				strVal := field.Elem().String()
				trimmed := strings.TrimSpace(strVal)

				if trimmed == "" {
					// 如果是空字串，将该字段指针重置为 nil
					field.Set(reflect.Zero(field.Type()))
				} else {
					// 如果不为空，把去除空格后的干净字符串写回去
					field.Elem().SetString(trimmed)
					allEmpty = false // 只要有一个字段有实质内容，就不是全空
				}
			}
		}
	}

	return allEmpty
}
func validateURL(rawURL string) (string, error) {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return "", nil
	}

	// 宽容处理：如果用户没写 http:// 或 https://，自动补全 https://
	if !strings.HasPrefix(strings.ToLower(rawURL), "http://") &&
		!strings.HasPrefix(strings.ToLower(rawURL), "https://") {
		rawURL = "https://" + rawURL
	}

	// 使用 ParseRequestURI 进行严格解析
	parsedURL, err := url.ParseRequestURI(rawURL)
	if err != nil {
		return "", fmt.Errorf("URL 格式解析失败: %w", err)
	}

	// 3. 校验 Host 不能为空
	if parsedURL.Host == "" {
		return "", errors.New("URL 域名/主机名(Host) 不能为空")
	}

	// 返回修复/校验通过后的完整规范 URL
	return rawURL, nil
}

func anyToInt(v any) (int, bool) {
	switch n := v.(type) {
	case int:
		return n, true
	case int64:
		return int(n), true
	case float64:
		return int(n), true
	case json.Number:
		i, err := n.Int64()
		if err != nil {
			return 0, false
		}
		return int(i), true
	default:
		return 0, false
	}
}
