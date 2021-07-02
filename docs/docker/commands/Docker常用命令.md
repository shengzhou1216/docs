# Docker常用命令

## 容器

### 查看容器

#### 查看正在运行的容器

```shell
docker ps
```

#### 查看所有的容器

```shell
docker ps -a
```

#### 查看指定状态的容器

容器有如下几种状态，可以通过状态过滤

 created, restarting, running, paused, exited

```
docker ps -a -f status=exited
```

- -f : 基于状态过滤

#### 查看多种状态的容器

```
docker ps -a -f status=exited -f status=created
```

### 删除容器

#### 删除一个容器/多个容器

```shell
docker rm ID_or_Name [ID_or_Name..]
```

#### 删除容器ID_or_Name的格式，批量删除容器

```shell
docker ps -a | grep "pattern" | awk '{print $3}' | xargs docker rmi
```

使用 `awk` 传递ID到 `docker rmi`

#### 删除所有特定状态的容器

##### 列出所有退出的容器

```
docker rm $(docker ps -a -f status=exited -q)
```

-q: 传递容器ID 给 `docker rm`命令

##### 删除多种状态的容器

```
docker rm $(docker ps -a -f status=exited -f status=created -q)
```

- 退出容器时，移除容器

运行`docker run --rm`，退出时自动删除容器。

```
docker run --rm image_name
```

- 移除所有的容器

```
docker stop $(docker ps -a -q)docker rm $(docker ps -a -q)
```

### 查看容器日志

```
docker logs [containerID]
```

### 运行容器

```bash
$ docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

```bash
$ docker run -it --name [CONTAINER-NAME] -v [LocalPath]:/[ContainerPath]   [IMAGE]  /bin/bash
```

- -i: 交互式
- -t: 终端terminal
- -v: 将本地目录挂在到容器中
- --name: 容器名称
- /bin/bash: 指定终端类型

### 在运行的容器中执行命令

使用`docker exec`命令，可以在运行的容器中执行命令。

```bash
Usage:  docker exec [OPTIONS] CONTAINER COMMAND [ARG...]Run a command in a running containerOptions:  -d, --detach               Detached mode: run command in the background      --detach-keys string   Override the key sequence for detaching a container  -e, --env list             Set environment variables      --env-file list        Read in a file of environment variables  -i, --interactive          Keep STDIN open even if not attached      --privileged           Give extended privileges to the command  -t, --tty                  Allocate a pseudo-TTY  -u, --user string          Username or UID (format: <name|uid>[:<group|gid>])  -w, --workdir string       Working directory inside the container
```

示例:

```bash
$ docker exec -i 36edc560536b ls -al /
```

`ls -al /` 为在容器中执行的命令

### 导出容器到压缩文件

```bash
Usage:  docker export [OPTIONS] CONTAINERExport a container's filesystem as a tar archiveOptions:  -o, --output string   Write to a file, instead of STDOUT
```

### 查看容器中运行的进程

```bash
Usage:  docker top CONTAINER [ps OPTIONS]Display the running processes of a container
```

## 镜像

### 查看镜像

```bash
$ docker images $ docker images -a
```

 过滤满足条件的镜像

```shell
docker images -a |  grep "pattern"
```

### 删除镜像

#### 根据镜像名称删除镜像，可以有多个镜像名称，多个镜像名称用空格分开

```shell
docker rmi [imageName] [imageName] ...
```

#### 根据镜像名称的格式批量删除镜像

##### 列出满足条件的镜像

```sheel
docker images -a |  grep "pattern"
```

##### 移除镜像

```shell
docker images -a | grep "pattern" | awk '{print $3}' | xargs docker rmi
```

> 删除"\<none\>" 镜像 :
>
> ```bash
> docker images -a | grep "<none>" | awk '{print $3}' | xargs docker rmi
> ```

[awk?](https://linuxize.com/post/awk-command/)

- awk '{print $3}' 输出镜像ID，

[xargs?](https://shapeshed.com/unix-xargs/)

从标准输入构建一个可执行的管道

> ```
> echo 'one two three' | xargs mkdir
> ls
> one two three
> ```

- xargs docker rmi 对于得到的镜像ID，执行docker rmi 命令

#### 移除所有镜像

##### 列出所有镜像

```shell
docker images -a
```

##### 移除镜像

```shell
docker rmi $(docker images -a -q)
```

`-q`: 传递镜像ID 给 `docker rmi`

### 从容器创建新的镜像（commit容器）

```shell
docker commit -m='smart-clip version 0.0.1' -a='zhou' -p 68b0b30addd9 smart-clip:0.0.1
```

- -m: 说明
- -a: author
- -p: 容器ID

### 将镜像推送到私有仓库

1. 给镜像打tag

```bash
$ docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]
```

- REGISTRYHOST 为私有仓库地址。

2. 推送到私有仓库

```bash
$ docker push NAME[:TAG]
```

> Example:
>
> ```
> docker tag 518a41981a6a myRegistry.com/myImagedocker push myRegistry.com/myImage
> ```

### 将镜像打包为压缩文件

```bash
$ docker save [OPTIONS] IMAGE [IMAGE...]
```

- -o 可以指定生成的打包文件名
- 可以一次打包多个镜像

```bash
# example$ docker save -o openjkd8.tar openjdk
```

### 无法删除镜像问题

#### image has dependent child images

#### image is referenced in multiple repositories

https://stackoverflow.com/questions/53354523/can-not-remove-images-even-though-no-container-is-running

You cannot remove images having multiple repositories without the force modifier, see Docker [docs](https://docs.docker.com/engine/reference/commandline/rmi/) for more info.

```bash
$ docker imagesREPOSITORY                   TAG      IMAGE ID            CREATED           SIZErepository/image-name        tag      a8e6fa672e89        10 days ago         344MBrepository2/image-name       tag      a8e6fa672e89        10 days ago         344MB
```

If you want to do it manually, instead of using the image id to remove the images, you must remove the repository/tag that you don't need using image names:

```bash
$ docker rmi a8e6fa672e89Error response from daemon: conflict: unable to delete a8e6fa672e89 (must be forced) - image is referenced in multiple repositories
```

Remove the repository/tag you don't need:

```bash
$ docker rmi repository/image-name:tagUntagged: repository/image-name:tagUntagged: repository/image-name:tag@sha256:64b5a02e2bb3ee4d4b7c0982e8e2e5eb68bdfd0fb096fce22b6c030dafb53a33
```

(Repeat last step until only one repository/tag remains) And now you will be able to remove the image:

```bash
$ docker rmi a8e6fa672e89Untagged: repository2/image-name:tagDeleted: sha256:a8e6fa672e89b399bd3ac52b96c031e6816a69191d1fd7e6a1839fd643e3c751Deleted: sha256:9861dd7b5783217515f571fdcfa6729e1e38af3ae9c971026e5a317b12fc5905
```

If you use the -f flag and specify the image’s short or long ID, then rmi untags and removes all images that match the specified ID.

有多个id相同的镜像时，删除时要使用仓库名和tag删除，不要使用id.