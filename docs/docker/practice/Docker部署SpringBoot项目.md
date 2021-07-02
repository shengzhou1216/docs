# **Docker部署SpringBoot项目**

1. 打包springboot应用

   ```bash
   ./mvnw package
   ```

   打包完成后会在target目录下生成一个jar包 。

2. 测试是否能够运行

   ```bash
   java -jar target/*.jar
   ```

3. 编写Dockerfile

   ```dockerfile
   FROM openjdk:8-jdk-alpine
   ARG JAR_FILE=target/*.jar
   COPY ${JAR_FILE} app.jar
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```

4. 构建镜像

   ```bash
   docker build -t <image name> .
   ```

5. 启动容器

   ```bash
   docker run --name <container name> -p 8080:8080 <image name> 
   ```

### 其他

- 指定profiles:

  ```bash
  docker run -e spring.profiles.active=test
  ```

  通过`-e`指定环境变量即可