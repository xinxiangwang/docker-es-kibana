## 简介
此项目主要是用来学习在docker中部署nodejs连接elasticsearch，同时对elasticsearch进行相关配置

搭建了一个包括nodejs，elasticsearch(elasticsearch-analysis-ik， elasticsearch-head)，kibana 的环境， 使用nodemon实现本地修改代码 容器内node程序自动重启

#### 流程

1. 进入项目根目录 建立esData文件夹 执行docker-compose up

2. 运行成功访问在本地会有三个端口访问 localhost
   - 49160：nodejs应用程序
   - 9100：elasticsearch-head 查看es信息
   - 9200：elasticsearch 状态
   - 5601：kibana 操作界面

3. 爬取数据，如何爬取在下面

4. localhost:49160/zzz?page=50&keywords=java

   通过修改地址信息进行爬取， 爬取主要是京东书籍类的，page为爬取的总共页数

5. localhost:49160/search

   中文分词器，搜索关键字高亮体验

   

windows wsl2里面把这个项目跑起来后，wsl2的内存占用大概在2g~4g之间

kibana还不会用 所以没有对kibana数据做本地持久化

