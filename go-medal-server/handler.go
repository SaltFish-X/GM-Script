package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	server Service
}

func NewHandler(s Service) *Handler {
	return &Handler{server: s}
}

// @Summary 获取所有(新)勋章数据
// @Description  从DB中查询并返回完整的勋章原始数据列表
// @Tags         (新)勋章模块
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=[]Medal} "请求成功：data 字段内为勋章数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /medal/ [get]
func (h *Handler) GetAllMedal(c *gin.Context) {

	result := h.server.GetAllDataRaw()
	l := len(result)
	ResponseSuccess(c, result, l)
}

// @Summary 获取所有(旧)勋章文本数据
// @Description  从DB中查询并返回完整的勋章原始的文本数据列表
// @Tags         (旧)勋章文本模块
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]string} "请求成功：data 字段内为勋章文本数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /info/ [get]
func (h *Handler) GetAllInfo(c *gin.Context) {

	result := h.server.GetAllInfo()
	l := len(result)
	ResponseSuccess(c, result, l)
}

// @Summary 获取所有(旧)勋章图片数据
// @Description  从DB中查询并返回完整的勋章原始的图片数据列表
// @Tags         (旧)勋章图片模块
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]map[string][]any} "请求成功：data 字段内为勋章图片数组。注意：最后一层数组为混合元组格式而不是swagger显示的\"string\"，包含两个元素 -> 索引 0 (string): 图片链接, 索引 1 (int): 图片宽度。示例：[\"https://img.a.com/01.gif\", 40]"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /imgs/ [get]
func (h *Handler) GetAllImgs(c *gin.Context) {

	result := h.server.GetAllImgs()
	l := len(result)
	ResponseSuccess(c, result, l)
}

// @Summary 根据条件查询(新)勋章数据
// @Description  从DB中查询并返回完整的勋章原始数据列表
// @Tags         (新)勋章模块
// @Param   request body MedalQuery false  "查询条件请求体"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=[]Medal} "请求成功：data 字段内为勋章数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /medal [post]
func (h *Handler) QueryCombinedInRaw(c *gin.Context) {
	var q MedalQuery

	if err := c.ShouldBindJSON(&q); err != nil {
		ResponseError(c, 300, err.Error())
		return
	}

	h.queryCombinedInRaw(c, q)
}

// @Summary 根据条件查询(新)勋章数据
// @Description 从DB中查询并返回完整的勋章原始数据列表
// @Tags (新)勋章模块
// @Param type query string false "勋章类型"
// @Param no query string false "勋章编号"
// @Param url_tid query string false "勋章帖子Tid"
// @Param name query string false "勋章名称"
// @Param date query string false "勋章帖子日期"
// @Param startdate query string false "勋章帖子日期查询起始时间"
// @Param enddate query string false "勋章帖子日期查询结束时间"
// @Param buy_limit query string false "购买限制"
// @Param backstory query string false "背景故事"
// @Param duration query string false "持续时间"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=[]Medal} "请求成功：data 字段内为勋章数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /medal [get]
func (h *Handler) QueryCombinedInRawGet(c *gin.Context) {
	var q MedalQuery

	if err := c.ShouldBindQuery(&q); err != nil {
		ResponseError(c, 300, err.Error())
		return
	}

	h.queryCombinedInRaw(c, q)
}

// queryCombinedInRaw 公共逻辑
func (h *Handler) queryCombinedInRaw(c *gin.Context, q MedalQuery) {
	if CleanAndCheckFieldsEmpty(&q) {
		result := h.server.GetAllDataRaw()
		l := len(result)
		ResponseSuccess(c, result, l)
		// ResponseError(c, 300, "参数错误: 至少包含一个有效的查询条件")
		return
	}

	if q.StartDate != nil && q.EndDate != nil {
		queryStartUnix := parseDateToUnix(*q.StartDate)
		queryEndUnix := parseDateToUnix(*q.EndDate)

		if queryStartUnix > queryEndUnix {
			ResponseError(c, 300, "起始时间不能超过结束时间")
			return
		}
	}

	result, err := h.server.QueryCombinedInRaw(q)
	if err != nil {
		ResponseError(c, 300, err.Error())
		return
	}

	ResponseSuccess(c, result, len(result))
}

type QueryInRequest struct {
	Name  string `json:"name" form:"name"`
	Query *int   `json:"query" form:"query"`
}

// 绑定后调用此方法
func (q *QueryInRequest) Trim() {
	q.Name = strings.TrimSpace(q.Name)
}

// @Summary 根据条件查询(旧)图片勋章数据
// @Description  从DB中查询并返回完整的勋章图片数据列表
// @Tags         (旧)勋章图片模块
// @Param jsonBody  body object{name=string,query=int} false  "请求体：name(可选，勋章名称), query(可选，查询类型，不传为精确匹配，传1为模糊匹配), 都不传返回全部数据"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]map[string][]any} "请求成功：data 字段内为勋章图片数组。注意：最后一层数组为混合元组格式而不是swagger显示的\"string\"，包含两个元素 -> 索引 0 (string): 图片链接, 索引 1 (int): 图片宽度。示例：[\"https://img.a.com/01.gif\", 40]"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /imgs [post]
func (h *Handler) QueryInImgs(c *gin.Context) {
	var q QueryInRequest

	if err := c.ShouldBindJSON(&q); err != nil {
		ResponseError(c, 300, "参数错误 "+err.Error())
		return
	}
	q.Trim()
	h.queryInImgs(c, q)
}

// @Summary 根据条件查询(旧)勋章数据
// @Description  从DB中查询并返回完整的勋章原始数据列表
// @Tags         (旧)勋章图片模块
// @Param name query string false "勋章名称"
// @Param query query int false "查询类型，1为模糊匹配，否则为精准查询"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]map[string][]any} "请求成功：data 字段内为勋章图片数组。注意：最后一层数组为混合元组格式而不是swagger显示的\"string\"，包含两个元素 -> 索引 0 (string): 图片链接, 索引 1 (int): 图片宽度。示例：[\"https://img.a.com/01.gif\", 40]"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /imgs [get]
func (h *Handler) QueryInImgsGet(c *gin.Context) {
	var q QueryInRequest

	if err := c.ShouldBindQuery(&q); err != nil {
		ResponseError(c, 300, "参数错误 "+err.Error())
		return
	}
	q.Trim()
	h.queryInImgs(c, q)
}

// queryInImgs 公共逻辑
func (h *Handler) queryInImgs(c *gin.Context, q QueryInRequest) {
	if q.Name == "" {
		result := h.server.GetAllImgs()
		l := len(result)
		ResponseSuccess(c, result, l)
		return
	}
	// 模糊匹配
	if q.Query != nil && *q.Query == 1 {
		result := h.server.QueryPartialInImgs(q.Name)
		ResponseSuccess(c, result, len(result))
		return
	}

	// 精确匹配
	result, err := h.server.QueryOneInImgs(q.Name)
	if err != nil {
		ResponseError(c, 300, err.Error())
		return
	}

	ResponseSuccess(c, result, len(result))
}

// @Summary 根据条件查询(旧)勋章文本数据
// @Description  从DB中查询并返回完整的勋章原始数据文本列表
// @Tags         (旧)勋章文本模块
// @Param jsonBody  body object{name=string,query=int} false  "请求体：name(可选，勋章名称), query(可选，查询类型，不传为精确匹配，传1为模糊匹配), 都不传返回全部数据"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]string} "请求成功：data 字段内为勋章文本数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /info [post]
func (h *Handler) QueryInInfo(c *gin.Context) {
	var q QueryInRequest

	if err := c.ShouldBindJSON(&q); err != nil {
		ResponseError(c, 300, "参数错误 "+err.Error())
		return
	}
	q.Trim()
	h.queryInInfo(c, q)
}

// @Summary 根据条件查询(旧)勋章文本数据
// @Description  从DB中查询并返回完整的勋章原始的文本数据列表
// @Tags         (旧)勋章文本模块
// @Param name query string false "勋章名称"
// @Param query query int false "查询类型，1为模糊匹配，否则为精准查询"
// @Produce json
// @Success 200 {object} SwaggerResponseSuccess{data=map[string]string} "请求成功：data 字段内为勋章文本数组"
// @Failure 400 {object} SwaggerResponseError{data=string} "请求失败"
// @Failure 500 {object} SwaggerResponseError{data=string} "内部错误"
// @Router /info [get]
func (h *Handler) QueryInInfoGet(c *gin.Context) {
	var q QueryInRequest

	if err := c.ShouldBindQuery(&q); err != nil {
		ResponseError(c, 300, "参数错误 "+err.Error())
		return
	}
	q.Trim()
	h.queryInInfo(c, q)
}

// queryInInfo 公共逻辑
func (h *Handler) queryInInfo(c *gin.Context, q QueryInRequest) {

	if q.Name == "" {
		result := h.server.GetAllInfo()
		ResponseSuccess(c, result, len(result))
		return
	}

	// 模糊匹配
	if q.Query != nil && *q.Query == 1 {
		result := h.server.QueryPartialInInfo(q.Name)
		ResponseSuccess(c, result, len(result))
		return
	}
	// 精确匹配
	result, err := h.server.QueryOneInInfo(q.Name)
	if err != nil {
		ResponseError(c, 300, err.Error())
		return
	}
	ResponseSuccess(c, result, len(result))
}

// @Summary 服务运行检查
// @Description 检查服务是否正常运行
// @Tags 服务状态检查
// @Produce json
// @Success 200 {object} map[string]string "服务正常"
// @Router /healthz [get]
func (h *Handler) Healthz(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// @Summary Ping检查
// @Description Ping服务检查
// @Tags 服务状态检查
// @Produce plain
// @Success 200 {string} string "pong"
// @Router /ping [get]
func (h *Handler) Ping(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}
