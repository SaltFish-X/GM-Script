package main

import (
	"flag"
	"log"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
)

const medalRaw = "medal.json"

func getEnv(sysEnv []string, targetKey, defaultValue string) string {

	targetKeyLower := strings.ToLower(targetKey)

	// 获取系统当前所有的环境变量 ["PATH=/usr/bin", "APP_MODE= 8080 "]
	for _, env := range sysEnv {
		// 分割出 KEY 和 VALUE
		pair := strings.SplitN(env, "=", 2)
		if len(pair) < 2 {
			continue
		}

		// 将当前遍历到的环境变量 Key 转为小写
		currentKeyLower := strings.ToLower(pair[0])

		if currentKeyLower == targetKeyLower {

			return strings.TrimSpace(pair[1])
		}
	}

	return defaultValue
}
func loadConfig() {

	sysEnv := os.Environ()

	port := flag.String("port", getEnv(sysEnv, "app_port", "8080"), "服务端口，可通过app_port环境变量设置")
	dataDir := flag.String("dir", getEnv(sysEnv, "app_dir", "./json"), "数据加载目录，可通过app_dir环境变量设置")
	updateUrl := flag.String("url", getEnv(sysEnv, "update_url", ""), "网络URL定时更新data数据，可通过update_url环境变量设置")

	flag.Parse()

	absDir, err := filepath.Abs(*dataDir)
	if err != nil {
		slog.Error("计算绝对路径失败", "err", err)
		log.Fatalf("错误: %v", err)
	}

	stat, err := os.Stat(absDir)
	if err != nil {
		if os.IsNotExist(err) {

			slog.Info("数据目录不存在，正在自动创建...", "path", absDir)

			if mkErr := os.MkdirAll(absDir, os.ModePerm); mkErr != nil {
				slog.Error("自动创建目录失败", "path", absDir, "err", mkErr)
				log.Fatalf("错误: 无法创建目录")
			}
		} else {
			slog.Error("读取目录状态失败", "path", absDir, "err", err)
			log.Fatalf("错误: 无法访问目标路径")
		}
	} else {
		if !stat.IsDir() {
			slog.Error("配置冲突：传入的参数不是目录", "path", absDir)
			log.Fatalf("错误: 启动失败")
		}
	}

	finalURL, err := validateURL(*updateUrl)
	if err != nil {
		log.Fatalf("错误: 启动失败，url参数错误：%v", *updateUrl)
	}

	cfg = Config{
		Port:      *port,
		DataDir:   absDir,
		UpdateUrl: finalURL,
	}

	slog.Info("config", "dataDir", cfg.DataDir, "port", cfg.Port, "updateUrl", cfg.UpdateUrl)
}
