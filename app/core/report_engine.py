from __future__ import annotations

from datetime import datetime, timezone

from app.models.event import NormalizedEvent
from app.models.finding import Finding, SecurityReport


class ReportEngine:
    def _evidence(self, findings: list[Finding]) -> list[str]:
        entries: list[str] = []
        for finding in findings:
            for evidence in finding.evidence:
                for key, value in evidence.items():
                    if isinstance(value, list):
                        entries.append(f"{key}: {', '.join(str(item) for item in value[:4])}")
                    else:
                        entries.append(f"{key}: {value}")
        return entries[:6]

    def _actions(self, findings: list[Finding]) -> list[str]:
        out: list[str] = []
        for finding in findings:
            for action in finding.recommendations:
                if action not in out:
                    out.append(action)
        return out[:8]

    def _host_analysis(self, event: NormalizedEvent, findings: list[Finding]) -> dict[str, object]:
        rows = event.normalized_data.get("rows", [])
        row_count = len(rows) if isinstance(rows, list) else 0
        severe = 0
        service = 0
        standards: set[str] = set()
        if isinstance(rows, list):
            for row in rows:
                if not isinstance(row, dict):
                    continue
                try:
                    score = int(float(str(row.get("风险评分") or "0")))
                except ValueError:
                    score = 0
                title = str(row.get("发现名称") or row.get("\ufeff发现名称") or "")
                if score >= 95:
                    severe += 1
                if any(token in title.lower() for token in ("ssh", "telnet", "rsync", "icmp", "openssh", "rds", "printer")):
                    service += 1
                for item in str(row.get("合规标准") or "").split(","):
                    item = item.strip()
                    if item:
                        standards.add(item)
        return {
            "assessment": "这份材料反映的不是单点噪音，而是一批真实存在的主机基线与服务暴露风险。",
            "likely_issue": True,
            "verdict": "confirmed_posture_risk",
            "key_facts": [
                f"这是一份主机基线 / 加固风险清单，共包含 {row_count} 条风险记录。",
                f"其中 {severe} 条记录的风险评分在 95 分及以上，说明存在大量高优先级整改项。",
                f"至少 {service} 条记录涉及 SSH、远程访问或网络暴露等服务侧风险。",
                f"这些风险同时映射到了 {min(len(standards), 8)} 个合规或审计标准，影响面较广。",
            ],
            "probable_causes": [
                "受影响主机存在长期未完成的基线加固项，导致高风险配置持续暴露。",
                "同一套系统镜像或初始化模板可能在多台资产上继承了相同的安全缺口。",
                "审计与完整性监控组件缺失，说明主机监测基线本身也存在不足。",
            ],
            "why_flagged": "系统识别到这份材料是主机风险分析/加固清单，并从中提炼出高风险基线缺口与服务暴露问题。",
            "report_gaps": [],
            "quick_checks": [
                "优先核对前 10 条最高分风险项是否仍然处于活动状态，并确认受影响资产范围。",
                "检查 SSH、telnet、rsync、ICMP 重定向等远程访问相关项，确认是否暴露在不受控网络边界。",
                "确认 auditd、AIDE、日志权限、关键分区挂载选项等基线控制是否已经具备统一修复计划。",
            ],
            "escalation_conditions": [
                "如果这些基线缺口覆盖生产核心主机或跳板机，应立即按高优先级整改推进。",
                "如果远程访问、弱协议或默认端口暴露同时出现在外网可达资产上，应提升为外部暴露事件。",
                "如果审计、日志、完整性监控缺失与高危服务暴露叠加出现，应升级为系统性主机安全风险。",
            ],
            "professional_judgment": "从主机安全视角看，这更像一份需要分批治理的高风险基线缺口清单，而不是误报。",
        }

    def _generic_analysis(self, event: NormalizedEvent, findings: list[Finding]) -> dict[str, object]:
        if event.event_type == "integration_catalog":
            rows = event.normalized_data.get("rows", [])
            row_count = len(rows) if isinstance(rows, list) else 0
            return {
                "assessment": "这份材料更像安全平台中的目录或配置观测结果，本身不代表已经发现真实安全事件。",
                "likely_issue": False,
                "verdict": "informational_platform_observation",
                "key_facts": [
                    f"系统识别到这是一份来自外部安全平台的目录型材料，共包含 {row_count} 条记录。",
                    "这类输入更适合先作为平台上下文、资产线索或后续调查入口，而不是直接当作告警本身。",
                ],
                "probable_causes": [
                    "当前导入的是控制台中的报表目录、能力目录或管理视图，而不是具体威胁事件。",
                ],
                "why_flagged": "系统识别到这是来自集成平台的观测材料，因此先纳入平台上下文，而不是直接升级为安全事件。",
                "report_gaps": [],
                "quick_checks": [
                    "确认这些目录项中是否存在可进一步导出的真实扫描结果、事件报表或终端明细。",
                    "优先继续拉取带有详细结果的数据，而不是停留在目录层。",
                ],
                "escalation_conditions": [
                    "只有当后续导出的结果中包含真实告警、异常终端或高风险报表内容时，才应升级为安全事件分析。",
                ],
                "professional_judgment": "当前更像一份可继续下钻的平台目录观测，而不是已经确认的问题。",
            }
        if event.event_type == "endpoint_inventory":
            rows = event.normalized_data.get("rows", [])
            row_count = len(rows) if isinstance(rows, list) else 0
            managed_total = int(event.normalized_data.get("managed_total", 0) or 0)
            unmanaged_total = int(event.normalized_data.get("unmanaged_total", 0) or 0)
            groups_traversed = int(event.normalized_data.get("groups_traversed", 0) or 0)
            return {
                "assessment": "这份材料是 Bitdefender 资产树中的终端盘点结果，更适合用来确认设备覆盖面、管理状态和后续调查范围。",
                "likely_issue": False,
                "verdict": "informational_endpoint_inventory",
                "key_facts": [
                    f"系统递归遍历了 {groups_traversed} 个资产分组，共发现 {row_count} 台设备。",
                    f"其中 {managed_total} 台是受管设备，{unmanaged_total} 台是未受管或当前未生效策略的设备。",
                    "这份结果比公开 getEndpointsList 更接近控制台里的真实设备规模。",
                ],
                "probable_causes": [
                    "公开终端枚举接口没有返回完整设备列表，因此需要通过资产树递归下钻来还原真实设备覆盖范围。",
                ],
                "why_flagged": "系统识别到这是终端资产清单导入，而不是安全事件本身。",
                "report_gaps": [],
                "quick_checks": [
                    "优先检查未受管设备是否属于应受控但未成功纳管的资产。",
                    "将这份设备清单与最新安全报表中的主机做交叉映射，确认哪些设备已有安全记录但管理状态异常。",
                ],
                "escalation_conditions": [
                    "如果核心服务器或办公终端出现在未受管设备列表中，应升级为资产纳管风险。",
                ],
                "professional_judgment": "这条链更适合作为资产与终端覆盖基线，而不是直接判断攻击事件。",
            }
        if event.source_type == "endpoint":
            rows = event.normalized_data.get("rows", [])
            row_count = len(rows) if isinstance(rows, list) else 0
            malware = 0
            blocked_sites = 0
            network_attacks = 0
            affected_hosts: set[str] = set()
            if isinstance(rows, list):
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    event_type = str(row.get("事件类型") or row.get("event_type") or "")
                    module = str(row.get("模块") or row.get("module") or "")
                    host = str(row.get("端点名称") or row.get("endpoint_name") or row.get("端点 FQDN") or "").strip()
                    if host:
                        affected_hosts.add(host)
                    if "恶意软件检测" in event_type or "反恶意软件" in module:
                        malware += 1
                    if "阻止的网站" in event_type or "反钓鱼" in module:
                        blocked_sites += 1
                    if "网络攻击" in event_type or "网络攻击防护" in module:
                        network_attacks += 1
            return {
                "assessment": "这份材料是来自端点安全平台的真实检测结果导入，已经包含终端安全事件，而不是单纯目录信息。",
                "likely_issue": any(f.risk_level >= 4 for f in findings),
                "verdict": "endpoint_incident_review",
                "key_facts": [
                    f"系统已将材料识别为端点 / EDR / incident 类输入，共包含 {row_count} 条终端安全记录。",
                    f"当前提炼出 {len(findings)} 条与端点行为相关的发现，影响主机数至少为 {len(affected_hosts)} 台。",
                    f"报表中包含 {malware} 条恶意软件检测、{network_attacks} 条网络攻击防护记录，以及 {blocked_sites} 条阻止网站记录。",
                    f"当前最值得优先排查的是命中过恶意软件或 exploit-style 规则的终端，而不是普通设备允许记录。",
                ],
                "probable_causes": [
                    "终端侧恶意软件、防钓鱼或网络攻击防护模块已经命中过真实检测结果。",
                    "部分记录可能是被拦截或已删除的威胁，但仍需要结合终端上下文确认是否存在后续活动或重复命中。",
                ],
                "why_flagged": "材料中包含 Bitdefender 导出的终端检测记录，包括恶意软件检测、攻击签名和恶意网站拦截信号。",
                "report_gaps": [],
                "quick_checks": [
                    "优先核对出现恶意软件检测和网络攻击防护命中的主机，确认相关文件是否已删除、隔离或仍然存在。",
                    "补充原始 EDR / XDR 事件、命令行、父子进程关系，以及同一主机上是否有重复命中。",
                ],
                "escalation_conditions": [
                    "如果同一主机反复出现恶意软件检测或 exploit-style 网络攻击记录，应升级为真实端点事件排查。",
                    "如果关联到外联、提权、持久化、凭据访问或横向移动链路，应立即升级处置。",
                ],
                "professional_judgment": "这类 Bitdefender 安全审计报表已经足以作为真实端点风险线索的输入，后续重点在于分清哪些主机需要升级调查、哪些只是被成功阻断。",
            }
        if event.source_type == "github":
            return {
                "assessment": "这份材料属于代码或供应链输入，当前结论以代码风险和凭据暴露为主。",
                "likely_issue": any(f.risk_level >= 4 for f in findings),
                "verdict": "supply_chain_review",
                "key_facts": [
                    f"系统已选择 {len(findings)} 条与代码、依赖或秘密信息相关的发现。",
                ],
                "probable_causes": [
                    "代码变更、依赖变更或凭据暴露触发了供应链安全分析。",
                ],
                "why_flagged": "材料中存在代码执行、依赖风险或敏感信息暴露信号。",
                "report_gaps": [],
                "quick_checks": [
                    "确认相关代码变更是否经过安全评审。",
                    "检查是否需要对暴露凭据执行轮换。",
                ],
                "escalation_conditions": [
                    "如果相关代码已经进入生产分支，应立即升级修复优先级。",
                ],
                "professional_judgment": "这类材料需要尽快回到代码和发布流程中完成修复闭环。",
            }
        likely = any(f.risk_level >= 4 for f in findings)
        return {
            "assessment": "这份材料包含值得继续跟进的安全信号。" if findings else "当前材料里没有提炼出足够具体的发现。",
            "likely_issue": likely,
            "verdict": "likely_true_positive" if likely else "needs_review",
            "key_facts": [],
            "probable_causes": [],
            "why_flagged": "系统从原始材料中提取到可疑安全信号。",
            "report_gaps": [],
            "quick_checks": [],
            "escalation_conditions": [],
            "professional_judgment": "建议结合更多上下文继续判断。",
        }

    def build(
        self,
        event: NormalizedEvent,
        planner_reason: str,
        skills_selected: list[str],
        findings: list[Finding],
        risk: dict[str, float | int | str],
        observability: dict[str, object],
    ) -> SecurityReport:
        summary = (
            f"{findings[0].summary} The pipeline produced {len(findings)} finding(s) for {event.event_type}."
            if findings
            else "No concrete finding produced yet. Review raw tool output and ingestion quality."
        )
        analysis = self._host_analysis(event, findings) if event.source_type == "host" or event.event_type == "host_integrity" else self._generic_analysis(event, findings)
        return SecurityReport(
            event_id=event.event_id,
            event_type=event.event_type,
            source_type=event.source_type,
            planner_reason=planner_reason,
            skills_selected=skills_selected,
            findings=findings,
            summary=summary,
            assessment=str(analysis["assessment"]),
            likely_issue=bool(analysis["likely_issue"]),
            verdict=str(analysis["verdict"]),
            evidence_highlights=self._evidence(findings),
            recommended_actions=self._actions(findings),
            analyst_notes=[f"系统当前将该事件判断为 {event.event_type}，并执行了 {len(findings)} 条有效发现。"],
            key_facts=list(analysis["key_facts"]),
            probable_causes=list(analysis["probable_causes"]),
            why_flagged=str(analysis["why_flagged"]),
            report_gaps=list(analysis["report_gaps"]),
            quick_checks=list(analysis["quick_checks"]),
            escalation_conditions=list(analysis["escalation_conditions"]),
            professional_judgment=str(analysis["professional_judgment"]),
            top_risk_level=int(risk["top_risk_level"]),
            top_risk_label=str(risk["top_risk_label"]),
            overall_risk_score=float(risk["overall_risk_score"]),
            generated_at=datetime.now(timezone.utc).isoformat(),
            observability=observability,
        )
