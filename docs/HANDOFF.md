# Handoff Guide
<!-- security-log-analysis mainline -->

## 中文版

### 这份文档是干什么的

这份文档是给“下一台电脑上的 Codex”看的。

目标不是重复项目说明书，而是把这个仓库现在的真实状态、已经做过的决策、不能再犯的坑、以及接下来该怎么继续，直接写清楚。这样换电脑以后，不需要依赖历史聊天记录，也能接着往下做。

### 当前主线

当前仓库只保留一条主线：

- `安全日志分析`

不要再做、不要再恢复、也不要再在文档里提：

- 已废弃的实验产品线

这条线已经被明确放弃，并且已经从：
- 代码
- 路由
- 页面
- 文档
- GitHub 提交说明

里清理掉了。

### 当前系统定位

这套系统现在更像：

- 一个可训练的安全日志分析工作台

而不是：

- 一个泛化“安全产品平台”
- 一个独立的攻防编排平台

它的核心链路是：

```text
原始安全材料 / 外部平台数据
-> 文件解析或平台接入
-> 归一化
-> Planner 分类
-> Skill 执行
-> 风险判断
-> 中文安全报告
-> 历史 / 调查 / 学习沉淀
```

### 当前保留的重点能力

- 安全日志分析 UI
- 文件上传与统一输入
- 归一化后分析
- 技能页
- 连接页
- 学习页
- Bitdefender GravityZone 接入
- JumpServer 分析链
- Host baseline case
- AppSec whitebox 基础能力
- 中文安全报告

### 当前 UI / 产品边界

#### 1. 只能继续做“安全日志分析”

后续任何页面改动，都只允许发生在：

- `概览`
- `输入`
- `技能`
- `连接`
- `学习`

不要再新增第二套一级产品域。

#### 2. 不要再跨模块顺手改

这是之前明确踩过的大坑。

如果用户说：

- 只改 `技能`
- 只改 `学习`
- 只改 `概览`

那就只能改对应页面，不要顺手去统一别的页面，不要再“全站顺一下”。

#### 3. 改共享层时必须双重验证

如果改了：

- `app/static/app.js`
- `app/static/index.html`
- `app/static/styles.css`

这种共享层代码，必须至少验证：

- `安全日志分析 -> 概览`
- `安全日志分析 -> 输入`
- `安全日志分析 -> 技能`
- `安全日志分析 -> 连接`
- `安全日志分析 -> 学习`

否则很容易出现：

- 页面一直加载中
- 切换无效
- 文案绑定打断初始化

### 当前页面设计约束

#### 概览

- 只保留真正的总览信息
- 信息要少
- 多用图形和状态
- 不要再塞成长段说明
- `近期报告` 只保留最近 `5` 份

#### 技能

- `全部能力` 走模块折叠展开
- 模块先折叠，再展开看具体能力
- 模块和卡片配色直接抄 `概览`
- 不要再恢复搜索框
- 不要恢复多余图标和二次目录条

#### 学习

- `学习规则` 已删除，不要恢复
- 页面只保留 `学习反馈`
- 顶部 3 张摘要卡平铺
- 只保留最近 `5` 条反馈
- 配色直接抄 `概览`

#### 连接

- 更像动作入口
- 不要做成调试台
- 用户进来应先看到：
  - 是否已连接
  - 当前有哪些可分析内容
  - 下一步该点哪里

### 当前分析与学习主线

后续推进方式固定为：

1. 用户给样本文件
2. 用户给目标输出例子
3. 先对齐分类与 Skill 路由
4. 再对齐报告结构和措辞
5. 最后把 case / 训练文档 / 学习一起沉淀

不要一上来就试图“让系统自动聪明”。

### 当前样本驱动策略

优先按 case 推进：

- `Case 001 - Host Baseline`
- `Case 002 - JumpServer`

尤其是 JumpServer，后续重点是：

- 单文件分类对齐
- 多文件综合报告对齐
- 下载报告和页面报告一致
- 严格按目标样本结构输出

### 已经明确记录过的坑

#### 1. 不能拿别的项目文件做当前项目复现

之前出现过把别的项目文件灌进运行历史，污染：

- 最近结果
- 历史记录
- 报告

以后如果需要复现：

- 只能用本项目样本
- 或者隔离 scratch 测试

#### 2. 大文件不能只看“能不能读”

尤其是：

- Excel
- 大 CSV
- 审计报表

必须额外确认：

- 表头归一化是否正确
- 行数是否被静默裁剪
- 分析层吃的是完整数据，不是预览数据

#### 3. 上传与分析链不能串线

已经踩过：

- 新文件上传后旧 raw input 没清
- 单文件分析和旧会话串线

所以以后默认检查：

- 上传新文件前清空旧输入
- 分析按钮防重入
- 没有待分析内容时不能乱跑

#### 4. 前端大文本不能写进 localStorage

之前出现过：

- `megaeth-raw-input-v2 exceeded the quota`

所以现在默认策略是：

- 不把大块原始输入写进浏览器持久化存储

### 新电脑怎么接手

新电脑上要做的，不只是 clone 仓库，还要先读这份文档。

推荐顺序：

1. clone 仓库
2. 打开这份 `docs/HANDOFF.md`
3. 再看：
   - `README.md`
   - `docs/SYSTEM_DESIGN.md`
   - `docs/SKILL_LIBRARY.md`
   - `docs/CASE_LIBRARY.md`
4. 启动服务
5. 用一个安全日志分析样本做回归

### 启动与验证

```bash
cd '/Users/lei/Documents/New project/megaeth-ai-security-rebuild'
./start.sh
curl http://127.0.0.1:8011/health
```

通过后再做：

```bash
./.venv/bin/python -m pytest tests/test_api.py -q
```

### GitHub 约束

后续任何改动同步到 GitHub 时，都要确保：

- 不再出现已废弃实验线相关内容
- GitHub 文件列表右侧的“最后提交说明”不能再挂旧实验线提交

如果用户在 GitHub 上还能看到旧实验线说明，不要只看文件内容，要同时检查：

- 目录级最后提交
- 文件级最后提交

### 继续推进时的默认原则

- 只做 `安全日志分析`
- 不跨模块顺手改
- 样本驱动
- 报告质量优先贴目标样本
- 代码、测试、文档、GitHub 同步一起完成

---

## English Version

### Purpose

This document is for the next Codex session on another machine.

Its job is to preserve working context, design decisions, hard constraints, and known pitfalls so the project can continue without relying on old chat history.

### Current Product Scope

This repository now supports only one product surface:

- `Security Log Analysis`

Do not restore or continue:

- the retired experimental product line

That line has been intentionally retired and removed from code, routes, UI, docs, and GitHub-facing metadata.

### Current Product Shape

This system should be treated as:

- a trainable security log analysis workbench

not as:

- a general security platform
- a separate offensive-orchestration product

### Active Workflow

```text
Raw security materials / platform data
-> ingestion
-> normalization
-> planning
-> skill execution
-> risk judgment
-> Chinese security report
-> history / investigation / learning
```

### UI Boundary Rules

- Only continue work inside the security-log-analysis surface.
- Do not add another top-level product domain.
- Do not “clean up the whole site” when the request is page-specific.
- If shared frontend files are changed, re-verify all five security-log-analysis pages.

### Page Rules

- `Overview`: keep it short, visual, and summary-only.
- `Skills`: module-first folding layout; colors should match `Overview`.
- `Learning`: only `Feedback`; `Rules` is intentionally removed.
- `Connections`: action-first, not a diagnostics wall.

### Delivery Pattern

Future work should continue in this order:

1. sample files
2. target output example
3. classification and skill routing
4. report structure and language
5. case / training / learning sync

### Known Pitfalls

- Never use files from another project to reproduce bugs in this project.
- For large files, validate normalized headers and full-row participation, not just parsability.
- Clear stale raw input before new analysis.
- Do not persist large raw inputs in browser local storage.

### Machine Handoff

On a new machine:

1. clone the repository
2. read this file first
3. read `README.md`
4. start the service
5. run one security-log-analysis sample as a smoke test

### Startup

```bash
cd '/Users/lei/Documents/New project/megaeth-ai-security-rebuild'
./start.sh
curl http://127.0.0.1:8011/health
./.venv/bin/python -m pytest tests/test_api.py -q
```

### GitHub Hygiene Rule

Do not leave traces from the retired experimental line in either:

- file content
- GitHub last-commit metadata on folders/files

### Default Continuation Rule

- security-log-analysis only
- sample-driven
- report quality aligned to target examples
- code, tests, docs, and GitHub sync must move together
