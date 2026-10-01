//go:build dev
// +build dev

package main

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "go-medal-server/docs"
)

func init() {
	// 实现钩子函数：注入 Swagger 路由
	setExtRoutes = func(router *gin.Engine) {
		router.GET("/swagger/*any", func(c *gin.Context) {
			path := c.Param("any")

			if path == "" || path == "/" {
				c.Redirect(301, "/swagger/index.html")
				return
			}
			ginSwagger.WrapHandler(swaggerFiles.Handler)(c)
		})
	}
}
