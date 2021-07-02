# Dockerfile中的RUN、CMD、ENTRYPOINT比较

[[toc]]

## RUN命令

RUN有2中形式:

- `RUN <command>` (shell形式，command在shell(linux上默认是 `/bin/sh -c`, windows上默认是`cmd /S /C`)中运行)
- `RUN ["executable", "param1", "param2"]`（exec 形式）

`RUN` 指令会在当前镜像上新建一个layer，然后执行命名并提交结果。被提交的镜像用于下一步指令。

分层 `RUN` 指令和生成提交符合 Docker 的核心概念，其中提交成本低，并且可以从镜像历史中的任何点创建容器，就像源代码控制一样。

*exec* 形式可以避免 shell 字符串修改，并可以使用不包含指定 shell 可执行文件的基本映像来运行命令。

可以使用 `SHELL` 命令更改 *shell* 形式的默认 shell。

在 *shell* 形式中，可以使用 \（反斜杠）将单个 RUN 指令延续到下一行。例如，考虑以下两行：

```dockerfile
RUN /bin/bash -c 'source $HOME/.bashrc; \
echo $HOME'
```

等价于

```dockerfile
RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
```

要使用除“/bin/sh”之外的不同 shell，请使用传入所需 shell 的 *exec* 形式。例如：

```dockerfile
RUN ["/bin/bash", "-c", "echo hello"]
```

> 注意:
>
> exec 形式被解析为 JSON 数组，这意味着必须在单词周围使用双引号 (“) 而不是单引号 (‘)。

与shell形式不同，exec形式不调用命令shell。这意味着正常的shell处理不会发生。例如，RUN [ "echo", "\$HOME" ] 不会对 \$HOME进行变量替换。如果你想进行shell处理，那么要么使用shell形式，要么直接执行一个shell，例如。RUN [ "sh", "-c", "echo ​\$HOME" ] 。当使用exec形式并直接执行shell时，就像shell形式的情况一样，是shell在做环境变量的扩展，而不是docker。

> 注意:
>
> 在JSON形式中，有必要转义反斜线。这在Windows上尤其重要，因为反斜杠是路径分隔符。否则，下面这一行会因为不是有效的JSON而被视为shell形式，并以一种意外的方式失败。
>
> ```dockerfile
> RUN ["c:\windows\system32\tasklist.exe"]
> ```
>
> 正确的语法是:
>
> ```dockerfile
> RUN ["c:\\windows\\system32\\tasklist.exe"]
> ```

RUN指令的缓存在下次构建时不会自动失效。像`RUN apt-get dist-upgrade -y`这样的指令的缓存会在下次构建时被重新使用。RUN指令的缓存可以通过使用`--no-cache`标志来失效，例如`docker build --no-cache`。

更多信息请参见[Dockerfile最佳实践指南](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)。

RUN指令的缓存可以通过ADD和COPY指令失效。

## CMD

CMD指令有三种形式:

- `CMD ["executable","param1","param2"]` (*exec* 形式，首选形式)
- `CMD ["param1","param2"]` ( 作为*ENTRYPOINT的默认参数*)
- `CMD command param1 param2` (*shell* 形式)

一个Dockerfile中只能有一个 CMD 指令。如果有多个CMD指令，那么只有最后一个CMD指令会生效。

**CMD的主要目的是为执行中的容器提供默认值**。这些默认值可以包括一个可执行文件，也可以省略可执行文件，在这种情况下，你必须同时指定一个ENTRYPOINT指令。

如果CMD被用来为ENTRYPOINT指令提供默认参数，CMD和ENTRYPOINT指令都应该用JSON数组格式来指定。

> 注意:
>
> exec 形式被解析为 JSON 数组，这意味着必须在单词周围使用双引号 (“) 而不是单引号 (‘)。

与*shell*形式不同，***exec*形式不调用命令shell**。这意味着正常的shell处理不会发生。例如，CMD [ "echo", "\$HOME"] 不会对$HOME进行变量替换。**如果你想进行shell处理，那么要么使用*shell*形式，要么直接执行一个shell**，例如。CMD [ "sh", "-c", "echo ​\$HOME" ] 。当使用*exec*形式并直接执行shell时，就像shell形式的情况一样，是shell在做环境变量扩展，而不是docker。

**当在*shell*或*exec*格式中使用时，CMD指令设置运行镜像时要执行的命令。**

**如果你使用CMD的*shell*形式，那么`<command>`将在`/bin/sh -c`中执行。**

```dockerfile
FROM ubuntu
CMD echo "This is a test." | wc -
```

如果你想在没有shell的情况下运行你的`<command>`，那么你必须将命令表达为一个JSON数组，并给出可执行文件的完整路径。这种数组形式是CMD的首选格式。任何额外的参数必须在数组中单独表示为字符串。

```dockerfile
FROM ubuntu
CMD ["/usr/bin/wc","--help"]
```

如果你希望你的容器每次都运行相同的可执行文件，那么你应该考虑将 ENTRYPOINT 与 CMD 结合使用。参见[ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint)。

**如果用户指定参数给docker run，那么它们将覆盖CMD中指定的默认值。**

> 注意:
>
> 不要把RUN和CMD混淆。RUN实际上是运行一个命令并提交结果；CMD在构建时不执行任何东西，而是为镜像指定要执行的命令。

## ENTRYPOINT

`ENTRYPOINT` 有两种形式:

- *exec* 形式 ，这是首选形式:

  ```dockerfile
  ENTRYPOINT ["executable", "param1", "param2"]
  ```

- *shell*形式

  ```dockerfile
  ENTRYPOINT command param1 param2
  ```

一个ENTRYPOINT允许你配置一个将作为可执行文件运行的容器。

例如，下面是启动nginx的默认内容，监听端口为80：

```bash
$ docker run -i -t --rm -p 80:80 nginx
```

**`docker run (image)` 的命令参数会被追加到 exec 形式的 ENTRYPOINT 的所有参数之后，并且会覆盖所有使用CMD指定的参数。**这样就可以给entry point传递参数了,即，`docker run (image) -d` 会传递 `-d` 参数给 entry point。你可以**使用 `docker run --entrypoint` 来覆盖 ENTRYPOINT 指令。**

***shell* 形式可以防止使用任何CMD或run命令行参数**，但缺点是你的ENTRYPOINT将作为`/bin/sh -c`的一个子命令启动，它不传递信号。这意味着可执行文件不会是容器的`PID 1`--也不会收到Unix信号--所以你的可执行文件不会收到来自docker stop \<container>的`SIGTERM`。

**Dockerfile中，只有最后一条ENTRYPOINT指令才有效果。**

### 验证例子

#### 1.docker run (image)的命令参数会被追加到 exec 形式的 ENTRYPOINT 的所有参数之后

1.编写Dockerfile:

```dockerfile
FROM ubuntu:focal
ENTRYPOINT ["ls","-l"]
```

2.构建镜像

```bash
docker build -t study-dockerfile .
```

3.测试

- 不追加参数:

  ```bash
  docker run -it --rm study-dockerfile
  ```

  结果:

  ```
  total 48
  lrwxrwxrwx   1 root root    7 Apr 16 05:11 bin -> usr/bin
  drwxr-xr-x   2 root root 4096 Apr 15  2020 boot
  drwxr-xr-x   5 root root  360 Jul  2 11:04 dev
  ....
  ```

- 追加参数 `-ah`

  ```bash
  docker run -it --rm study-dockerfile -ah
  ```

  结果:

  ```
  total 56K
  drwxr-xr-x   1 root root 4.0K Jul  2 11:06 .
  drwxr-xr-x   1 root root 4.0K Jul  2 11:06 ..
  -rwxr-xr-x   1 root root    0 Jul  2 11:06 .dockerenv
  ...
  ```

  从输出结果可以看出，追加参数生效了

#### 2.docker run会覆盖所有使用CMD指定的参数

1.编写Dockerfile

```dockerfile
FROM ubuntu:focal
ENTRYPOINT ["ls","-l"]
CMD ["-a","-h"]
```

这里，使用CMD给ENTRYPOINT传参

2.构建镜像

```bash
docker build -t study-dockerfile .
```

3.测试

- 不追加参数

  ```bash
  docker run -it --rm study-dockerfile                                                  
  ```

  结果:

  ```
  total 56K
  drwxr-xr-x   1 root root 4.0K Jul  2 11:12 .
  drwxr-xr-x   1 root root 4.0K Jul  2 11:12 ..
  -rwxr-xr-x   1 root root    0 Jul  2 11:12 .dockerenv
  lrwxrwxrwx   1 root root    7 Apr 16 05:11 bin -> usr/bin
  ...
  ```

- 追加参数

  ```bash
  docker run -it --rm study-dockerfile -a
  ```

  结果：

  ```
  total 56
  drwxr-xr-x   1 root root 4096 Jul  2 11:12 .
  drwxr-xr-x   1 root root 4096 Jul  2 11:12 ..
  -rwxr-xr-x   1 root root    0 Jul  2 11:12 .dockerenv
  lrwxrwxrwx   1 root root    7 Apr 16 05:11 bin -> usr/bin
  ...
  ```

  从输出结果可以看出，CMD中指定的所有参数都被 docker run 中的 -a参数覆盖了。

#### 3.使用 `docker run --entrypoint` 来覆盖 ENTRYPOINT 指令。

使用 `--entrypoint`:

```bash
docker run -it --rm --entrypoint ls study-dockerfile
```

运行结果:

```
bin   dev  home  lib32	libx32	mnt  proc  run	 srv  tmp  var
boot  etc  lib	 lib64	media	opt  root  sbin  sys  usr
```

从输出结果可以看出，Dockerfile中的ENTRYPOINT指令被覆盖了。

#### 4.*shell* 形式可以防止使用任何CMD或run命令行参数

1.编写Dockerfile

```dockerfile
FROM ubuntu:focal
ENTRYPOINT ls 
```

这里使用的是ENTRYPOINT 的 *shell*形式

2.构建镜像

```bash
docker build -t study-dockerfile .
```

3.测试

- 不追加参数

  ```bash
  docker run -it --rm study-dockerfile
  ```

  结果:

  ```
  bin   dev  home  lib32	libx32	mnt  proc  run	 srv  tmp  var
  boot  etc  lib	 lib64	media	opt  root  sbin  sys  usr
  ```

- 追加参数

  ```bash
  docker run -it --rm study-dockerfile -a
  ```

  结果:

  ```
  bin   dev  home  lib32	libx32	mnt  proc  run	 srv  tmp  var
  boot  etc  lib	 lib64	media	opt  root  sbin  sys  usr
  ```

  从输出结果可以看出，`docker run`中指定的 `-a`参数没有生效

#### 5.*shell* 形式的ENTRYPOINT将作为`/bin/sh -c`的一个子命令启动

##### exec形式的ENTRYPOINT

1.编写Dockerfile

```dockerfile
FROM ubuntu:focal
ENTRYPOINT watch -n 1 ls
```

2.构建镜像

```bash
docker build -t study-dockerfile . 
```

3.验证

启动容器

```bash
$ docker run -itd --rm --name study-dockerfile study-dockerfile
```

使用`docker top <container>`命令查看容器中的进程:

```bash
$ docker top study-dockerfile
UID  PID    PPID  CMD
root 785275 785255  watch -n 1 ls
```

##### shell形式的ENTRYPOINT

1.编写Dockerfile

```dockerfile
FROM ubuntu:focal
ENTRYPOINT watch -n 1 ls
```

2.构建镜像

```bash
docker build -t study-dockerfile . 
```

3.验证

启动容器

```bash
$ docker run -itd --rm --name study-dockerfile study-dockerfile
```

使用`docker top <container>`命令查看容器中的进程:

```bash
$ docker top study-dockerfile
UID   PID     PPID   CMD
root  787440  787419    /bin/sh -c watch -n 1 ls
root  787487  787440    watch -n 1 ls
```

从上面的输出可以看到 `watch -n 1 ls` 是 `/bin/sh -c watch -n 1 ls`的一个子进程。

这时，也可以在主机上查看相应进程:

```bash
$ ps -aux | grep watch
root         171  0?   0:00 [watchdogd]
sheng     763889  76288 ?         0:00 /usr/share/code/code /usr/share/code/resources/app/out/bootstrap-fork --type=watcherService
root      787440  600 pts/0      0:00 /bin/sh -c watch -n 1 ls
root      787487  2492 pts/0      0:00 watch -n 1 ls
sheng     787568  2704 pts/4      0:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox watch
```

现在，停止容器:

```bash
$ docker stop study-dockerfile
```

再查看一下主机上响应的进程, 发现在第一次使用`docker stop`命令的时候，子进程在容器停止/删除后并没有退出，但是后面再试的时候，发现子进程在容器停止/删除后也结束了。与预期结果并不相符。



## 理解CMD和ENTRYPOINT如何交互

CMD和ENTRYPOINT指令**都定义了当运行一个容器时要执行的命令**。它们合作的几个规则如下:

1. Dockerfile应该至少指定 CMD 和 ENTRYPOINT 中的一个
2. 当使用容器做为可执行文件时应该使用ENTRYPOINT 
3. CMD应该用于一种为ENTRYPOINT命令定义默认参数的方式 或 用于在容器中执行 ad-hoc命令
4. 当用其他参数运行容器时，CMD会被覆盖

下表显示了不同的ENTRYPOINT/CMD组合会执行什么命令:

|                                | No ENTRYPOINT              | ENTRYPOINT exec_entry p1_entry | ENTRYPOINT [“exec_entry”, “p1_entry”]          |
| :----------------------------- | :------------------------- | :----------------------------- | ---------------------------------------------- |
| **No CMD**                     | *error, not allowed*       | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry                            |
| **CMD [“exec_cmd”, “p1_cmd”]** | exec_cmd p1_cmd            | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry exec_cmd p1_cmd            |
| **CMD [“p1_cmd”, “p2_cmd”]**   | p1_cmd p2_cmd              | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry p1_cmd p2_cmd              |
| **CMD exec_cmd p1_cmd**        | /bin/sh -c exec_cmd p1_cmd | /bin/sh -c exec_entry p1_entry | exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd |

> 注意:
>
> 如果CMD是从基础镜像中定义的，设置ENTRYPOINT将把CMD重置为一个空值。在这种情况下，CMD必须在当前镜像中定义才有意义。

## 简而言之

- RUN: （在构建镜像阶段执行）它在一个新的layer中执行命令，并创建一个新的镜像。例如，此命令通常用于安装软件包。
- CMD: （在容器运行时执行）设置默认命令和/或参数，它能够被`docker run`命令中的参数覆盖
- ENTRYPOINT:（在容器运行时执行）允许你配置一个将作为可执行文件运行的容器。

## 参考

- https://docs.docker.com/engine/reference/builder/