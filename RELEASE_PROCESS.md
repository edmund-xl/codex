# Release Process

这份文档定义的是：以后怎么区分“日常 GitHub 同步”和“里程碑本机归档”。

## 目标

当前策略分成两层：

1. 日常迭代
2. 里程碑归档

### 日常迭代

每次普通更新后，默认完成：

1. 代码更新
2. 文档更新
3. 测试验证
4. 提交并推送到 GitHub

### 里程碑归档

只有在值得保留运行快照的节点，才额外完成：

1. 版本号更新
2. 生成压缩备份包
3. 生成 manifest

## 什么时候只推 GitHub

以下情况默认只做 GitHub 同步，不强制做本机归档：

- 普通 UI 微调
- 文案优化
- 小范围规则修正
- 单个接口调整
- 报告模板小改

## 什么时候做本机归档

以下情况建议执行 `./release.sh`：

- 完成一轮较大的功能增强
- 接入新的外部平台
- 新增重要 skill / 模块
- Memory 学习机制明显增强
- 报告质量有阶段性提升
- 你明确要求保留一个运行快照

## 每次更新后必须检查的内容

### A. 功能变化

如果新增或改变了这些内容，就必须更新文档：

- 新的页面结构
- 新的 API
- 新的分析路径
- 新的 Memory 行为
- 新的 skill / module
- 新的训练协作方式
- 新的跨机器运行方式

### B. 训练变化

如果新增了以下内容，也必须在本轮记录里说明：

- 新学会的报告类型
- 新修正的误判模式
- 新增的分类规则
- 新增的报告模板逻辑
- 新增的纠偏流程

## 需要同步更新的文件

### 一定要更新

- `CHANGELOG.md`
- `VERSION`（仅里程碑归档时强制）

### 按内容更新

- `README.md`
- `SYSTEM_DESIGN.md`
- `FEATURE_SNAPSHOT.md`
- `REBUILD_GUIDE.md`
- `TRAINING_WORKFLOW.md`
- `PORTABLE_TRANSFER.md`

## 推荐工作流

### 日常工作流

每次正常更新完成后，默认由 AI 直接执行：

```bash
git add .
git commit -m "<summary>"
git push
```

### 里程碑工作流

当需要留下可恢复运行快照时，再执行：

```bash
cd '/Users/lei/Documents/New project/megaeth-ai-security-rebuild'
./release.sh
```

## release.sh 应该做什么

1. 检查关键文档是否存在
2. 运行测试
3. 生成一个发布 manifest
4. 生成 clean backup 压缩包
5. 输出产物路径
6. 自动删除更旧的归档，只保留最新和次新的两次

## 发布产物

每次发布后，至少应有：

- 一个新的备份包
- 一个新的 manifest 文件

归档目录默认放在：

- `~/Desktop/megaeth-ai-security-rebuild-archives/`

manifest 应该记录：

- 时间
- 版本号
- 文档列表
- 备份包路径
- data 文件状态

## 纪律要求

以后只要有“值得保留”的更新，就不要只改代码不留记录。

最低要求是：

- 日常更新：至少要推 GitHub
- 里程碑更新：再补 CHANGELOG、VERSION 和 release 产物

## 自动执行约定

从现在开始，后续默认行为是：

- 日常更新：我直接帮你推 GitHub
- 里程碑更新：我再额外执行一次 `./release.sh`

也就是说，不需要你每次手动再跑命令。
