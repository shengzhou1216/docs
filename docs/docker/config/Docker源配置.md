# Docker源配置

修改 `/etc/docker/daemon.json` 中的 `registry-mirrors`

```json
{
    "registry-mirrors": [
        "https://registry.docker-cn.com",
        "http://hub-mirror.c.163.com",
        "http://docker.mirrors.ustc.edu.cn"
    ]
}
```

> docker官方中国区 `https://registry.docker-cn.com`
>
> 网易 `http://hub-mirror.c.163.com`
>
> ustc `http://docker.mirrors.ustc.edu.cn`

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

