# Feature Snapshot

## 当前版本目标

把系统固定在一个“可继续训练、可迁移、可恢复”的状态上。

## 已实现功能

### 1. 输入与分析

- 单入口 Intake
- 文本输入
- 批量文件上传
- 可通过 API 接入外部控制台数据源
- 支持：
  - CSV
  - JSON
  - LOG
  - TXT
  - YAML / YML
  - MD
  - 文本型 PDF

### 2. 分析流程

- 归一化预览
- 技能分配预览
- 归一化后分析
- 结构化安全报告
- 上传文件逐条结果摘要
- 外部集成最小接入：
  - Bitdefender test
  - Bitdefender network inventory
  - Bitdefender reports catalog
  - Bitdefender incidents probe
  - Bitdefender network / reports import into platform pipeline

### 3. 平台总览

- 平台快照
- 近期报告
- 调查会话
- 历史摘要

### 4. 能力展示

- Installed Skills
- Skill Matrix
- 按模块查看能力目录

### 5. 记忆学习

- 自动 observation
- Memory Rules
- Memory Feedback
- 当前结果一键记忆
- 当前结果手工纠偏
- 手工规则优先
- 重复规则自动合并

### 6. 界面行为

- 左侧菜单切换
- 页面刷新后保留当前位置
- 中英文切换
- Refresh 按钮有状态反馈
- Intake 输入内容本地保留

## 当前 skill 模块

- CI/CD
- Endpoint
- Host
- Cloud
- EASM
- Key
- Identity

## 当前数据文件

- `data/raw_events.json`
- `data/events.json`
- `data/reports.json`
- `data/investigations.json`
- `data/memory_rules.json`
- `data/memory_feedback.json`

## 当前最重要的产品特征

1. 不是只跑固定脚本  
会根据材料类型和记忆规则选择合适能力。

2. 不是一次性分析页  
会把历史、调查、学习记录持续沉淀到本地。

3. 不是纯规则机  
允许用户通过真实样本持续纠偏和训练。

## 仍然属于后续增强的部分

- 更深的报告质量
- 更多真实工具后端接入
- OCR 型 PDF
- 定时任务
- 多机协同
- 更强的样本回归体系
