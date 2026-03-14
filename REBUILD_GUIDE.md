# Rebuild Guide

这份文档的目标不是“介绍项目”，而是让 AI 或新协作者在目录损坏、文件丢失、需要迁移时，能够重建出高度相似的系统。

## 1. 重建目标

必须重建出一套具备以下特征的系统：

- FastAPI 后端
- 静态前端工作台
- 四个主页面：
  - Overview
  - Intake
  - Skills
  - Memory
- 单入口 Intake
- 文件上传与原始输入分析
- Memory 学习与纠偏机制
- 本地 JSON 存储
- 中英文切换
- 页面刷新保留当前页面

## 2. 关键产品要求

### Overview

- 展示平台快照
- 展示近期报告
- 展示调查会话
- 展示历史摘要
- 不要使用“开发者调试台”风格
- 用更产品化的安全工作台表达

### Intake

- 左侧：统一输入
- 右侧：技能分配预览 + 归一化结果
- 下方：Security Report + Uploaded File Runs
- 分析完成后能直接：
  - 记住当前分类
  - 纠正当前分类

### Skills

- 不是 JSON dump
- 不是配置项列表
- 要像按模块浏览的能力目录

### Memory

- 展示已经学到的规则
- 展示学习反馈
- 强调“系统会复用这些经验”

## 3. 后端必须包含的模块

- `EventNormalizer`
- `Planner`
- `SecurityPipeline`
- `RiskEngine`
- `ReportEngine`
- `HistoryService`
- `MemoryService`
- `file_ingest`
- `store`

## 4. 必须保留的 API

- `GET /health`
- `GET /skills`
- `GET /skills/matrix`
- `GET /pipeline/overview`
- `GET /reports/recent`
- `GET /events/recent`
- `GET /events/raw`
- `GET /investigations/recent`
- `GET /history`
- `GET /memory/rules`
- `GET /memory/feedback`
- `POST /memory/learn/classification`
- `POST /normalize/preview`
- `POST /planner/preview`
- `POST /event`
- `POST /ingest/raw`
- `POST /ingest/files`

## 5. Memory 行为要求

- 每次成功分析都可以自动 observation
- 用户可以确认“这次分类正确”
- 用户可以纠正“这次分类不对”
- 纠正时：
  - source type 用下拉
  - event type 用下拉
  - skills 可多选
  - 不需要让用户手写规则名
- 手工规则优先
- 相似规则自动合并

## 6. UI 行为要求

- 中英文切换
- 刷新浏览器保留当前页面
- Refresh 按钮有状态反馈：
  - 刷新中
  - 已更新
  - 重试
- 输入框内容可本地保留
- 不要在品牌区写“重建版”“开发进度”等字样

## 7. 文案风格要求

- 不要满屏暴露内部字段 id
- 尽量把：
  - source type
  - event type
  - skill id
  映射成用户可理解的产品语言
- Report 需要更像分析师报告，不要只是一堆 JSON 段落

## 8. 推荐重建步骤

1. 建 FastAPI 基础框架
2. 建立 models / core / utils / skills 目录
3. 实现 JSON 存储
4. 实现 raw -> normalize -> plan -> run -> report 主流程
5. 接 `memory_service`
6. 实现全部 API
7. 做静态前端四页面结构
8. 做双语和页面状态记忆
9. 做 Intake 的学习与纠偏
10. 用测试和真实样本回归

## 9. 目录丢失后的最低恢复标准

只要能恢复出以下能力，就算重建成功：

- 可以启动
- 可以上传文件
- 可以生成 normalized event
- 可以生成 planner preview
- 可以输出 Security Report
- 可以写入 history
- 可以写入 memory rules / feedback
- 可以在前端直接学习和纠偏

## 10. AI 重建提示词建议

如果以后需要让 AI 直接恢复这套系统，可使用下面这段说明作为重建提示的起点：

```text
请在一个新目录里重建 MegaETH AI Security Platform。

目标：
- FastAPI 后端 + 静态前端
- 四个主页面：Overview / Intake / Skills / Memory
- 单入口 Intake
- 文件上传、原始输入、归一化预览、技能分配预览、安全报告、上传结果摘要
- 本地 JSON 存储：events / raw_events / reports / investigations / memory_rules / memory_feedback
- 记忆系统支持自动 observation、手工确认、手工纠偏、规则去重、手工优先
- 页面支持中英文切换、刷新保留当前页面、Refresh 按钮状态反馈
- UI 要像产品化安全工作台，不要像开发者调试页

请优先恢复：
1. 数据结构与 API
2. Memory 行为
3. Intake 工作流
4. Overview / Skills / Memory 页面
5. README / CHANGELOG / VERSION / backup.sh
```
