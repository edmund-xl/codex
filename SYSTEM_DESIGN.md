# System Design

## 1. 产品定位

MegaETH AI Security Platform 是一个“材料驱动”的安全分析工作台。

用户不需要先把输入整理成严格标准格式，只需要把：
- 日志
- 报告
- CSV 导出
- JSON 事件
- 文本型 PDF

交给系统，平台会完成：

1. 原始材料解析
2. 归一化
3. 分类
4. 技能规划
5. 技能执行
6. 风险评分
7. 结构化报告
8. 调查会话沉淀
9. 记忆学习

## 2. 系统结构

### 后端

- `app/main.py`
  - FastAPI 入口
  - 静态资源挂载

- `app/api/routes.py`
  - 所有 API 路由

- `app/core/normalizer.py`
  - 把原始材料转换为 `NormalizedEvent`

- `app/core/planner.py`
  - 根据事件类型、来源、上下文和记忆，决定该调用哪些 MegaETH skills

- `app/core/pipeline.py`
  - 串联 normalizer / planner / skills / risk / report / history / memory

- `app/core/risk_engine.py`
  - 根据 findings 计算风险标签和分数

- `app/core/report_engine.py`
  - 生成结构化 `SecurityReport`

- `app/core/history.py`
  - 管理历史事件、调查会话、报告

- `app/core/memory_service.py`
  - 管理记忆规则和学习反馈

- `app/skills/implementations.py`
  - MegaETH skills 定义与执行

- `app/utils/file_ingest.py`
  - 文件解析和原始事件生成

- `app/integrations/bitdefender.py`
  - Bitdefender GravityZone 最小接入客户端
  - 负责认证、network inventory、endpoints、reports、incidents 探测

- `app/utils/store.py`
  - JSON 文件存储

### 前端

- `app/static/index.html`
  - 页面结构

- `app/static/styles.css`
  - 样式系统

- `app/static/app.js`
  - 视图切换、双语、数据渲染、上传、学习与纠偏逻辑

## 3. 核心数据流

### 路径 A：原始输入

`raw input -> memory recall -> normalize -> planner -> skills -> risk -> report -> history`

### 路径 B：文件上传

`file upload -> parse file -> raw event -> memory recall -> normalize -> planner -> skills -> risk -> report -> investigation session -> history`

### 路径 C：手工纠偏学习

`current result -> user correction -> memory rule + feedback -> next similar file uses learned rule`

### 路径 D：外部控制台导入

`integration api -> raw event -> normalize -> planner -> report -> history`

## 4. API 快照

### 基础

- `GET /`
- `GET /health`

### 技能与平台

- `GET /skills`
- `GET /skills/matrix`
- `GET /pipeline/overview`

### 历史与报告

- `GET /reports/recent`
- `GET /events/recent`
- `GET /events/raw`
- `GET /investigations/recent`
- `GET /history`

### 记忆系统

- `GET /memory/rules`
- `GET /memory/feedback`
- `POST /memory/learn/classification`

### 外部集成

- `POST /integrations/bitdefender/test`
- `POST /integrations/bitdefender/network`
- `POST /integrations/bitdefender/reports`
- `POST /integrations/bitdefender/incidents`
- `POST /integrations/bitdefender/network/import`
- `POST /integrations/bitdefender/reports/import`

### 分析入口

- `POST /normalize/preview`
- `POST /planner/preview`
- `POST /event`
- `POST /ingest/raw`
- `POST /ingest/files`

## 5. Memory 设计

Memory 不是泛泛“会记住一切”的模块，而是一个用于纠偏和复用分类经验的学习层。

### 记住的内容

- filename tokens
- header tokens
- content tokens
- parser profile
- expected source type
- expected event type
- preferred skills

### 学习来源

- 自动学习：
  - 一次成功分析后，写入 observation 与 auto memory
- 手工学习：
  - 用户确认“这次分类正确”
- 手工纠偏：
  - 用户指定正确 source type / event type / skills

### 优先级

- 手工纠偏规则优先于自动规则
- 相似规则会合并去重

## 6. 当前 UI 设计原则

### Overview

用于回答：
- 平台有没有在工作
- 最近出了什么结果
- 最近有什么调查会话
- 系统当前覆盖了哪些能力

### Intake

用于回答：
- 我把材料交给系统后，它会怎么理解
- 它准备调哪些分析能力
- 它最后给出什么报告
- 这次判断对不对，要不要让系统学会

### Skills

用于回答：
- 系统当前有哪些能力
- 每个能力属于哪个模块
- 每个模块的覆盖情况怎样

### Memory

用于回答：
- 系统已经学会了哪些纠偏经验
- 最近又吸收了哪些学习反馈

## 7. 当前约束

- 数据存储为本地 JSON，不是数据库
- skill 执行仍以本地逻辑和轻量适配为主，不是完整分布式任务系统
- PDF 仅支持文本型 PDF；扫描件 OCR 未接入
- 当前目标是“持续训练的工作台”，不是最终生产集群版本
