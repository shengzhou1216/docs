(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{514:function(a,s,t){"use strict";t.r(s);var e=t(20),r=Object(e.a)({},(function(){var a=this,s=a.$createElement,t=a._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"docker部署springboot项目"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker部署springboot项目"}},[a._v("#")]),a._v(" "),t("strong",[a._v("Docker部署SpringBoot项目")])]),a._v(" "),t("ol",[t("li",[t("p",[a._v("打包springboot应用")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("./mvnw package\n")])])]),t("p",[a._v("打包完成后会在target目录下生成一个jar包 。")])]),a._v(" "),t("li",[t("p",[a._v("测试是否能够运行")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("java -jar target/*.jar\n")])])])]),a._v(" "),t("li",[t("p",[a._v("编写Dockerfile")]),a._v(" "),t("div",{staticClass:"language-dockerfile extra-class"},[t("pre",{pre:!0,attrs:{class:"language-dockerfile"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("FROM")]),a._v(" openjdk"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v("8"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("-")]),a._v("jdk"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("-")]),a._v("alpine\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("ARG")]),a._v(" JAR_FILE=target/*.jar\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("COPY")]),a._v(" $"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("JAR_FILE"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(" app.jar\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("ENTRYPOINT")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"java"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"-jar"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"/app.jar"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n")])])])]),a._v(" "),t("li",[t("p",[a._v("构建镜像")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("docker build -t "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("image name"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n")])])])]),a._v(" "),t("li",[t("p",[a._v("启动容器")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("docker run --name "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("container name"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" -p "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("8080")]),a._v(":8080 "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("image name"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" \n")])])])])]),a._v(" "),t("h3",{attrs:{id:"其他"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#其他"}},[a._v("#")]),a._v(" 其他")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("指定profiles:")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("docker run -e spring.profiles.active"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v("test\n")])])]),t("p",[a._v("通过"),t("code",[a._v("-e")]),a._v("指定环境变量即可")])])])])}),[],!1,null,null,null);s.default=r.exports}}]);