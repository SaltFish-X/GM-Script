package main

import (
	"github.com/gin-gonic/gin"
)

func setRoutes(router *gin.Engine, db *DB) {
	rawSer := NewService(db)
	rawH := NewHandler(rawSer)
	rawRoutes := router.Group("/medal")
	{
		rawRoutes.GET("", rawH.QueryCombinedInRawGet)
		rawRoutes.GET("/", rawH.GetAllMedal)
		rawRoutes.POST("", rawH.QueryCombinedInRaw)
	}
	infoRoutes := router.Group("/info")
	{
		infoRoutes.GET("", rawH.QueryInInfoGet)
		infoRoutes.GET("/", rawH.GetAllInfo)
		infoRoutes.POST("", rawH.QueryInInfo)
	}
	imgsRoutes := router.Group("/imgs")
	{
		imgsRoutes.GET("", rawH.QueryInImgsGet)
		imgsRoutes.GET("/", rawH.GetAllImgs)
		imgsRoutes.POST("", rawH.QueryInImgs)
	}

	router.GET("/healthz", rawH.Healthz)
	router.GET("/ping", rawH.Ping)
}
