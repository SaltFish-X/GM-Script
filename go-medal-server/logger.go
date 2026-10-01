//go:build !docker

package main

import (
	"io"
	"log/slog"
	"os"

	"gopkg.in/natefinch/lumberjack.v2"
)

func initLogger() {
	logRotator := &lumberjack.Logger{
		Filename:   "server.log", // 日志文件路径
		MaxSize:    20,           // 每个日志文件最大 10 MB
		MaxBackups: 5,            // 保留旧日志文件的最大个数
		MaxAge:     15,           // 保留旧日志文件的最大天数 (28天)
		Compress:   true,         // 是否压缩旧日志文件（自动压缩为 .gz 格式）
	}

	multiWriter := io.MultiWriter(os.Stdout, logRotator)

	// slog 处理器（NewJSONHandler JSON 格式， NewTextHandler 文本格式）
	handler := slog.NewTextHandler(multiWriter, &slog.HandlerOptions{
		// AddSource: true,           // 开启文件名和行号
		Level: slog.LevelInfo, // 设置全局最低日志级别为 Info
	})

	slog.SetDefault(slog.New(handler))
}
