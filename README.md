# MegaETH AI Security Platform

这是当前可运行、可迁移、可继续训练的 MegaETH AI Security 工作副本。

目标：
- 统一接收安全材料
- 自动归一化、分类、规划分析能力、生成报告
- 通过 Memory 持续学习用户纠偏
- 保持可复制到其他机器直接运行
- 在目录丢失或损坏后，仍可依据文档由 AI 重建到接近一致的状态

## 当前目录结构

```text
megaeth-ai-security-rebuild/
├── app/
│   ├── api/          # FastAPI 路由
│   ├── core/         # pipeline / normalizer / planner / risk / report / memory
│   ├── models/       # 事件、发现、记忆数据模型
│   ├── skills/       # MegaETH skills 实现
│   ├── static/       # 前端页面、样式、交互逻辑
│   └── utils/        # 文件解析、JSON 存储
├── data/             # 本地事件、报告、调查、记忆数据
├── tests/            # 基础回归测试
├── README.md
├── CHANGELOG.md
├── VERSION
├── SYSTEM_DESIGN.md
├── FEATURE_SNAPSHOT.md
├── REBUILD_GUIDE.md
├── TRAINING_WORKFLOW.md
├── PORTABLE_TRANSFER.md
├── RELEASE_PROCESS.md
├── backup.sh
├── release.sh
├── start.sh
└── stop.sh
```

## 快速启动

```bash
cd '/Users/lei/Documents/New project/megaeth-ai-security-rebuild'
./start.sh
```

默认访问：

- [http://127.0.0.1:8010](http://127.0.0.1:8010)

如需改端口：

```bash
PORT=8011 ./start.sh
```

停止服务：

```bash
PORT=8010 ./stop.sh
```

## 推荐环境

- Python 3.13 优先
- Python 3.12 / 3.11 也可尝试
- 不建议直接使用 Python 3.14

## 文档索引

- 系统设计与架构：
  [SYSTEM_DESIGN.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/SYSTEM_DESIGN.md)
- 当前功能和 UI 快照：
  [FEATURE_SNAPSHOT.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/FEATURE_SNAPSHOT.md)
- 让 AI 重建同款系统：
  [REBUILD_GUIDE.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/REBUILD_GUIDE.md)
- 训练协作规范：
  [TRAINING_WORKFLOW.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/TRAINING_WORKFLOW.md)
- 跨机器迁移说明：
  [PORTABLE_TRANSFER.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/PORTABLE_TRANSFER.md)
- 发布与归档流程：
  [RELEASE_PROCESS.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/RELEASE_PROCESS.md)
- 版本变更：
  [CHANGELOG.md](/Users/lei/Documents/New%20project/megaeth-ai-security-rebuild/CHANGELOG.md)

## 当前能力范围

- 统一输入：文本输入 + 文件上传
- 文件类型：`csv / json / log / txt / yaml / yml / md / 文本型 pdf`
- 核心流程：`raw -> normalize -> planner -> skills -> risk -> report`
- 已接最小外部控制台入口：Bitdefender GravityZone API
  - network inventory
  - report catalog
  - incident capability probe
  - network / reports 可直接导入平台分析
- 模块覆盖：
  - CI/CD
  - Endpoint
  - Host
  - Cloud
  - EASM
  - Key
  - Identity
- 历史沉淀：
  - raw events
  - normalized events
  - reports
  - investigations
  - memory rules
  - memory feedback
- 前端工作区：
  - Overview
  - Intake
  - Skills
  - Memory
- 中英文切换
- 刷新后保留当前页面
- 本地 Memory 学习与纠偏

## Skill Library

当前这套平台按 MegaETH 自有能力模型组织 skill，现阶段已实现或预留了以下分析能力。

### CI/CD

- `megaeth.cicd.pr_security_review`
  - PR Security Review
  - 用于分析代码变更、危险执行流和供应链式变更风险
- `megaeth.cicd.secret_detection`
  - Secret Detection
  - 用于识别 AKIA、API key、private key 等敏感信息暴露

### Endpoint

- `megaeth.endpoint.process_anomaly`
  - Endpoint Process Anomaly
  - 用于处理 Bitdefender、EDR、incident report、端点检测记录等材料

### Host

- `megaeth.host.integrity_monitor`
  - Host Integrity Monitor
  - 用于分析主机基线、完整性、加固缺口和高风险控制缺失
- `megaeth.host.systemd_service_risk`
  - Service Risk Review
  - 用于分析 SSH、rsync、telnet、ICMP 等远程服务和暴露风险
- `megaeth.host.binary_tamper_review`
  - Binary Tamper Review
  - 预留给关键二进制完整性和篡改审查能力

### Cloud

- `megaeth.cloud.config_audit`
  - Cloud Config Audit
  - 用于分析云配置风险、控制缺失和配置漂移
- `megaeth.cloud.identity_surface`
  - Cloud Identity Surface
  - 用于分析云侧权限面、身份暴露面和 privilege surface

### EASM

- `megaeth.easm.asset_discovery`
  - Asset Discovery
  - 用于处理资产清单、IP 清单、域名资产等材料
- `megaeth.easm.service_scan`
  - Service Exposure
  - 用于处理端口、服务、网络暴露与可达性结果
- `megaeth.easm.tls_analysis`
  - TLS Analysis
  - 预留给 TLS、证书和传输安全姿态分析
- `megaeth.easm.vulnerability_scan`
  - Exposure Verification
  - 用于处理漏洞命中、暴露验证和外部可利用性材料
- `megaeth.easm.external_intelligence`
  - External Intelligence
  - 用于处理互联网情报、外部暴露线索和外部攻击面上下文

### Key

- `megaeth.key.kms_risk`
  - KMS Risk
  - 用于分析 KMS 调用、签名异常和密钥使用偏差
- `megaeth.key.private_key_exposure`
  - Private Key Exposure
  - 用于识别私钥、证书材料和敏感密钥暴露

### Identity

- `megaeth.identity.policy_risk_analysis`
  - Policy Risk Analysis
  - 用于分析策略膨胀、权限升级和 identity policy 风险
- `megaeth.identity.anomalous_access_review`
  - Anomalous Access Review
  - 用于分析异常访问行为和身份侧越权线索

## 设计原则

- 所有 skill 都遵循统一输入输出协议，方便被 planner 调度
- skill 的底层可以接真实工具、平台 API，或先用规则型适配器承接
- 同一类材料可以通过 Memory 学习不断修正分类与 skill 分配
- 报告层不直接暴露底层工具，而统一呈现为 MegaETH 自有分析能力

## 同步与归档

默认策略已经调整为：

- 日常更新：直接提交并推送到 GitHub，让远端始终保持最新
- 里程碑节点：再执行一次本机归档，生成可直接迁移的压缩包和 manifest

也就是说：

- GitHub 是主线版本库
- 桌面归档目录是里程碑级运行快照

适合做本机归档的场景：

- 完成一轮较大的 UI 调整
- 接入新的外部平台或新模块
- 报告质量、Memory、分类能力明显增强
- 你明确要求“留一个可恢复快照”

## 本机归档

生成便携备份包：

```bash
./backup.sh
```

生成一次完整里程碑发布记录：

```bash
./release.sh
```

备份包会输出到：

- `~/Desktop/megaeth-ai-security-rebuild-archives/megaeth-ai-security-rebuild-backup-<timestamp>.tar.gz`

发布记录会输出到：

- `~/Desktop/megaeth-ai-security-rebuild-archives/release-manifest-<timestamp>.md`

归档策略：

- 只保留最新和次新的 2 份备份包
- 只保留最新和次新的 2 份 manifest
- 更旧的归档会自动删除

备份会排除：

- `.venv`
- `__pycache__`
- `.pytest_cache`
- `dist`

## GitHub 同步约定

从当前版本开始，默认工作方式是：

- 每次值得保留的代码或文档变更，优先直接推送到 GitHub
- 本机归档不再每次都做
- 只有到里程碑节点才执行 `./release.sh`

当前远端仓库：

- [https://github.com/edmund-xl/codex](https://github.com/edmund-xl/codex)

## 重要说明

- `data/` 目录里的内容就是当前运行状态与学习记录。
- 如果你要把系统拷到别的机器继续使用，除了代码本身，`data/` 也应该一起带走。
- 如果你要在干净状态下测试，可以清空 `data/*.json`，但这会同时清掉历史与记忆。
