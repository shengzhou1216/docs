# Docker部署redis

[[toc]]

## docker run 方式

1.运行容器

```bash
sudo docker run --name my-first-redis -d redis
```

2.连接redis-cli

```bash
sudo docker exec -it my-first-redis sh
```

3.(optional)自定义配置文件

```bash
sudo docker run --name my-first-redis -v /myfirstredis/redis.conf:/usr/local/etc/redis/redis.conf -d redis
```

4.(optional)从另一个容器访问redis

使用`--link`选项

```bash
sudo docker run -it --rm --name my-second-redis --link my-first-redis:redis -d redis
```

5.(optional)持久化存储

```bash
docker run --name some-redis -d redis redis-server --appendonly yes
```

## docker compose 方式

docker compose file:

```yaml
services:
  redis-dev:
    image: redis:6.2.4-alpine
    command: --appendonly yes
    container_name: redis-dev
    networks:
      - todolist-dev
    volumes:
      - ~/todolist/dev/redis/data:/data
    ports:
      - 6389:6389
```

- command 可以用来指定容器运行时的参数
- --appendonly yes: 持久化存储，与docker run ... --appendonly yes 对应

