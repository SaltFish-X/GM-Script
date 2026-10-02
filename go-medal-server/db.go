package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"strings"
	"sync"
)

type DB struct {
	dataRaw       []Medal
	info          map[string]string
	imgs          map[string]map[string][]any
	mu            sync.Mutex
	lastOnlineMD5 string
}

func NewDB(data []byte) *DB {
	db := &DB{}

	if err := db.setData(data); err != nil {
		slog.Warn("db", "init", err)
	} else {
		slog.Info("db", "init", "dataJson加载成功")
	}

	db.buildInfoAndImgs()

	return db
}

func (db *DB) setData(dataRaw []byte) error {
	if len(dataRaw) == 0 {
		return errors.New("dataJson为空")
	}
	var items []Medal
	if err := json.Unmarshal(dataRaw, &items); err != nil {
		return fmt.Errorf("data解析为Json异常，%w", err)
	}
	db.dataRaw = items
	return nil
}

// 根据dataRaw构建出info和imgs
func (db *DB) buildInfoAndImgs() {
	textMap := make(map[string]string)
	imgsMap := make(map[string]map[string][]any)

	for _, medal := range db.dataRaw {
		name := medal.Name
		if name == "" {
			name = "未知勋章"
		}

		// 奖品迷之瓶
		if name == "迷之瓶" && medal.Type == "奖品" {
			continue
		}

		var lines []string

		// name
		lines = append(lines, name)

		// 【勋章类型】
		lines = append(lines, fmt.Sprintf("【勋章类型】%s", medal.Type))

		// 【创建时间】
		if medal.UrlTid != nil && *medal.UrlTid != "" {
			lines = append(lines,
				fmt.Sprintf(
					`【创建时间】<a href="/thread-%s-1-1.html" target="_blank">%s（前往博物馆）</a>`,
					*medal.UrlTid,
					medal.Date,
				),
			)
		} else if medal.Date != "" {
			lines = append(lines, fmt.Sprintf("【创建时间】%s", medal.Date))
		}

		// 【背景故事】
		if medal.Backstory != nil {
			backstory := strings.TrimSpace(*medal.Backstory)

			if backstory != "" {
				lines = append(lines,
					fmt.Sprintf("【背景故事】%s", backstory),
				)
			}
		}

		// 【入手条件】
		buyLimit := strings.ReplaceAll(
			medal.BuyLimit,
			"在线时间",
			"在线时间(小时)",
		)

		lines = append(lines,
			fmt.Sprintf("【入手条件】%s", buyLimit),
		)

		// 【商店售价】
		if medal.Price != "无" {
			lines = append(lines,
				fmt.Sprintf("【商店售价】%s", medal.Price),
			)
		}

		// 【持续时间】
		if medal.Duration != nil && *medal.Duration != "" {
			lines = append(lines,
				fmt.Sprintf("【持续时间】%s", *medal.Duration),
			)
		}

		// levels
		if medal.Levels != "" {
			for line := range strings.SplitSeq(medal.Levels, "\n") {
				txt := strings.TrimSpace(
					strings.ReplaceAll(
						line,
						"在线时间",
						"在线时间(小时)",
					),
				)

				if txt != "" {
					lines = append(lines, txt)
				}
			}
		}

		// special_note
		if medal.SpecialNote != nil && len(*medal.SpecialNote) > 0 {
			for _, item := range *medal.SpecialNote {
				lines = append(lines, fmt.Sprintf("【特殊说明】%s", item))
			}
		}

		// 最终文本
		textMap[name] = strings.Join(lines, "\n")

		// levels_img
		cleanImgs := make(map[string][]any)

		for k, v := range medal.LevelsImg {
			if len(v) < 2 {
				continue
			}
			img := fmt.Sprint(v[0])

			width, ok := anyToInt(v[1])
			if !ok {
				continue
			}

			cleanImgs[k] = []any{
				img,
				width,
			}
		}

		if len(cleanImgs) > 0 {
			imgsMap[name] = cleanImgs
		}
	}

	db.info = textMap
	db.imgs = imgsMap
	slog.Info("db", "build", "info和imgs构建成功")
}

// 增量更新dataRaw
func (db *DB) appendData(dataRaw []byte) error {
	if len(dataRaw) == 0 {
		return errors.New("appendData的dataRaw为空")
	}
	var items []Medal
	if err := json.Unmarshal(dataRaw, &items); err != nil {
		return fmt.Errorf("appendData的data解析为Json异常，%w", err)
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	keyToIndex := make(map[medalKey]int)
	for idx, item := range db.dataRaw {
		key := medalKey{Type: item.Type, Name: item.Name}
		keyToIndex[key] = idx
	}

	// 遍历新解析出来的数据
	for _, newItem := range items {
		key := medalKey{Type: newItem.Type, Name: newItem.Name}

		if idx, exists := keyToIndex[key]; exists {
			// 相同 Type + ID -> 覆盖原数据
			db.dataRaw[idx] = newItem
		} else {
			// 不同的 Type + ID -> 追加到末尾
			db.dataRaw = append(db.dataRaw, newItem)
			// 更新映射表，防止这次传入的新数据内部有重复的 Key 导致重复追加
			keyToIndex[key] = len(db.dataRaw) - 1
		}
	}
	slog.Info("db", "update", "dataRaw更新成功")
	db.buildInfoAndImgs()
	return nil
}

func (db *DB) checkOnlineUpdate(fileURL string) error {
	log.Println("开始检查 GitHub 文件，进行更新...")

	// 发起 HTTP 请求
	resp, err := http.Get(fileURL)
	if err != nil {
		return fmt.Errorf("请求文件失败: %v\n", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("请求返回异常状态码: %d\n", resp.StatusCode)
	}

	// 读取响应体
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("读取响应体失败: %v\n", err)
	}

	if len(body) == 0 {
		return fmt.Errorf("下载的文件内容为空，跳过")
	}

	// 计算当前内容的 MD5 值
	hash := md5.Sum(body)
	currentMD5 := hex.EncodeToString(hash[:])

	// 比对 MD5，判断是否有更新
	db.mu.Lock()
	isUpdated := currentMD5 != db.lastOnlineMD5
	db.mu.Unlock()

	if isUpdated {
		log.Println("检测到文件有更新，准备写入数据库...")
		if err := db.appendData(body); err != nil {
			return fmt.Errorf("更新数据失败: %v\n", err)
		}

		// 更新成功后，保存新的 MD5 缓存
		db.mu.Lock()
		db.lastOnlineMD5 = currentMD5
		db.mu.Unlock()
		slog.Info("dataRaw的数据更新成功！")
	} else {
		slog.Info("文件无变化，无需更新。")
	}
	return nil
}
