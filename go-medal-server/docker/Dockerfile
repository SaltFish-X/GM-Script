# ============================================================
# 1. Builder
# ============================================================
FROM golang:1.27.1-alpine3.24 AS builder

ENV GOPROXY=https://goproxy.cn,direct

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download && apk add --no-cache upx

COPY . .

RUN CGO_ENABLED=0  GOOS=linux GOARCH=amd64 go build -tags=docker -ldflags="-s -w" -o server && upx server -o app_server


# ============================================================
# 2. Runtime assets
# ============================================================
FROM alpine:3.24 AS runtime-assets

RUN apk add --no-cache tzdata

# ============================================================
# 3. Production Runtime
# ============================================================
#FROM redhat/ubi10-micro:10.2 AS runtime
FROM alpine:3.24 AS runtime

# 创建非 root 用户
# UID/GID 固定，方便 Kubernetes / Docker / 文件权限管理
#RUN addgroup -S app -g 10001 \
#    && adduser -S -D -H -s /sbin/nologin \
#        -u 10001 \
#        -G app \
#        app

WORKDIR /app

COPY --from=runtime-assets /usr/share/zoneinfo /usr/share/zoneinfo

ENV TZ=Asia/Shanghai

#COPY --chown=app:app --from=builder /app/app_server ./
COPY  --from=builder /app/app_server ./

#USER app:app

EXPOSE 8080

ENTRYPOINT ["/app/app_server"]

