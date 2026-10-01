package main

import (
	"log/slog"
	"strings"
)

type service struct {
	db *DB
}

type Service interface {
	GetAllDataRaw() []Medal
	GetAllInfo() map[string]string
	GetAllImgs() map[string]map[string][]any

	QueryCombinedInRaw(q MedalQuery) ([]Medal, error)

	QueryOneInInfo(name string) (map[string]string, error)
	QueryOneInImgs(name string) (map[string]map[string][]any, error)

	QueryPartialInInfo(keyword string) map[string]string
	QueryPartialInImgs(keyword string) map[string]map[string][]any
}

func NewService(db *DB) Service {
	return &service{db: db}
}

// 返回所有的 Medal Raw
func (s *service) GetAllDataRaw() []Medal {
	return s.db.dataRaw
}

// 返回所有的 Info
func (s *service) GetAllInfo() map[string]string {
	return s.db.info
}

// 返回所有的 Imgs
func (s *service) GetAllImgs() map[string]map[string][]any {
	return s.db.imgs
}

// Medal Raw 中组合查询
func (s *service) QueryCombinedInRaw(q MedalQuery) ([]Medal, error) {
	var result []Medal
	var queryStartUnix, queryEndUnix int64 = 0, 0
	if q.StartDate != nil {
		queryStartUnix = parseDateToUnix(*q.StartDate)
	}
	if q.EndDate != nil {
		queryEndUnix = parseDateToUnix(*q.EndDate)
	}
	for _, item := range s.db.dataRaw {
		match := true

		// 过滤 Type
		if q.Type != nil && !strings.Contains(item.Type, *q.Type) {
			match = false
		}
		// 过滤 No
		if match && q.No != nil {
			if item.No == nil || !strings.Contains(*item.No, *q.No) {
				match = false
			}
		}
		// 过滤 UrlTid
		if match && q.UrlTid != nil {
			if item.UrlTid == nil || !strings.Contains(*item.UrlTid, *q.UrlTid) {
				match = false
			}
		}
		// 过滤 Name
		if match && q.Name != nil && !strings.Contains(item.Name, *q.Name) {
			match = false
		}
		// 过滤 Date
		if match && q.Date != nil && !strings.Contains(item.Date, *q.Date) {
			match = false
		}
		// 过滤 范围Date
		if match && (q.StartDate != nil || q.EndDate != nil) {

			itemUnix := parseDateToUnix(item.Date)

			if itemUnix == 0 {
				// 如果数据本身的日期格式非法导致解析失败，则判定不匹配
				match = false
			} else {
				// 如果传了起始时间，数据的时间戳 >= 起始时间戳
				if q.StartDate != nil && itemUnix < queryStartUnix {
					match = false
				}
				// 如果传了结束时间，数据的时间戳 <= 结束时间戳
				if match && q.EndDate != nil && itemUnix > queryEndUnix {
					match = false
				}
			}
		}

		// 过滤 BuyLimit
		if match && q.BuyLimit != nil && !strings.Contains(item.BuyLimit, *q.BuyLimit) {
			match = false
		}

		// 过滤 Backstory
		if match && q.Backstory != nil {
			if item.Backstory == nil || !strings.Contains(*item.Backstory, *q.Backstory) {
				match = false
			}
		}

		// 过滤 Duration
		if match && q.Duration != nil {
			if item.Duration == nil || !strings.Contains(*item.Duration, *q.Duration) {
				match = false
			}
		}

		// 只有通过了所有激活的筛选条件，才加入结果集
		if match {
			result = append(result, item)
		}
	}

	return result, nil
}

// Info 中精准查询
func (s *service) QueryOneInInfo(name string) (map[string]string, error) {

	val, exists := s.db.info[name]
	if !exists {
		slog.Warn("精确查询失败", "type", "Info", "name", name)
		return map[string]string{}, nil
	}
	result := map[string]string{name: val}
	return result, nil
}

// Imgs 中精准查询
func (s *service) QueryOneInImgs(name string) (map[string]map[string][]any, error) {

	val, exists := s.db.imgs[name]
	if !exists {
		slog.Warn("精确查询失败", "type", "Imgs", "name", name)
		return map[string]map[string][]any{}, nil
	}
	result := map[string]map[string][]any{name: val}
	return result, nil
}

// Info 中模糊查询
func (s *service) QueryPartialInInfo(keyword string) map[string]string {
	result := make(map[string]string)
	for name, val := range s.db.info {
		if strings.Contains(name, keyword) {
			result[name] = val
		}
	}
	if len(result) == 0 {
		slog.Warn("模糊查询失败", "type", "Info", "name", keyword)
	}
	return result
}

// Imgs 中模糊查询
func (s *service) QueryPartialInImgs(keyword string) map[string]map[string][]any {
	result := make(map[string]map[string][]any)
	for name, val := range s.db.imgs {
		if strings.Contains(name, keyword) {
			result[name] = val
		}
	}
	if len(result) == 0 {
		slog.Warn("模糊查询失败", "type", "Imgs", "name", keyword)
	}
	return result
}
