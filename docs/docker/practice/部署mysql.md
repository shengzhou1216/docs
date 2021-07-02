# 使用Docker部署mysql

[[toc]]

## 启动服务

### docker run

```bash
$ docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
```

- my-secret-pw 是 root 用户的密码

### 连接mysql

```bash
docker run -it --network some-network --rm mysql mysql -h some-mysql -uexample-user -p
```

- some-mysql 是你刚刚启动的容器的名称
- some-network 是 Docker network

此命令也可以连接非Docker启动的mysql

```bash
$ docker run -it --rm mysql mysql -h some.mysql.host -usome-mysql-user -p
```

### docker-compose.yml

```yaml
version: "3.9"
 mysql:
    container_name: style-ma-db
    command: --default-authentication-plugin=mysql_native_password
    image: style-ma-db
    build:
      context: db
      dockerfile: Dockerfile
    ports:
      - 3306:3306
    restart: always
    privileged: true
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_ROOT_HOST: '%'
      MYSQL_DATABASE: style_app
    volumes:
      - ~/style-ma/dev/mysql:/var/lib/mysql
    networks:
      - style-ma

  adminer:
    image: adminer
    container_name: style-ma-db-adminer
    restart: always
    ports:
      - 9999:8080
      
networks:
  style-ma:
    driver: bridge
   
```

#### 环境变量说明

- `MYSQL_ROOT_PASSWORD`: 此环境变量是强制的，指定的密码会被设置为 `root` 超级账户的密码。

- `MYSQL_DATABASE`(可选): 指定在镜像启动后要创建的数据库名称。如果同时指定了用户名和密码，这个用户会被授予此数据库的超级用户权限（对应于`GRANT ALL`）
- `MYSQL_USER`(可选),`MYSQL_PASSWORD`(可选): 创建一个新的用户并设置该用户的密码。此用户会被赋予`MYSQL_DATABASE`所指定的数据库的超级用户权限。要创建一个用户，这两个环境变量都需要设置
- `MYSQL_ALLOW_EMPTY_PASSWORD`(可选): 设置非空值，如 `yes`，允许root用户不用密码启动容器。注意: 不建议设置此环境变量为`yes`，除非你直到你在做什么，因为此操作会让你的数据库完全不受保护，任何人都可以获取超级用户访问权限。
- `MYSQL_RANDOM_ROOT_PASSWORD`(可选): 设置非空值，如`yes`，为root用户生成一个随机的初始密码(使用`pwgen`)。生成的密码会在stdout中打印(`GENERATED ROOT PASSWORD: .....`)
- `MYSQL_ONETIME_PASSWORD`(可选): 设置root用户(不是在`MYSQL_USER`中指定的用户)在初始完成后即过期，在第一次登录时强制修改密码。任意非空值都会激活此配置。注意: 此功能只支持MySQL 5.6+版本。在MySQL 5.5上使用此功能会在初始化时报错。
- `MYSQL_INITDB_SKIP_TZINFO`: 默认情况下，entrypoint脚本自动加载 `CONVERT_TZ()`函数所需要的时区数据。如果不需要，任意非空值会禁用时区加载。

./db/Dockerfile:

```dockerfile
FROM mysql:8.0
COPY style_app.sql /docker-entrypoint-initdb.d
EXPOSE 3306
```

## 使用自定义的配置文件

例如，自定义配置文件位置为`/my/custom/config-file.cnf`，挂载配置文件 `/my/custom:/etc/mysql/conf.d`

```bash
$ docker run --name some-mysql -v /my/custom:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
```

mysql运行时会使用 `/etc/mysql/my.cnf`  和 `/etc/mysql/conf.d/config-file.cnf` 中的配置（后面的优先级高)

## 不使用`cnf`文件进行配置

大多配置可以作为参数传递给 `mysqld`。 如:  设置mysql server 的字符集:

```bash
$ docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

如果要查看所有可用的配置项，可以运行:

```bash
$ docker run -it --rm mysql:tag --verbose --help
```

## Docker秘钥

除了使用环境变量传递敏感信息外，还可以在上面列出的环境变量后面追加`_FILE`，让初始化脚本从容器的文件中加载这些变量。特别的，这中方式可以用于从存储在 `/run/secrets/<secret_name>` 文件中的Docker秘钥加载密码。例如:

```bash
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql-root -d mysql:tag
```

当前这种方式只支持: `MYSQL_ROOT_PASSWORD`, `MYSQL_ROOT_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`.

> Docker secrets 是什么?
>
> https://docs.docker.com/engine/reference/commandline/secret/
>
> https://docs.docker.com/engine/swarm/secrets/
>
> ### [Defining and using secrets in compose files](https://docs.docker.com/engine/swarm/secrets/#defining-and-using-secrets-in-compose-files)

#### 使用

```yaml
services:
	mysql:
		....
        secrets:
          - mysql_root
        environment:
          MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root
secrets:
  mysql_root:
    file: ~/todolist/dev/mysql/conf/mysql_root
```

## 初始化实例

容器首次启动后，会根据提供的数据库名创建一个新的数据库。此外，它会执行``/docker-entrypoint-initdb.d`中的 `.sh`，`.sql` 和 `.sql.gz`文件。 这些文件会按照字母顺序执行。

## 注意事项

### 存储数据

1. 创建数据存储目录 `/my/own/datadir`

2. 挂载目录到 `/var/lib/mysql`

   ```bash
   $ docker run --name some-mysql -v /my/own/datadir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
   ```

### 针对已经存在的数据库

如果关在的数据目录中已经有一个数据库了，那么 `MYSQL_ROOT_PASSWORD`变量会被忽略，已存在的数据库不会有任何改变。

### 以任意用户身份运行

使用 --user 设置以哪个用户运行（除了`root/0`）。例如:

```bash
mkdir data
$ ls -lnd data
drwxr-xr-x 2 1000 1000 4096 Aug 27 15:54 data
$ docker run -v "$PWD/data":/var/lib/mysql --user 1000:1000 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
```

### 创建数据库备份

使用 `docker exec`来运行工具。

```bash
$ docker exec some-mysql sh -c 'exec mysqldump --all-databases -u root -p"$MYSQL_ROOT_PASSWORD"' > /some/path/on/your/host/all-databases.sql
```

### 从数据库备份中恢复数据

```bash
$ docker exec -i some-mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD"' < /some/path/on/your/host/all-databases.sql
```

上面的命令无效，会报Access Denied错误。可以使用下面的命令:

```bash
$ docker exec -i todolist-mysql-test mysql -u root --password=<password> <database> < ~/xxxx.sql
```

## 参考

翻译自: https://hub.docker.com/_/mysql

## 错误

### Failed to access directory for --secure-file-priv. Please make sure that directory exists and is accessible by MySQL Server. Supplied value : /var/lib/mysql-files

```
style-ma-db | 2021-01-11 06:47:41+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
style-ma-db | 2021-01-11 06:47:41+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.22-1debian10 started.
style-ma-db | mysqld: Error on realpath() on '/var/lib/mysql-files' (Error 2 - No such file or directory)
style-ma-db | 2021-01-11T06:47:42.156884Z 0 [ERROR] [MY-010095] [Server] Failed to access directory for --secure-file-priv. Please make sure that directory exists and is accessible by MySQL Server. Supplied value : /var/lib/mysql-files
style-ma-db | 2021-01-11T06:47:42.156895Z 0 [ERROR] [MY-010119] [Server] Aborting
```

配置文件挂载错了

```
- /opt/mysql/my.conf:/etc/mysql/my.conf
```

应改为:

```
- /opt/mysql/my.cnf:/etc/mysql/my.cnf
```

### 启动容器后，无法登录mysql

docker-compose配置如下:

```yaml
mysql:
    container_name: style-ma-db
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    ports:
      - 3306:3306
    restart: always
    privileged: true
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - /opt/mysql/data:/var/lib/mysql
      - /opt/mysql/logs:/var/log/mysql
      - /opt/mysql/my.cnf:/etc/mysql/my.cnf
      - /opt/mysql/conf:/etc/mysql
    networks:
      - backend
```

这里设置了`MYSQL_ROOT_PASSWORD`，然而 `mysql -u root -p`使用root却无法登录。

#### 问题出现原因

The image `entrypoint` script will never make changes to a `database` which is existing. If you mount an existing data directory into `var/lib/mysql` then `MYSQL_ROOT_PASSWORD` will have no effect.

#### 解决方法

第一步：找出容器volume名称

你手动设置了volume名称，可以用`docker volume ls`查看；

如果没有手动设置，那么可以使用`docker insepect <mysql_container>`命令 查看

第二步：删除该volume

`docker volume rm <volume_name>` 

已经删除了volume，再次启动容器，进入容器后，输入`mysql -u root -p`

输入密码，还是无法访问

```
 Access denied for user 'root'@'localhost' (using password: YES)
```

参考了这个回答，与上面的思路一致，没有什么帮助。https://stackoverflow.com/questions/59838692/mysql-root-password-is-set-but-getting-access-denied-for-user-rootlocalhost

到目前已经确认不是volumes缓存的问题。



最终找到问题处在默认要执行的sql上，默认要执行的sql中创建了多余的系统数据库和表，可能是这些多余的数据库和表造成的问题。在sql中删除这些默认的数据库和表后，问题解决。

### docker-compose down 或 docker-compose stop后，再此启动，则无法访问“message from server: "Host '192.168.224.4' is not allowed to connect to this MySQL server"“

docker-compose down 会移除容器，但是不会移除volumes。

docker-compose stop 不会移除容器，也不会移除volumes。

### 如何在启动mysql时，自动导入数据库

#### Initializing a fresh instance

When a container is started for the first time, a new database with the specified name will be created and initialized with the provided configuration variables. Furthermore, it will execute files with extensions `.sh`, `.sql` and `.sql.gz` that are found in `/docker-entrypoint-initdb.d`. Files will be executed in alphabetical order. You can easily populate your `mysql` services by [mounting a SQL dump into that directory](https://docs.docker.com/engine/tutorials/dockervolumes/#mount-a-host-file-as-a-data-volume) and provide [custom images](https://docs.docker.com/reference/builder/) with contributed data. SQL files will be imported by default to the database specified by the `MYSQL_DATABASE` variable.

将sql文件挂载到容器的`/docker-entrypoint-initdb.d`目录下，然后设置环境变量`MYSQL_DATABASE`的值。

### 存在远程访问权限的问题:

mysql 默认只能本机登录，使用 `MYSQL_ROOT_HOST`环境变量 ，将其值修改为 `MYSQL_ROOT_HOST: '%'`

