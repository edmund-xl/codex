# Portable Transfer

这份文档专门说明如何把当前系统带到另一台机器继续运行。

## 1. 两种迁移方式

### 方式 A：只迁移代码

适合：

- 只想带走系统本体
- 不需要历史事件和学习记录

特点：

- 更干净
- 但 Memory 和历史是空的

### 方式 B：代码 + data 一起迁移

适合：

- 想把当前学习成果和历史也带走
- 想在另一台机器无缝继续训练

特点：

- 最接近原机器状态
- 包含：
  - reports
  - investigations
  - memory rules
  - memory feedback

## 2. 当前备份包

当前备份默认会生成到桌面归档目录：

- `~/Desktop/megaeth-ai-security-rebuild-archives/`

这是一个 clean 备份：

- 不包含 `.venv`
- 不包含缓存
- 包含代码和文档

## 3. 新机器运行步骤

```bash
tar -xzf megaeth-ai-security-rebuild-backup-*.tar.gz
cd megaeth-ai-security-rebuild
./start.sh
```

然后打开：

- `http://127.0.0.1:8010`

## 4. 如果要带学习记录

请额外把原目录下这些文件一起拷过去：

- `data/events.json`
- `data/raw_events.json`
- `data/reports.json`
- `data/investigations.json`
- `data/memory_rules.json`
- `data/memory_feedback.json`

## 5. 为什么 data 没直接打进默认仓库忽略之外

因为：

- 日常代码备份和分发通常不应强制带历史数据
- 但你要做“继续训练”时，`data/` 又非常重要

所以现在建议是：

- clean backup：默认用 `backup.sh`
- full migration：额外把 `data/*.json` 一起带走

## 6. 最推荐的迁移方式

如果你的目标是“到新机器上继续训练，不丢系统经验”，最推荐：

1. 用 `backup.sh` 带走代码与文档
2. 再单独复制整个 `data/` 目录

这样最稳。
