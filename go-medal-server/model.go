package main

type Medal struct {
	Type        string           `json:"type"`         // 勋章类型
	No          *string          `json:"no"`           // 勋章编号
	UrlTid      *string          `json:"url_tid"`      // 勋章帖子Tid
	Name        string           `json:"name"`         // 勋章名称
	Date        string           `json:"date"`         // 勋章帖子日期
	Price       string           `json:"price"`        // 勋章价格
	BuyLimit    string           `json:"buy_limit"`    // 购买限制
	Backstory   *string          `json:"backstory"`    // 背景故事
	Duration    *string          `json:"duration"`     // 持续时间
	SpecialNote *[]string        `json:"special_note"` // 特殊说明
	Levels      string           `json:"levels"`       // 等级信息
	LevelsImg   map[string][]any `json:"levels_img"`   // 图片信息
}

type medalKey struct {
	Type string
	Name string
}

type MedalQuery struct {
	Type      *string `json:"type" form:"type"`           // 勋章类型
	No        *string `json:"no" form:"no"`               // 勋章编号
	UrlTid    *string `json:"url_tid" form:"url_tid"`     // 勋章帖子Tid
	Name      *string `json:"name" form:"name"`           // 勋章名称
	Date      *string `json:"date" form:"date"`           // 勋章帖子日期
	StartDate *string `json:"startdate" form:"startdate"` // 勋章帖子日期查询起始时间
	EndDate   *string `json:"enddate" form:"enddate"`     // 勋章帖子日期查询结束时间
	BuyLimit  *string `json:"buy_limit" form:"buy_limit"` // 购买限制
	Backstory *string `json:"backstory" form:"backstory"` // 背景故事
	Duration  *string `json:"duration" form:"duration"`   // 持续时间
}
