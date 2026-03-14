const sampleRaw = {
  source_type: "kms",
  asset_context: {
    asset_id: "kms-prod-1",
    asset_name: "signer-kms-prod",
    environment: "production",
    criticality: 5
  },
  payload: {
    action: "sign",
    caller: "svc-shadow",
    volume: 99
  }
};

const BITDEFENDER_DEFAULT_API_KEY = "cf56b6be22938008f4495cfa15844ae59796311595355e6bc2eb356a3fd5f37c";

const i18n = {
  zh: {
    brandCopy: "统一接收安全材料，自动完成归一化、技能分配、风险判断和记忆学习。",
    heroEyebrow: "MegaETH Security Platform",
    systemStatus: "System Status",
    checking: "检查中...",
    refresh: "刷新",
    refreshing: "刷新中...",
    refreshed: "已更新",
    retry: "重试",
    viewMeta: {
      overview: ["概览", "集中查看平台运行状态、最近分析结论和沉淀下来的调查记录。"],
      intake: ["输入", "从统一入口提交材料，让系统自动完成整理、判断和报告输出。"],
      skills: ["能力", "按模块查看平台已经接入的分析能力，以及它们当前负责的方向。"],
      integrations: ["集成", "在这里连接外部安全控制台，把可直接使用的资产、终端、报表和事件入口带入 MegaETH 工作流。"],
      memory: ["学习", "查看系统已经学会的分类经验，并把新的判断继续沉淀下来。"],
    },
    sidebarCopy: {
      overview: "先看系统是否真的在处理事件，再看最近报告、调查和沉淀记录。",
      intake: "从这里提交文件或原始材料，系统会自动归一化、分配技能并生成分析报告。",
      skills: "这里看平台已经接入哪些能力，以及每个模块当前覆盖了多少分析引擎。",
      integrations: "这里用来接外部安全平台。当前 Bitdefender 已接入可直接使用的资产清单、终端列表和报表目录链路。",
      memory: "这里是系统的纠偏记忆层。每次你确认正确分类后，都可以在这里让系统学会。",
    },
    ui: {
      overviewTitle: "平台概览",
      reportsTitle: "近期报告",
      investigationsTitle: "调查会话",
      historyTitle: "历史记录",
      bitdefenderTitle: "Bitdefender 接入",
      bitdefenderCopy: "这里接入的是 Bitdefender GravityZone。当前优先支持终端与资产清单、可用报表目录，以及最新报表的下载链接。",
      intakeInputTitle: "统一输入",
      uploadFiles: "上传文件",
      loadSample: "加载示例",
      previewNormalize: "只看归一化结果",
      previewPlan: "刷新预览",
      analyze: "归一化后分析",
      plannerTitle: "技能分配预览",
      normalizeTitle: "归一化结果",
      reportTitle: "安全报告",
      learnCorrect: "这次分类正确，记住它",
      learnWrong: "这次分类不对，我来纠正",
      correctionSkills: "选择正确的分析能力",
      saveCorrection: "保存这次纠正",
      fileRunsTitle: "上传执行记录",
      bitdefenderTest: "验证连接",
      bitdefenderNetwork: "读取终端与资产清单",
      bitdefenderImportNetwork: "导入终端资产到平台",
      bitdefenderReports: "读取可用报表目录",
      bitdefenderReportLinks: "获取最新报表下载链接",
      bitdefenderImportLatestReport: "导入最新报表内容",
      bitdefenderImportReports: "导入报表目录元数据",
      bitdefenderIncidents: "检查事件接口可用性",
      bitdefenderWaiting: "等待连接测试。",
      bitdefenderNoData: "还没有 Bitdefender 返回结果。",
      bitdefenderSummaryTitle: "Bitdefender 接入概况",
      bitdefenderInventoryTitle: "终端与资产清单预览",
      bitdefenderEndpointsTitle: "终端列表预览",
      bitdefenderEndpointApiNote: "这里显示的是 Bitdefender Network API 当前直接返回的受管终端列表，不等于历史报表里出现过的所有主机。",
      bitdefenderInventoryEndpointTitle: "递归资产树中发现的设备",
      bitdefenderManagedEndpointTitle: "受管设备详情预览",
      bitdefenderIncidentsTitle: "事件接口可用性",
      bitdefenderReportsTitle: "可用报表目录预览",
      bitdefenderDownloadLinksTitle: "最新报表下载链接",
      bitdefenderDefaultKeyNotice: "当前使用默认测试 key 直接连接 Bitdefender。现在更适合读取终端资产、可用报表，以及最新报表的下载入口。",
      integrationsSectionCopy: "这里集中管理外部安全控制台接入。当前已接入 Bitdefender 的资产清单、终端列表、报表目录和报表下载入口，后续还能继续扩展更多平台。",
      bitdefenderAssetNote: "这部分数据更适合用来做资产覆盖、终端状态和主机安全基线观察，而不是直接当成攻击事件。",
      bitdefenderReportsNote: "这里返回的是报表目录和下载入口，不是报表正文。真正的事件流更适合后续接入 Raw Events、Security Telemetry 或 Event Push。",
      bitdefenderLatestReportHostNote: "如果 API 终端列表是 0，但安全审计报表里已有很多主机，这通常表示公开 Network API 当前没有返回受管终端清单，而不是平台里真的没有主机。",
      installedSkillsTitle: "已接入能力",
      skillMatrixTitle: "能力矩阵",
      memoryLearnTitle: "从当前结果学习",
      memoryLearnCopy: "当你确认当前这份材料已经被正确归类后，可以把这次判断保存成系统经验。后续相似材料会优先参考这条经验。",
      memoryRulesTitle: "记忆规则",
      memoryFeedbackTitle: "学习反馈",
      loading: "加载中...",
      waitingPreview: "等待预览",
      waitingInput: "等待输入",
      waitingRun: "等待执行",
      noUploads: "还没有上传记录",
      ready: "就绪",
      noSkills: "当前还没有可展示的能力。",
      noMatrix: "当前还没有可展示的矩阵信息。",
      noMemoryRules: "还没有记忆规则。后续你纠正分类后，这里会逐步积累系统经验。",
      noMemoryFeedback: "还没有学习反馈记录。后续每次纠正分类，都会在这里留下痕迹。",
      noReports: "还没有报告记录。运行一次分析后，这里会显示最近生成的报告。",
      noInvestigations: "还没有调查会话。上传文件批次后，这里会自动出现会话记录。",
      noSummary: "暂无分析结论。",
      recentRunsTitle: "最近运行情况",
      recentRunsCopy: "这里看的是平台最近是否真的在处理事件，而不是仅仅完成了部署。",
      coverageTitle: "能力覆盖范围",
      coverageCopy: "这里看系统目前具备哪些能力，以及这些能力是否已经接入真实执行逻辑。",
      flowTitle: "处理流程说明",
      flowCopy: "用法上只需要把材料交给系统，但平台内部会根据输入类型走不同路径。",
      historySummaryTitle: "运行沉淀",
      historySummaryCopy: "这里保留平台已经沉淀下来的记录数量，用来确认这套系统不是一次性页面状态。",
      plannerSummaryTitle: "系统准备调用这些能力",
      plannerSummaryCopy: "系统会根据材料类型、来源线索和已学习经验，选择最合适的分析能力。",
      normalizeSummaryTitle: "标准化结果摘要",
      normalizeSummaryCopy: "系统已经把原始材料转换成统一事件结构，后续的技能规划和风险报告都基于这份标准化事件。",
      reportSummaryTitle: "结论判断",
      reportReasonTitle: "为什么会这样判断",
      reportFactsTitle: "关键事实",
      reportCauseTitle: "可能原因",
      reportActionsTitle: "建议动作",
      reportChecksTitle: "快速核查",
      reportEscalationTitle: "升级条件",
      reportJudgmentTitle: "专业判断",
      reportEvidenceTitle: "关键证据",
      reportNextStepsTitle: "建议先做的动作",
      reportSnapshotTitle: "报告快照",
      reportsPathTitle: "本次分析能力",
      investigationsEnginesTitle: "本批次使用的分析能力",
      memoryPatternTitle: "系统记住的特征",
      memorySavedSkillsTitle: "系统会优先调用这些能力",
      overviewSnapshotTitle: "平台快照",
      memoryRuleCopy: "这条经验会在系统再次遇到相似材料时，帮助它更快走到正确的分析路径。",
      memoryFeedbackSavedSkills: "保存的优先能力",
      memoryRulePreferredSkills: "优先调用能力",
      memoryRuleHeaders: "记住的表头特征",
      latestAnalysis: "最近一次分析",
      latest: "最新",
      searchSkillsPlaceholder: "搜索能力 / 模块 / 引擎",
      searchMemoryPlaceholder: "搜索学习记录 / 文件 / 事件",
      sourceTypePlaceholder: "选择正确的来源类型",
      eventTypePlaceholder: "选择正确的事件类型",
      menuOverview: "概览",
      menuIntake: "输入",
      menuSkills: "能力",
      menuIntegrations: "集成",
      menuMemory: "学习",
      viewSkillDirectoryTitle: "能力目录",
      viewSkillDirectoryCopy: "按模块查看当前平台已经接入的分析能力，并快速定位对应引擎。",
      viewLearningCopy: "这里会沉淀系统学到的分类经验，后续相似材料会优先复用这些判断。",
      uploadRunsWaiting: "还没有上传分析记录",
      learningReadyHint: "在输入页完成一次分析后，这里可以直接把正确判断保存成系统经验。",
      overviewPulseCopy: "这里展示的是平台最近一次真实分析留下的运行脉搏。",
      platformActive: "平台活跃",
      platformWaiting: "等待材料",
      statusReadyAnalyze: "可开始分析",
      statusWaitingInput: "等待输入",
      plannerPlannedSkills: "本次预计调用",
      fileRunsSummaryCopy: "这里会按文件列出本次上传后的处理结果，方便你逐个回看。",
    }
  },
  en: {
    brandCopy: "Ingest security materials, normalize them automatically, route the right skills, score risk, and keep learning from feedback.",
    heroEyebrow: "MegaETH Security Platform",
    systemStatus: "System Status",
    checking: "Checking...",
    refresh: "Refresh",
    refreshing: "Refreshing...",
    refreshed: "Updated",
    retry: "Retry",
    viewMeta: {
      overview: ["Overview", "Review platform activity, recent conclusions, and the investigation records accumulated over time."],
      intake: ["Intake", "Submit materials through one entry point and let the system normalize, reason, and report automatically."],
      skills: ["Skills", "Browse active platform capabilities by module and see what each one is responsible for."],
      integrations: ["Integrations", "Connect external security consoles here and bring usable asset, endpoint, report, and event-entry data into the MegaETH workflow."],
      memory: ["Memory", "Review what the system has learned and keep teaching it with new decisions."],
    },
    sidebarCopy: {
      overview: "Start with platform activity, then review recent reports, investigations, and stored history.",
      intake: "Submit files or raw materials here. The system will normalize, select skills, and produce a report.",
      skills: "Review which capabilities are active and how each module is currently covered.",
      integrations: "Use this area to connect external security platforms. Bitdefender is already wired in for asset inventory, endpoint list, and report catalog workflows.",
      memory: "This is the correction memory layer. Each confirmed result can become future guidance.",
    },
    ui: {
      overviewTitle: "Platform Overview",
      reportsTitle: "Recent Reports",
      investigationsTitle: "Investigation Sessions",
      historyTitle: "History",
      bitdefenderTitle: "Bitdefender Integration",
      bitdefenderCopy: "This panel connects Bitdefender GravityZone. It currently supports asset and endpoint inventory, report catalog access, and the latest report download links.",
      intakeInputTitle: "Unified Intake",
      uploadFiles: "Upload Files",
      loadSample: "Load Sample",
      previewNormalize: "Preview Normalize",
      previewPlan: "Refresh Preview",
      analyze: "Normalize + Analyze",
      plannerTitle: "Skill Planning Preview",
      normalizeTitle: "Normalization Result",
      reportTitle: "Security Report",
      learnCorrect: "This classification is correct",
      learnWrong: "This classification is wrong",
      correctionSkills: "Choose the correct analysis skills",
      saveCorrection: "Save correction",
      fileRunsTitle: "Uploaded File Runs",
      bitdefenderTest: "Verify Connection",
      bitdefenderNetwork: "Load Asset And Endpoint Inventory",
      bitdefenderImportNetwork: "Import Asset Inventory Into Platform",
      bitdefenderReports: "Load Available Report Catalog",
      bitdefenderReportLinks: "Fetch Latest Report Download Links",
      bitdefenderImportLatestReport: "Import Latest Report Content",
      bitdefenderImportReports: "Import Report Catalog Metadata",
      bitdefenderIncidents: "Check Incident API Availability",
      bitdefenderWaiting: "Waiting for connection test.",
      bitdefenderNoData: "No Bitdefender response yet.",
      bitdefenderSummaryTitle: "Bitdefender Integration Snapshot",
      bitdefenderInventoryTitle: "Asset Inventory Preview",
      bitdefenderEndpointsTitle: "Endpoint List Preview",
      bitdefenderEndpointApiNote: "This shows the managed endpoint list returned directly by the Bitdefender Network API, not every host that may appear in historical reports.",
      bitdefenderInventoryEndpointTitle: "Devices discovered by recursive inventory traversal",
      bitdefenderManagedEndpointTitle: "Managed endpoint detail preview",
      bitdefenderIncidentsTitle: "Incident API Availability",
      bitdefenderReportsTitle: "Available Report Catalog Preview",
      bitdefenderDownloadLinksTitle: "Latest Report Download Links",
      bitdefenderDefaultKeyNotice: "The platform currently uses the default test key for Bitdefender. Right now the most useful paths are asset inventory, report catalog access, and report download links.",
      integrationsSectionCopy: "This area is the connection hub for external security consoles. Bitdefender already provides asset inventory, endpoint list, report catalog, and report download entry points.",
      bitdefenderAssetNote: "This data is best used for asset coverage, endpoint posture, and host-security baseline visibility rather than direct attack-event judgment.",
      bitdefenderReportsNote: "This returns report catalog metadata and download entry points, not the report body itself. For continuous event data, Raw Events, Security Telemetry, or Event Push are better next steps.",
      bitdefenderLatestReportHostNote: "If the API endpoint list is 0 while the latest security audit report already contains many hosts, it usually means the public Network API is not returning the managed endpoint list right now, not that the platform has no hosts.",
      installedSkillsTitle: "Installed Skills",
      skillMatrixTitle: "Skill Matrix",
      memoryLearnTitle: "Learn From Current Result",
      memoryLearnCopy: "When the current material has been classified correctly, save the judgment as platform memory so similar materials can reuse it later.",
      memoryRulesTitle: "Memory Rules",
      memoryFeedbackTitle: "Memory Feedback",
      loading: "Loading...",
      waitingPreview: "Waiting for preview",
      waitingInput: "Waiting for input",
      waitingRun: "Waiting to run",
      noUploads: "No uploaded runs yet",
      ready: "Ready",
      noSkills: "No capabilities are available to display yet.",
      noMatrix: "No matrix data is available to display yet.",
      noMemoryRules: "No memory rules yet. Once you correct classifications, the system will accumulate experience here.",
      noMemoryFeedback: "No learning feedback yet. Each correction will leave a trace here.",
      noReports: "No reports yet. Run an analysis and recent reports will appear here.",
      noInvestigations: "No investigation sessions yet. Upload a batch of files and sessions will appear here.",
      noSummary: "No analysis summary yet.",
      recentRunsTitle: "Recent Activity",
      recentRunsCopy: "This shows whether the platform is actively processing events, not just deployed.",
      coverageTitle: "Capability Coverage",
      coverageCopy: "This shows which capabilities are currently available and whether they are backed by real execution logic.",
      flowTitle: "Processing Flow",
      flowCopy: "You only need to hand materials to the platform, but the internal route changes based on input type.",
      historySummaryTitle: "Runtime Footprint",
      historySummaryCopy: "This preserves accumulated records so you can verify the system is more than a one-off page state.",
      plannerSummaryTitle: "The system plans to use these capabilities",
      plannerSummaryCopy: "The system chooses analysis capabilities based on the material type, source signals, and learned experience.",
      normalizeSummaryTitle: "Normalization Summary",
      normalizeSummaryCopy: "The system has converted the raw material into a unified event structure used by planning and reporting.",
      reportSummaryTitle: "Assessment",
      reportReasonTitle: "Why it was assessed this way",
      reportFactsTitle: "Key Facts",
      reportCauseTitle: "Likely Causes",
      reportActionsTitle: "Recommended Actions",
      reportChecksTitle: "Quick Checks",
      reportEscalationTitle: "Escalation Conditions",
      reportJudgmentTitle: "Professional Judgment",
      reportEvidenceTitle: "Key Evidence",
      reportNextStepsTitle: "Recommended Next Steps",
      reportSnapshotTitle: "Report Snapshot",
      reportsPathTitle: "Analysis capabilities used",
      investigationsEnginesTitle: "Analysis capabilities used in this batch",
      memoryPatternTitle: "Remembered pattern",
      memorySavedSkillsTitle: "The system will prefer these capabilities",
      overviewSnapshotTitle: "Platform Snapshot",
      memoryRuleCopy: "This experience helps the system reach the right analysis path more quickly when similar materials appear again.",
      memoryFeedbackSavedSkills: "Saved preferred skills",
      memoryRulePreferredSkills: "Preferred skills",
      memoryRuleHeaders: "Remembered header patterns",
      latestAnalysis: "Latest analysis",
      latest: "Latest",
      searchSkillsPlaceholder: "Search capabilities / module / engine",
      searchMemoryPlaceholder: "Search learned patterns / file / event",
      sourceTypePlaceholder: "Choose the correct source type",
      eventTypePlaceholder: "Choose the correct event type",
      menuOverview: "Overview",
      menuIntake: "Intake",
      menuSkills: "Skills",
      menuIntegrations: "Integrations",
      menuMemory: "Memory",
      viewSkillDirectoryTitle: "Capability Directory",
      viewSkillDirectoryCopy: "Browse active platform capabilities by module and quickly locate the matching engine.",
      viewLearningCopy: "The system stores learned classification experience here so similar materials can reuse these judgments later.",
      uploadRunsWaiting: "No uploaded analysis runs yet",
      learningReadyHint: "Once one analysis is completed in Intake, you can save the correct judgment here as platform memory.",
      overviewPulseCopy: "This area reflects the operating pulse left by the most recent real analysis run.",
      platformActive: "Platform active",
      platformWaiting: "Waiting for material",
      statusReadyAnalyze: "Ready to analyze",
      statusWaitingInput: "Waiting for input",
      plannerPlannedSkills: "Planned capabilities",
      fileRunsSummaryCopy: "This area lists the result of each uploaded file so you can review them one by one.",
    }
  },
};

const categoryLabels = {
  cicd: "CI/CD",
  endpoint: "Endpoint",
  host: "Host",
  cloud: "Cloud",
  easm: "EASM",
  key: "Key",
  identity: "Identity",
};

const engineLabels = {
  pr_security_review: "MegaETH PR Review Engine",
  secret_detection: "MegaETH Secret Detection Engine",
  process_anomaly: "MegaETH Endpoint Behavior Engine",
  integrity_monitor: "MegaETH Host Integrity Engine",
  systemd_service_risk: "MegaETH Service Posture Engine",
  binary_tamper_review: "MegaETH Binary Review Engine",
  config_audit: "MegaETH Cloud Configuration Engine",
  asset_discovery: "MegaETH Asset Discovery Engine",
  service_scan: "MegaETH Exposure Surface Engine",
  tls_analysis: "MegaETH TLS Posture Engine",
  kms_risk: "MegaETH KMS Assurance Engine",
  private_key_exposure: "MegaETH Key Exposure Engine",
  policy_risk_analysis: "MegaETH Policy Reasoning Engine",
  anomalous_access_review: "MegaETH Access Review Engine",
  identity_surface: "MegaETH Cloud Identity Engine",
  vulnerability_scan: "MegaETH Exposure Verification Engine",
  external_intelligence: "MegaETH External Intelligence Engine",
};

const skillLabels = {
  "megaeth.cicd.pr_security_review": { zh: "MegaETH PR 安全审查能力", en: "MegaETH PR Security Review" },
  "megaeth.cicd.secret_detection": { zh: "MegaETH 密钥暴露检测能力", en: "MegaETH Secret Detection" },
  "megaeth.endpoint.process_anomaly": { zh: "MegaETH 端点行为分析能力", en: "MegaETH Endpoint Behavior Analysis" },
  "megaeth.host.integrity_monitor": { zh: "MegaETH 主机完整性分析能力", en: "MegaETH Host Integrity Analysis" },
  "megaeth.host.systemd_service_risk": { zh: "MegaETH 服务姿态分析能力", en: "MegaETH Service Posture Analysis" },
  "megaeth.host.binary_tamper_review": { zh: "MegaETH 二进制完整性审查能力", en: "MegaETH Binary Integrity Review" },
  "megaeth.cloud.config_audit": { zh: "MegaETH 云配置风险能力", en: "MegaETH Cloud Configuration Risk" },
  "megaeth.easm.asset_discovery": { zh: "MegaETH 外部资产发现能力", en: "MegaETH External Asset Discovery" },
  "megaeth.easm.service_scan": { zh: "MegaETH 服务暴露分析能力", en: "MegaETH Service Exposure Analysis" },
  "megaeth.easm.tls_analysis": { zh: "MegaETH TLS 姿态分析能力", en: "MegaETH TLS Posture Analysis" },
  "megaeth.key.kms_risk": { zh: "MegaETH KMS 风险分析能力", en: "MegaETH KMS Risk Analysis" },
  "megaeth.key.private_key_exposure": { zh: "MegaETH 私钥暴露检测能力", en: "MegaETH Private Key Exposure Detection" },
  "megaeth.identity.policy_risk_analysis": { zh: "MegaETH 身份策略风险分析能力", en: "MegaETH Identity Policy Risk Analysis" },
  "megaeth.identity.anomalous_access_review": { zh: "MegaETH 异常访问审查能力", en: "MegaETH Anomalous Access Review" },
  "megaeth.cloud.identity_surface": { zh: "MegaETH 云身份面分析能力", en: "MegaETH Cloud Identity Surface Analysis" },
  "megaeth.easm.vulnerability_scan": { zh: "MegaETH 外部漏洞验证能力", en: "MegaETH External Vulnerability Validation" },
  "megaeth.easm.external_intelligence": { zh: "MegaETH 外部情报关联能力", en: "MegaETH External Intelligence Correlation" },
};

const storageKeys = {
  activeView: "megaeth-active-view-v2",
  rawInput: "megaeth-raw-input-v2",
  language: "megaeth-language-v1",
};

const legacyStorageKeys = ["megaeth-active-view", "megaeth-raw-input"];

const intakeState = {
  rawEvent: null,
  normalizedEvent: null,
  plannerPreview: null,
  report: null,
  uploadBatch: null,
};

const uiState = {
  skills: [],
  matrix: {},
  memoryRules: [],
  memoryFeedback: [],
  bitdefender: null,
  language: "zh",
};

const sourceTypeOptions = ["host", "endpoint", "easm", "cloud", "kms", "github", "identity", "key", "cicd"];
const eventTypeOptions = [
  "host_integrity",
  "endpoint_process",
  "external_asset",
  "service_exposure",
  "cloud_configuration",
  "kms_access",
  "github_pr",
  "identity_policy",
];

const sourceTypeLabels = {
  zh: {
    host: "主机",
    endpoint: "端点",
    easm: "外部攻击面",
    cloud: "云环境",
    kms: "密钥管理",
    github: "代码仓库",
    identity: "身份权限",
    key: "密钥材料",
    cicd: "CI/CD",
  },
  en: {
    host: "Host",
    endpoint: "Endpoint",
    easm: "EASM",
    cloud: "Cloud",
    kms: "KMS",
    github: "Code Repository",
    identity: "Identity",
    key: "Key Material",
    cicd: "CI/CD",
  },
};

const eventTypeLabels = {
  zh: {
    host_integrity: "主机完整性风险",
    endpoint_process: "端点进程异常",
    external_asset: "外部资产线索",
    service_exposure: "服务暴露风险",
    cloud_configuration: "云配置风险",
    kms_access: "KMS 访问事件",
    github_pr: "代码变更审查",
    identity_policy: "身份策略风险",
  },
  en: {
    host_integrity: "Host Integrity Risk",
    endpoint_process: "Endpoint Process Anomaly",
    external_asset: "External Asset Signal",
    service_exposure: "Service Exposure Risk",
    cloud_configuration: "Cloud Configuration Risk",
    kms_access: "KMS Access Event",
    github_pr: "Code Change Review",
    identity_policy: "Identity Policy Risk",
  },
};

function fillSelectOptions(selectId, values, placeholder, formatter = (value) => value) {
  const select = document.getElementById(selectId);
  if (!select) return;
  const current = select.value;
  select.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = placeholder;
  select.appendChild(emptyOption);
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = formatter(value);
    if (value === current) option.selected = true;
    select.appendChild(option);
  });
}

function t(key) {
  return i18n[uiState.language][key];
}

function applyLanguage() {
  const lang = uiState.language;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.getElementById("brand-copy").textContent = t("brandCopy");
  document.getElementById("hero-eyebrow").textContent = t("heroEyebrow");
  document.getElementById("system-status-label").textContent = t("systemStatus");
  const ui = t("ui");
  document.getElementById("section-overview-title").textContent = ui.overviewTitle;
  document.getElementById("section-reports-title").textContent = ui.reportsTitle;
  document.getElementById("section-investigations-title").textContent = ui.investigationsTitle;
  document.getElementById("section-history-title").textContent = ui.historyTitle;
  document.getElementById("section-bitdefender-title").textContent = ui.bitdefenderTitle;
  document.getElementById("bitdefender-copy").textContent = ui.bitdefenderCopy;
  document.getElementById("section-intake-input-title").textContent = ui.intakeInputTitle;
  document.getElementById("upload-files-label").textContent = ui.uploadFiles;
  document.getElementById("load-sample").textContent = ui.loadSample;
  document.getElementById("preview-normalize").textContent = ui.previewNormalize;
  document.getElementById("preview-plan").textContent = ui.previewPlan;
  document.getElementById("analyze").textContent = ui.analyze;
  document.getElementById("section-planner-title").textContent = ui.plannerTitle;
  document.getElementById("section-normalize-title").textContent = ui.normalizeTitle;
  document.getElementById("section-report-title").textContent = ui.reportTitle;
  document.getElementById("learn-current-memory-intake").textContent = ui.learnCorrect;
  document.getElementById("show-correction-form").textContent = ui.learnWrong;
  document.getElementById("correction-skills-label").textContent = ui.correctionSkills;
  document.getElementById("save-correction").textContent = ui.saveCorrection;
  document.getElementById("section-file-runs-title").textContent = ui.fileRunsTitle;
  document.getElementById("run-bitdefender-test").textContent = ui.bitdefenderTest;
  document.getElementById("run-bitdefender-network").textContent = ui.bitdefenderNetwork;
  document.getElementById("import-bitdefender-network").textContent = ui.bitdefenderImportNetwork;
  document.getElementById("run-bitdefender-reports").textContent = ui.bitdefenderReports;
  document.getElementById("run-bitdefender-report-links").textContent = ui.bitdefenderReportLinks;
  document.getElementById("import-bitdefender-latest-report").textContent = ui.bitdefenderImportLatestReport;
  document.getElementById("import-bitdefender-reports").textContent = ui.bitdefenderImportReports;
  document.getElementById("run-bitdefender-incidents").textContent = ui.bitdefenderIncidents;
  document.getElementById("section-installed-skills-title").textContent = ui.installedSkillsTitle;
  document.getElementById("section-skill-matrix-title").textContent = ui.skillMatrixTitle;
  document.getElementById("section-memory-learn-title").textContent = ui.memoryLearnTitle;
  document.getElementById("memory-learn-copy").textContent = ui.memoryLearnCopy;
  document.getElementById("section-memory-rules-title").textContent = ui.memoryRulesTitle;
  document.getElementById("section-memory-feedback-title").textContent = ui.memoryFeedbackTitle;
  document.getElementById("refresh-overview").textContent = t("refresh");
  document.getElementById("refresh-reports").textContent = t("refresh");
  document.getElementById("refresh-investigations").textContent = t("refresh");
  document.getElementById("refresh-history").textContent = t("refresh");
  document.getElementById("refresh-skills").textContent = t("refresh");
  document.getElementById("refresh-matrix").textContent = t("refresh");
  document.getElementById("refresh-memory-rules").textContent = t("refresh");
  document.getElementById("refresh-memory-feedback").textContent = t("refresh");
  document.getElementById("skills-search").placeholder = ui.searchSkillsPlaceholder;
  document.getElementById("memory-search").placeholder = ui.searchMemoryPlaceholder;
  fillSelectOptions("correction-source-type", sourceTypeOptions, ui.sourceTypePlaceholder, sourceTypeLabel);
  fillSelectOptions("correction-event-type", eventTypeOptions, ui.eventTypePlaceholder, eventTypeLabel);
  populateCorrectionSkillOptions(intakeState.plannerPreview?.skills_to_execute || []);
  document.getElementById("lang-zh").classList.toggle("active", lang === "zh");
  document.getElementById("lang-en").classList.toggle("active", lang === "en");
  document.querySelectorAll("[data-view='overview']").forEach((node) => node.textContent = ui.menuOverview);
  document.querySelectorAll("[data-view='intake']").forEach((node) => node.textContent = ui.menuIntake);
  document.querySelectorAll("[data-view='skills']").forEach((node) => node.textContent = ui.menuSkills);
  document.querySelectorAll("[data-view='integrations']").forEach((node) => node.textContent = ui.menuIntegrations);
  document.querySelectorAll("[data-view='memory']").forEach((node) => node.textContent = ui.menuMemory);
  if (!intakeState.rawEvent && !intakeState.normalizedEvent && !intakeState.plannerPreview && !intakeState.report) {
    document.getElementById("intake-status").textContent = ui.ready;
    document.getElementById("memory-learn-status").textContent = ui.learningReadyHint;
  }
  setView(localStorage.getItem(storageKeys.activeView) || "overview");
  renderPlannerPreview(intakeState.plannerPreview);
  renderNormalizeOutput(intakeState.normalizedEvent);
  renderReport(intakeState.report);
  renderFileRuns(intakeState.uploadBatch);
  if (uiState.skills.length) renderSkills(uiState.skills);
  if (Object.keys(uiState.matrix).length) renderMatrix(uiState.matrix);
  if (uiState.memoryRules.length) renderMemoryRules(uiState.memoryRules);
  if (uiState.memoryFeedback.length) renderMemoryFeedback(uiState.memoryFeedback);
  renderBitdefender(uiState.bitdefender);
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.detail || data.error || text);
  return data;
}

function clearLegacyLocalState() {
  legacyStorageKeys.forEach((key) => localStorage.removeItem(key));
}

function setView(view) {
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === view);
  });
  document.getElementById("view-title").textContent = t("viewMeta")[view][0];
  document.getElementById("view-copy").textContent = t("viewMeta")[view][1];
  document.getElementById("sidebar-copy").textContent = t("sidebarCopy")[view] || "";
  localStorage.setItem(storageKeys.activeView, view);
}

function setHealth(text, tone = "idle") {
  const badge = document.getElementById("health-badge");
  badge.textContent = text;
  badge.className = `health-badge ${tone}`;
}

function healthText(kind) {
  if (uiState.language === "zh") {
    if (kind === "healthy") return "正常";
    if (kind === "normalizing") return "归一化中...";
    if (kind === "planning") return "规划中...";
    if (kind === "analyzing") return "分析中...";
    if (kind === "uploading") return "上传中...";
  }
  if (kind === "healthy") return "Healthy";
  if (kind === "normalizing") return "Normalizing...";
  if (kind === "planning") return "Planning...";
  if (kind === "analyzing") return "Analyzing...";
  if (kind === "uploading") return "Uploading...";
  return kind;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createEmptyState(text) {
  return el("div", "empty-state", text);
}

function formatTime(value) {
  if (!value) return "暂无记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN");
}

function moduleLabel(category) {
  return categoryLabels[category] || String(category || "Unknown");
}

function sourceTypeLabel(value) {
  return sourceTypeLabels[uiState.language][value] || String(value || (uiState.language === "zh" ? "未知" : "Unknown"));
}

function eventTypeLabel(value) {
  return eventTypeLabels[uiState.language][value] || String(value || (uiState.language === "zh" ? "未知事件" : "Unknown event"));
}

function engineLabel(adapter) {
  return engineLabels[adapter] || "MegaETH Analysis Engine";
}

function skillLabel(skillId) {
  const labels = skillLabels[skillId];
  return labels ? labels[uiState.language] : skillId;
}

function renderChips(values, tone = "") {
  const row = el("div", "token-list");
  values.forEach((value) => {
    row.appendChild(el("span", `token ${tone}`.trim(), value));
  });
  return row;
}

function updateButtonState(buttonId, label, disabled = false) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.textContent = label;
  button.disabled = disabled;
}

async function withRefreshState(buttonId, loader) {
  updateButtonState(buttonId, t("refreshing"), true);
  try {
    await loader();
    updateButtonState(buttonId, t("refreshed"), false);
    setTimeout(() => updateButtonState(buttonId, t("refresh"), false), 900);
  } catch (error) {
    updateButtonState(buttonId, t("retry"), false);
    throw error;
  }
}

function renderSkills(skills) {
  uiState.skills = skills;
  populateCorrectionSkillOptions();
  const root = document.getElementById("skills-output");
  root.innerHTML = "";
  const keyword = (document.getElementById("skills-search")?.value || "").trim().toLowerCase();
  const filter = document.getElementById("skills-filter")?.value || "all";
  const filtered = skills.filter((skill) => {
    const matchesFilter = filter === "all" || skill.category === filter;
    const haystack = [
      skill.skill_name,
      skill.description,
      skill.skill_id,
      moduleLabel(skill.category),
      engineLabel(skill.adapter),
    ].join(" ").toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    return matchesFilter && matchesKeyword;
  });
  if (!filtered.length) {
    root.appendChild(createEmptyState(t("ui").noSkills));
    return;
  }
  const grouped = filtered.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  Object.entries(grouped).forEach(([category, items]) => {
    const section = el("section", "matrix-group");
    const head = el("div", "matrix-group-head");
    head.appendChild(el("h4", "", moduleLabel(category)));
    head.appendChild(el("span", "matrix-count", uiState.language === "zh" ? `${items.length} 个能力` : `${items.length} capabilities`));
    section.appendChild(head);
    section.appendChild(el("p", "section-note", t("ui").viewSkillDirectoryCopy));
    items.forEach((skill) => {
      const card = el("article", "skill-card");
      card.appendChild(el("h4", "", skill.skill_name));
      card.appendChild(el("p", "card-copy", skill.description));

      const chips = el("div", "chip-row");
      chips.appendChild(el("span", "chip good", skill.stage === "tool-backed" ? (uiState.language === "zh" ? "已接入真实执行逻辑" : "Real execution connected") : (uiState.language === "zh" ? "待接入" : "Pending integration")));
      chips.appendChild(el("span", "chip", uiState.language === "zh" ? `引擎：${engineLabel(skill.adapter)}` : `Engine: ${engineLabel(skill.adapter)}`));
      chips.appendChild(el("span", "chip note", uiState.language === "zh" ? "统一平台能力" : "Unified platform capability"));
      card.appendChild(chips);
      section.appendChild(card);
    });
    root.appendChild(section);
  });
}

function populateCorrectionSkillOptions(selected = []) {
  const select = document.getElementById("correction-skills");
  if (!select) return;
  const current = new Set(selected.length ? selected : Array.from(select.selectedOptions).map((option) => option.value));
  select.innerHTML = "";
  uiState.skills.forEach((skill) => {
    const option = document.createElement("option");
    option.value = skill.skill_id;
    option.textContent = `${skill.skill_name} · ${moduleLabel(skill.category)}`;
    option.selected = current.has(skill.skill_id);
    select.appendChild(option);
  });
}

function renderMatrix(matrix) {
  uiState.matrix = matrix;
  const root = document.getElementById("matrix-output");
  root.innerHTML = "";
  const entries = Object.entries(matrix);
  if (!entries.length) {
    root.appendChild(createEmptyState(t("ui").noMatrix));
    return;
  }
  entries.forEach(([category, skills]) => {
    const group = el("section", "matrix-group");
    const head = el("div", "matrix-group-head");
    head.appendChild(el("h4", "", moduleLabel(category)));
    head.appendChild(el("span", "matrix-count", uiState.language === "zh" ? `${skills.length} 个能力` : `${skills.length} capabilities`));
    group.appendChild(head);
    skills.forEach((skill) => {
      const item = el("div", "mini-skill");
      item.appendChild(el("h5", "", skill.skill_name));
      item.appendChild(el("p", "mini-copy", skill.description));
      const chips = el("div", "chip-row");
      chips.appendChild(el("span", "chip good", skill.stage === "tool-backed" ? (uiState.language === "zh" ? "状态：已接入" : "Status: Active") : (uiState.language === "zh" ? "状态：骨架能力" : "Status: Skeleton")));
      chips.appendChild(el("span", "chip", uiState.language === "zh" ? `引擎：${engineLabel(skill.adapter)}` : `Engine: ${engineLabel(skill.adapter)}`));
      item.appendChild(chips);
      group.appendChild(item);
    });
    root.appendChild(group);
  });
}

function renderMemoryRules(rules) {
  uiState.memoryRules = rules;
  const root = document.getElementById("memory-rules-output");
  root.innerHTML = "";
  const keyword = (document.getElementById("memory-search")?.value || "").trim().toLowerCase();
  const filtered = rules.filter((rule) => {
    const haystack = [
      rule.name,
      rule.expected_source_type,
      rule.expected_event_type,
      ...(rule.header_tokens || []),
      ...(rule.filename_tokens || []),
      ...(rule.preferred_skills || []),
    ].join(" ").toLowerCase();
    return !keyword || haystack.includes(keyword);
  });
  if (!filtered.length) {
    root.appendChild(createEmptyState(t("ui").noMemoryRules));
    return;
  }
  filtered.forEach((rule) => {
    const card = el("article", "memory-card");
    card.appendChild(el("h4", "", `${sourceTypeLabel(rule.expected_source_type)} · ${eventTypeLabel(rule.expected_event_type)}`));
    card.appendChild(el("p", "card-copy", t("ui").memoryRuleCopy));
    const patternChipRow = el("div", "chip-row");
    patternChipRow.appendChild(el("span", "chip note", uiState.language === "zh" ? "系统会在相似材料中自动复用这条经验" : "This experience will be reused for similar materials"));
    card.appendChild(patternChipRow);
    const meta = el("div", "meta-grid");
    [
      [uiState.language === "zh" ? "目标来源" : "Target source", sourceTypeLabel(rule.expected_source_type)],
      [uiState.language === "zh" ? "目标事件" : "Target event", eventTypeLabel(rule.expected_event_type)],
      [uiState.language === "zh" ? "命中次数" : "Matches", String(rule.usage_count || 0)],
      [uiState.language === "zh" ? "最近命中" : "Last matched", formatTime(rule.last_matched_at || rule.updated_at)],
    ].forEach(([label, value]) => {
      const item = el("div", "meta-item");
      item.appendChild(el("span", "meta-label", label));
      item.appendChild(el("span", "meta-value", value));
      meta.appendChild(item);
    });
    card.appendChild(meta);

    if (Array.isArray(rule.preferred_skills) && rule.preferred_skills.length) {
      card.appendChild(el("p", "card-copy", t("ui").memorySavedSkillsTitle));
      card.appendChild(renderChips(rule.preferred_skills.map((skillId) => skillLabel(skillId))));
    }
    if (Array.isArray(rule.header_tokens) && rule.header_tokens.length) {
      card.appendChild(el("p", "card-copy", t("ui").memoryPatternTitle));
      card.appendChild(renderChips(rule.header_tokens.slice(0, 8), "note"));
    }
    if (rule.notes) {
      const note = el("div", "meta-item");
      note.appendChild(el("span", "meta-label", uiState.language === "zh" ? "备注" : "Notes"));
      note.appendChild(el("span", "meta-value", rule.notes));
      card.appendChild(note);
    }
    root.appendChild(card);
  });
}

function renderMemoryFeedback(feedback) {
  uiState.memoryFeedback = feedback;
  const root = document.getElementById("memory-feedback-output");
  root.innerHTML = "";
  if (!feedback.length) {
    root.appendChild(createEmptyState(t("ui").noMemoryFeedback));
    return;
  }
  feedback.forEach((item) => {
    const card = el("article", "memory-card");
    card.appendChild(el("h4", "", `${sourceTypeLabel(item.expected_source_type)} · ${eventTypeLabel(item.expected_event_type)}`));
    card.appendChild(el("p", "card-copy", uiState.language === "zh" ? `这次学习来自文件：${item.filename || "未记录文件名"}` : `This learning record came from: ${item.filename || "Unknown file"}`));
    const memoryContext = el("div", "chip-row");
    memoryContext.appendChild(el("span", "chip note", uiState.language === "zh" ? "系统已经把这次人工判断沉淀为后续参考" : "This manual judgment has been retained for future reference"));
    card.appendChild(memoryContext);
    const meta = el("div", "meta-grid");
    [
      [uiState.language === "zh" ? "修正来源" : "Corrected source", sourceTypeLabel(item.expected_source_type)],
      [uiState.language === "zh" ? "修正事件" : "Corrected event", eventTypeLabel(item.expected_event_type)],
      [uiState.language === "zh" ? "记录时间" : "Recorded at", formatTime(item.created_at)],
      [uiState.language === "zh" ? "技能数量" : "Skill count", String((item.preferred_skills || []).length)],
    ].forEach(([label, value]) => {
      const cell = el("div", "meta-item");
      cell.appendChild(el("span", "meta-label", label));
      cell.appendChild(el("span", "meta-value", value));
      meta.appendChild(cell);
    });
    card.appendChild(meta);
    if (Array.isArray(item.preferred_skills) && item.preferred_skills.length) {
      card.appendChild(el("p", "card-copy", t("ui").memorySavedSkillsTitle));
      card.appendChild(renderChips(item.preferred_skills.map((skillId) => skillLabel(skillId))));
    }
    if (item.notes) {
      const note = el("div", "meta-item");
      note.appendChild(el("span", "meta-label", uiState.language === "zh" ? "备注" : "Notes"));
      note.appendChild(el("span", "meta-value", item.notes));
      card.appendChild(note);
    }
    root.appendChild(card);
  });
}

function renderOverview(data) {
  const root = document.getElementById("overview-output");
  root.innerHTML = "";
  const metrics = data.metrics || {};
  const library = data.skill_library || {};
  const categories = Object.entries(library.categories || {});

  const runCard = el("article", "summary-card");
  runCard.appendChild(el("h4", "", t("ui").recentRunsTitle));
  runCard.appendChild(el("p", "card-copy", t("ui").recentRunsCopy));
  const snapshotRow = el("div", "chip-row");
  snapshotRow.appendChild(el("span", "chip good", `${t("ui").overviewSnapshotTitle}: ${metrics.events_processed > 0 ? t("ui").platformActive : t("ui").platformWaiting}`));
  runCard.appendChild(snapshotRow);
  const runMeta = el("div", "kpi-strip");
  [
    [uiState.language === "zh" ? "已处理事件" : "Events processed", String(metrics.events_processed ?? 0)],
    [uiState.language === "zh" ? "已生成发现" : "Findings generated", String(metrics.findings_generated ?? 0)],
    [uiState.language === "zh" ? "最近一次处理" : "Last processed", formatTime(metrics.last_event_at)],
    [uiState.language === "zh" ? "当前状态" : "Status", metrics.events_processed > 0 ? t("ui").statusReadyAnalyze : t("ui").statusWaitingInput],
  ].forEach(([label, value]) => {
    const tile = el("div", "kpi-tile");
    tile.appendChild(el("span", "kpi-label", label));
    tile.appendChild(el("span", "kpi-value", value));
    runMeta.appendChild(tile);
  });
  runCard.appendChild(runMeta);

  const pulse = el("div", "chip-row");
  pulse.appendChild(el("span", "chip note", t("ui").overviewPulseCopy));
  runCard.appendChild(pulse);
  const libraryCard = el("article", "summary-card");
  libraryCard.appendChild(el("h4", "", t("ui").coverageTitle));
  libraryCard.appendChild(el("p", "card-copy", t("ui").coverageCopy));
  const libraryMeta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "总能力数" : "Total capabilities", String(library.total_skills ?? 0)],
    [uiState.language === "zh" ? "已接入能力" : "Active capabilities", String(library.tool_backed ?? 0)],
    [uiState.language === "zh" ? "骨架能力" : "Skeleton capabilities", String(library.skeleton_only ?? 0)],
    [uiState.language === "zh" ? "模块数量" : "Module count", String(categories.length)],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", value));
    libraryMeta.appendChild(item);
  });
  libraryCard.appendChild(libraryMeta);
  if (categories.length) {
    libraryCard.appendChild(el("p", "card-copy", uiState.language === "zh" ? "模块分布" : "Module distribution"));
    libraryCard.appendChild(
      renderChips(categories.map(([name, count]) => uiState.language === "zh" ? `${moduleLabel(name)} ${count} 个能力` : `${moduleLabel(name)} ${count} capabilities`), "note")
    );
  }
  const flowCard = el("article", "summary-card");
  flowCard.appendChild(el("h4", "", t("ui").flowTitle));
  flowCard.appendChild(el("p", "card-copy", t("ui").flowCopy));
  const flowList = el("ul", "bullet-list");
  [
    uiState.language === "zh" ? "标准化事件：分类 -> 规划 -> 执行 -> 聚合 -> 风险 -> 报告" : "Normalized event: classify -> plan -> execute -> aggregate -> risk -> report",
    uiState.language === "zh" ? "原始输入：归一化 -> 分类 -> 规划 -> 执行 -> 风险 -> 报告" : "Raw input: normalize -> classify -> plan -> execute -> risk -> report",
    uiState.language === "zh" ? "文件上传：解析 -> 归一化 -> 分类 -> 规划 -> 执行 -> 报告 -> 调查会话" : "File upload: parse -> normalize -> classify -> plan -> execute -> report -> investigation session",
  ].forEach((text) => {
    flowList.appendChild(el("li", "", text));
  });
  flowCard.appendChild(flowList);
  const lastRefresh = el("div", "chip-row");
  lastRefresh.appendChild(el("span", "chip latest", `${t("ui").latestAnalysis}: ${formatTime(metrics.last_event_at)}`));
  flowCard.appendChild(lastRefresh);
  const blocks = el("div", "overview-block");
  blocks.appendChild(runCard);
  blocks.appendChild(libraryCard);
  blocks.appendChild(flowCard);
  root.appendChild(blocks);
}

function renderPlannerPreview(data) {
  const root = document.getElementById("planner-output");
  root.innerHTML = "";
  if (!data) {
    root.className = "stack-list loading-copy";
    root.textContent = t("ui").waitingPreview;
    return;
  }
  root.className = "stack-list";
  const summary = el("article", "planner-card");
  summary.appendChild(el("h4", "planner-title", t("ui").plannerSummaryTitle));
  summary.appendChild(el("p", "card-copy", data.analysis_reason || t("ui").plannerSummaryCopy));
  const meta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "事件类型" : "Event type", data.classification?.classification?.map((value) => eventTypeLabel(value)).join(" / ") || (uiState.language === "zh" ? "未识别" : "Unidentified")],
      [uiState.language === "zh" ? "优先级" : "Priority", data.classification?.priority === "high" ? (uiState.language === "zh" ? "高" : "High") : data.classification?.priority === "low" ? (uiState.language === "zh" ? "低" : "Low") : (uiState.language === "zh" ? "常规" : "Normal")],
    [uiState.language === "zh" ? "调用技能数" : "Skill count", String((data.skills_to_execute || []).length)],
    [uiState.language === "zh" ? "规划状态" : "Planning status", (data.skills_to_execute || []).length ? (uiState.language === "zh" ? "已完成" : "Ready") : (uiState.language === "zh" ? "待确认" : "Pending")],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", value));
    meta.appendChild(item);
  });
  summary.appendChild(meta);
  if (Array.isArray(data.skills_to_execute) && data.skills_to_execute.length) {
    summary.appendChild(el("p", "card-copy", t("ui").plannerPlannedSkills));
    summary.appendChild(renderChips(data.skills_to_execute.map((skillId) => skillLabel(skillId))));
  }
  root.appendChild(summary);
}

function renderReport(report) {
  const root = document.getElementById("report-output");
  root.innerHTML = "";
  if (!report) {
    root.className = "stack-list loading-copy";
    root.textContent = t("ui").waitingRun;
    return;
  }
  root.className = "stack-list scroll";
  const top = el("article", "report-card");
  top.appendChild(el("h4", "", t("ui").reportSummaryTitle));
  top.appendChild(el("p", "card-copy", report.assessment || report.summary || t("ui").noSummary));
  const meta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "结论类型" : "Verdict", report.verdict || "needs_review"],
    [uiState.language === "zh" ? "风险级别" : "Risk level", report.top_risk_label || "info"],
    [uiState.language === "zh" ? "风险分数" : "Risk score", String(report.overall_risk_score ?? 0)],
    [uiState.language === "zh" ? "发现数量" : "Finding count", String((report.findings || []).length)],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", value));
    meta.appendChild(item);
  });
  top.appendChild(meta);
  if (Array.isArray(report.skills_selected) && report.skills_selected.length) {
    top.appendChild(el("p", "card-copy", uiState.language === "zh" ? "本次主要分析路径" : "Primary analysis path"));
    top.appendChild(renderChips(report.skills_selected.map((skillId) => skillLabel(skillId))));
  }
  root.appendChild(top);

  const narrative = [];
  if (report.professional_judgment) narrative.push(report.professional_judgment);
  if (Array.isArray(report.key_facts) && report.key_facts.length) narrative.push(report.key_facts[0]);
  if (Array.isArray(report.probable_causes) && report.probable_causes.length) narrative.push(report.probable_causes[0]);
  if (Array.isArray(report.recommended_actions) && report.recommended_actions.length) narrative.push(report.recommended_actions[0]);
  if (narrative.length) {
    const note = el("article", "report-card report-section emphasis");
    note.appendChild(el("h5", "", uiState.language === "zh" ? "分析摘要" : "Analyst Summary"));
    note.appendChild(el("p", "", narrative.join(uiState.language === "zh" ? " " : " ")));
    root.appendChild(note);
  }

  if (Array.isArray(report.evidence_highlights) && report.evidence_highlights.length) {
    const evidence = el("article", "report-card report-section");
    evidence.appendChild(el("h5", "", t("ui").reportEvidenceTitle));
    const list = el("ul", "bullet-list");
    report.evidence_highlights.forEach((item) => list.appendChild(el("li", "", item)));
    evidence.appendChild(list);
    root.appendChild(evidence);
  }

  if (Array.isArray(report.recommended_actions) && report.recommended_actions.length) {
    const nextSteps = el("article", "report-card report-section");
    nextSteps.appendChild(el("h5", "", t("ui").reportNextStepsTitle));
    const list = el("ul", "bullet-list");
    report.recommended_actions.slice(0, 5).forEach((item) => list.appendChild(el("li", "", item)));
    nextSteps.appendChild(list);
    root.appendChild(nextSteps);
  }

  const sections = [
    [t("ui").reportReasonTitle, report.why_flagged],
    [t("ui").reportFactsTitle, report.key_facts],
    [t("ui").reportCauseTitle, report.probable_causes],
    [t("ui").reportChecksTitle, report.quick_checks],
    [t("ui").reportEscalationTitle, report.escalation_conditions],
    [t("ui").reportJudgmentTitle, report.professional_judgment],
  ];
  sections.forEach(([title, value]) => {
    if (!value || (Array.isArray(value) && !value.length)) return;
    const section = el("article", "report-card report-section");
    section.appendChild(el("h5", "", title));
    if (Array.isArray(value)) {
      const list = el("ul", "bullet-list");
      value.forEach((item) => list.appendChild(el("li", "", item)));
      section.appendChild(list);
    } else {
      section.appendChild(el("p", "", value));
    }
    root.appendChild(section);
  });
}

function renderFileRuns(batch) {
  const root = document.getElementById("file-runs-output");
  root.innerHTML = "";
  if (!batch || !batch.results?.length) {
    root.className = "stack-list loading-copy";
    root.textContent = t("ui").uploadRunsWaiting;
    return;
  }
  root.className = "stack-list scroll";
  root.appendChild(el("p", "section-note", t("ui").fileRunsSummaryCopy));
  batch.results.forEach((item) => {
    const card = el("article", "run-card");
    card.appendChild(el("h5", "", item.filename || (uiState.language === "zh" ? "未命名文件" : "Unnamed file")));
    card.appendChild(
      el(
        "p",
        "card-copy",
        uiState.language === "zh"
          ? `${sourceTypeLabel(item.normalized_event?.source_type)} -> ${eventTypeLabel(item.normalized_event?.event_type)}，本次共分配 ${(item.planner_preview?.skills_to_execute || []).length} 个能力。`
          : `${sourceTypeLabel(item.normalized_event?.source_type)} -> ${eventTypeLabel(item.normalized_event?.event_type)}, with ${(item.planner_preview?.skills_to_execute || []).length} planned skill(s).`
      )
    );
    const meta = el("div", "meta-grid");
    [
      [uiState.language === "zh" ? "风险级别" : "Risk level", item.report?.top_risk_label || "info"],
      [uiState.language === "zh" ? "风险分数" : "Risk score", String(item.report?.overall_risk_score ?? 0)],
      [uiState.language === "zh" ? "解析方式" : "Parser", item.raw_event?.payload?.parser_profile === "csv-tabular" ? "CSV" : item.raw_event?.payload?.parser_profile === "pdf-text" ? "PDF" : item.raw_event?.payload?.parser_profile === "json-structured" ? "JSON" : (item.raw_event?.payload?.parser_profile || "generic")],
      [uiState.language === "zh" ? "发现数量" : "Finding count", String((item.report?.findings || []).length)],
    ].forEach(([label, value]) => {
      const m = el("div", "meta-item");
      m.appendChild(el("span", "meta-label", label));
      m.appendChild(el("span", "meta-value", value));
      meta.appendChild(m);
    });
    card.appendChild(meta);
    if (item.planner_preview?.skills_to_execute?.length) {
      card.appendChild(renderChips(item.planner_preview.skills_to_execute.map((skillId) => skillLabel(skillId))));
    }
    root.appendChild(card);
  });
}

function persistRawInput() {
  localStorage.setItem(storageKeys.rawInput, document.getElementById("raw-input").value);
}

function renderNormalizeOutput(data) {
  const output = document.getElementById("normalize-output");
  if (!data) {
    output.textContent = t("ui").waitingInput;
    return;
  }
  output.textContent = "";
  const wrapper = document.createElement("div");
  wrapper.className = "stack-list";

  const card = el("article", "normalize-card");
  card.appendChild(el("h4", "", t("ui").normalizeSummaryTitle));
  card.appendChild(el("p", "card-copy", t("ui").normalizeSummaryCopy));
  const meta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "事件 ID" : "Event ID", data.event_id || (uiState.language === "zh" ? "未生成" : "Not generated")],
    [uiState.language === "zh" ? "事件类型" : "Event type", eventTypeLabel(data.event_type)],
    [uiState.language === "zh" ? "来源类型" : "Source type", sourceTypeLabel(data.source_type)],
    [uiState.language === "zh" ? "事件时间" : "Timestamp", formatTime(data.timestamp)],
    [uiState.language === "zh" ? "资产名称" : "Asset name", data.asset_context?.asset_name || (uiState.language === "zh" ? "未提供" : "Not provided")],
    [uiState.language === "zh" ? "环境" : "Environment", data.asset_context?.environment || "unknown"],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", String(value)));
    meta.appendChild(item);
  });
  card.appendChild(meta);

  const highlights = [];
  if (data.normalized_data?.filename) highlights.push(uiState.language === "zh" ? `文件：${data.normalized_data.filename}` : `File: ${data.normalized_data.filename}`);
  if (data.normalized_data?.parser_profile) highlights.push(uiState.language === "zh" ? `解析方式：${data.normalized_data.parser_profile}` : `Parser: ${data.normalized_data.parser_profile}`);
  if (data.normalized_data?.row_count !== undefined) highlights.push(uiState.language === "zh" ? `记录数：${data.normalized_data.row_count}` : `Rows: ${data.normalized_data.row_count}`);
  if (data.normalized_data?.target) highlights.push(uiState.language === "zh" ? `目标：${data.normalized_data.target}` : `Target: ${data.normalized_data.target}`);
  if (highlights.length) {
    card.appendChild(el("p", "card-copy", uiState.language === "zh" ? "已提取关键信息" : "Extracted highlights"));
    card.appendChild(renderChips(highlights, "note"));
  }

  const details = document.createElement("details");
  details.className = "details-block";
  const summary = document.createElement("summary");
  summary.textContent = uiState.language === "zh" ? "查看完整标准化结构" : "View full normalized structure";
  details.appendChild(summary);
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(data, null, 2);
  details.appendChild(pre);
  card.appendChild(details);

  wrapper.appendChild(card);
  output.replaceChildren(wrapper);
}

function renderReports(reports) {
  const root = document.getElementById("reports-output");
  root.innerHTML = "";
  if (!reports.length) {
    root.appendChild(createEmptyState(t("ui").noReports));
    return;
  }
  reports.slice(0, 6).forEach((report) => {
    const card = el("article", `report-card ${report === reports[0] ? "priority" : ""}`.trim());
    card.appendChild(el("h4", "", report.report_title || (uiState.language === "zh" ? "最近分析结论" : "Recent assessment")));
    card.appendChild(el("p", "card-copy", report.professional_judgment || report.assessment || report.summary || (uiState.language === "zh" ? "暂无摘要。" : "No summary yet.")));
    const snapshot = el("div", "chip-row");
    snapshot.appendChild(el("span", "chip good", `${t("ui").reportSnapshotTitle}: ${report.verdict || "needs_review"}`));
    snapshot.appendChild(el("span", "chip", `${uiState.language === "zh" ? "风险" : "Risk"}: ${report.top_risk_label || "info"}`));
    card.appendChild(snapshot);
    const kpis = el("div", "kpi-strip");
    [
      [uiState.language === "zh" ? "风险级别" : "Risk level", report.top_risk_label || "info"],
      [uiState.language === "zh" ? "风险分数" : "Risk score", String(report.overall_risk_score ?? 0)],
      [uiState.language === "zh" ? "发现数量" : "Finding count", String((report.findings || []).length)],
      [uiState.language === "zh" ? "报告时间" : "Reported at", formatTime(report.generated_at || report.created_at)],
    ].forEach(([label, value]) => {
      const tile = el("div", "kpi-tile");
      tile.appendChild(el("span", "kpi-label", label));
      tile.appendChild(el("span", "kpi-value", value));
      kpis.appendChild(tile);
    });
    card.appendChild(kpis);
    if (report === reports[0]) {
      const latest = el("div", "chip-row");
      latest.appendChild(el("span", "chip latest", t("ui").latest));
      card.appendChild(latest);
    }
    if (Array.isArray(report.skills_selected) && report.skills_selected.length) {
      card.appendChild(el("p", "card-copy", t("ui").reportsPathTitle));
      card.appendChild(renderChips(report.skills_selected.map((skillId) => skillLabel(skillId))));
    }
    root.appendChild(card);
  });
}

function renderInvestigations(items) {
  const root = document.getElementById("investigations-output");
  root.innerHTML = "";
  const grouped = [];
  const seen = new Set();
  items.forEach((item) => {
    const firstFile = item.files?.[0] || {};
    const key = [
      firstFile.filename || "unknown",
      firstFile.event_type || "unknown",
      firstFile.source_type || "unknown",
    ].join("|");
    if (seen.has(key)) return;
    seen.add(key);
    grouped.push(item);
  });
  if (!grouped.length) {
    root.appendChild(createEmptyState(t("ui").noInvestigations));
    return;
  }
  grouped.slice(0, 4).forEach((item) => {
    const firstFile = item.files?.[0] || {};
    const card = el("article", "investigation-card");
    card.appendChild(el("h4", "", firstFile.filename || item.name || "未命名调查"));
    card.appendChild(
      el(
        "p",
        "card-copy",
        uiState.language === "zh"
          ? `${sourceTypeLabel(firstFile.source_type)} 材料已经进入 ${eventTypeLabel(firstFile.event_type)} 调查链路，本批次包含 ${item.file_count || 0} 个文件。`
          : `${sourceTypeLabel(firstFile.source_type)} material entered the ${eventTypeLabel(firstFile.event_type)} investigation path, and this batch contains ${item.file_count || 0} file(s).`
      )
    );
    const meta = el("div", "meta-grid");
    [
      [uiState.language === "zh" ? "最高风险" : "Top risk", item.top_risk_label || "info"],
      [uiState.language === "zh" ? "最高分数" : "Top score", String(item.top_risk_score ?? 0)],
      [uiState.language === "zh" ? "涉及技能数" : "Skills used", String((item.skills_seen || []).length)],
      [uiState.language === "zh" ? "创建时间" : "Created at", formatTime(item.created_at)],
    ].forEach(([label, value]) => {
      const cell = el("div", "meta-item");
      cell.appendChild(el("span", "meta-label", label));
      cell.appendChild(el("span", "meta-value", value));
      meta.appendChild(cell);
    });
    card.appendChild(meta);
    if (item === grouped[0]) {
      const latest = el("div", "chip-row");
      latest.appendChild(el("span", "chip latest", t("ui").latest));
      card.appendChild(latest);
    }
    if (Array.isArray(item.skills_seen) && item.skills_seen.length) {
      card.appendChild(el("p", "card-copy", t("ui").investigationsEnginesTitle));
      card.appendChild(renderChips(item.skills_seen.map((skillId) => skillLabel(skillId))));
    }
    root.appendChild(card);
  });
}

function renderHistory(data) {
  const root = document.getElementById("history-output");
  root.innerHTML = "";
  const reports = data.reports || [];
  const events = data.events || [];
  const rawEvents = data.raw_events || [];
  const investigations = data.investigations || [];
  const card = el("article", "history-card");
  card.appendChild(el("h4", "", t("ui").historySummaryTitle));
  card.appendChild(el("p", "card-copy", t("ui").historySummaryCopy));
  const meta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "标准化事件" : "Normalized events", String(events.length)],
    [uiState.language === "zh" ? "原始输入" : "Raw inputs", String(rawEvents.length)],
    [uiState.language === "zh" ? "报告记录" : "Reports", String(reports.length)],
    [uiState.language === "zh" ? "调查会话" : "Investigations", String(investigations.length)],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", value));
    meta.appendChild(item);
  });
  card.appendChild(meta);
  const compact = el("div", "compact-meta");
  compact.appendChild(el("span", "compact-stat", uiState.language === "zh" ? `最近事件：${formatTime(events[0]?.normalized_event?.timestamp || events[0]?.created_at)}` : `Latest event: ${formatTime(events[0]?.normalized_event?.timestamp || events[0]?.created_at)}`));
  compact.appendChild(el("span", "compact-stat", uiState.language === "zh" ? `最近输入：${formatTime(rawEvents[0]?.timestamp || rawEvents[0]?.created_at)}` : `Latest intake: ${formatTime(rawEvents[0]?.timestamp || rawEvents[0]?.created_at)}`));
  compact.appendChild(el("span", "compact-stat", uiState.language === "zh" ? `最近报告：${formatTime(reports[0]?.generated_at || reports[0]?.created_at)}` : `Latest report: ${formatTime(reports[0]?.generated_at || reports[0]?.created_at)}`));
  card.appendChild(compact);
  root.appendChild(card);
}

function renderBitdefender(data) {
  uiState.bitdefender = data;
  const root = document.getElementById("bitdefender-output");
  const status = document.getElementById("bitdefender-status");
  root.innerHTML = "";
  if (!data) {
    root.className = "stack-list";
    root.appendChild(el("p", "section-note", t("ui").integrationsSectionCopy));
    root.appendChild(createEmptyState(t("ui").bitdefenderNoData));
    status.textContent = t("ui").bitdefenderWaiting;
    return;
  }
  root.className = "stack-list";
  status.textContent = data.error
    ? (uiState.language === "zh" ? `最近结果：${data.error}` : `Latest result: ${data.error}`)
    : (uiState.language === "zh" ? "最近一次调用已完成。" : "Latest call completed.");
  root.appendChild(el("p", "section-note", t("ui").integrationsSectionCopy));

  const summary = el("article", "summary-card");
  summary.appendChild(el("h4", "", t("ui").bitdefenderSummaryTitle));
  summary.appendChild(el("p", "card-copy", t("ui").bitdefenderDefaultKeyNotice));
  const meta = el("div", "meta-grid");
  [
    [uiState.language === "zh" ? "公司 ID" : "Company ID", data.company_id || (uiState.language === "zh" ? "未发现" : "Not found")],
    [uiState.language === "zh" ? "资产清单总数" : "Inventory total", String(data.inventory_total ?? data.inventory?.total ?? 0)],
    [uiState.language === "zh" ? "端点总数（API 列表）" : "Endpoint total (API list)", String(data.endpoint_total ?? data.endpoints?.total ?? 0)],
    [uiState.language === "zh" ? "设备总数（递归资产树）" : "Devices from recursive inventory", String(data.inventory_endpoint_total ?? data.inventory_endpoints?.total ?? 0)],
    [uiState.language === "zh" ? "报表目录" : "Report catalog", data.report_error || (data.report_total ?? data.reports?.total ?? 0)],
    [uiState.language === "zh" ? "事件接口" : "Incident API", data.incident_error || (data.incident_total ?? data.incidents?.total ?? 0)],
  ].forEach(([label, value]) => {
    const item = el("div", "meta-item");
    item.appendChild(el("span", "meta-label", label));
    item.appendChild(el("span", "meta-value", String(value)));
    meta.appendChild(item);
  });
  summary.appendChild(meta);
  summary.appendChild(el("p", "card-copy", t("ui").bitdefenderAssetNote));
  summary.appendChild(el("p", "card-copy", t("ui").bitdefenderEndpointApiNote));
  if (data.latest_report_summary) {
    const latestSummary = el("div", "meta-grid");
    [
      [uiState.language === "zh" ? "最新报表记录数" : "Latest report rows", String(data.latest_report_summary.row_count ?? 0)],
      [uiState.language === "zh" ? "最新报表主机数" : "Latest report hosts", String(data.latest_report_summary.unique_host_count ?? 0)],
      [uiState.language === "zh" ? "恶意软件检测" : "Malware detections", String(data.latest_report_summary.malware_count ?? 0)],
      [uiState.language === "zh" ? "网络攻击记录" : "Network attacks", String(data.latest_report_summary.attack_count ?? 0)],
      [uiState.language === "zh" ? "阻止网站" : "Blocked sites", String(data.latest_report_summary.blocked_count ?? 0)],
    ].forEach(([label, value]) => {
      const item = el("div", "meta-item");
      item.appendChild(el("span", "meta-label", label));
      item.appendChild(el("span", "meta-value", String(value)));
      latestSummary.appendChild(item);
    });
    summary.appendChild(latestSummary);
    summary.appendChild(el("p", "card-copy", t("ui").bitdefenderLatestReportHostNote));
  }
  root.appendChild(summary);

  if (data.download_links || data.report_download_links) {
    const links = data.download_links || data.report_download_links;
    const reportCard = el("article", "summary-card");
    reportCard.appendChild(el("h4", "", t("ui").bitdefenderDownloadLinksTitle));
    reportCard.appendChild(el("p", "card-copy", t("ui").bitdefenderReportsNote));
    const entries = [
      [uiState.language === "zh" ? "最近实例" : "Latest instance", links.lastInstanceDownloadLink || links.lastInstanceDownloadUrl],
      [uiState.language === "zh" ? "全部实例" : "All instances", links.allInstancesDownloadLink || links.allInstancesDownloadUrl],
    ];
    entries.forEach(([label, value]) => {
      const line = el("div", "meta-item");
      line.appendChild(el("span", "meta-label", label));
      if (value) {
        const anchor = el("a", "meta-value", value);
        anchor.href = value;
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        line.appendChild(anchor);
      } else {
        line.appendChild(el("span", "meta-value", uiState.language === "zh" ? "当前未返回" : "Not returned"));
      }
      reportCard.appendChild(line);
    });
    if (data.report?.name) {
      reportCard.appendChild(el("p", "card-copy", `${uiState.language === "zh" ? "对应报表" : "Report"}: ${data.report.name}`));
    }
    root.appendChild(reportCard);
  }

  const sections = [
    [t("ui").bitdefenderInventoryTitle, data.inventory_items || data.inventory?.items || []],
    [t("ui").bitdefenderEndpointsTitle, data.endpoint_items || data.endpoints?.items || []],
    [t("ui").bitdefenderInventoryEndpointTitle, data.inventory_endpoint_items || data.inventory_endpoints?.items || []],
    [t("ui").bitdefenderManagedEndpointTitle, data.managed_endpoint_details_preview || []],
    [t("ui").bitdefenderReportsTitle, data.report_items || data.reports?.items || []],
    [t("ui").bitdefenderIncidentsTitle, data.incident_items || data.incidents?.items || []],
  ];

  sections.forEach(([title, items]) => {
    const card = el("article", "summary-card");
    card.appendChild(el("h4", "", title));
    if (!items.length) {
      card.appendChild(createEmptyState(uiState.language === "zh" ? "当前没有可展示结果。" : "No items available right now."));
      root.appendChild(card);
      return;
    }
    items.forEach((item) => {
      const line = el("div", "meta-item");
      line.appendChild(el("span", "meta-label", item.name || item.id || "item"));
      line.appendChild(el("span", "meta-value", [item.status, item.severity, item.companyId].filter(Boolean).join(" · ") || (uiState.language === "zh" ? "已返回" : "Returned")));
      card.appendChild(line);
    });
    root.appendChild(card);
  });
}

async function loadHealth() {
  try {
    await request("/health");
    setHealth(healthText("healthy"), "idle");
  } catch (error) {
    setHealth(String(error), "error");
  }
}

async function loadOverview() {
  renderOverview(await request("/pipeline/overview"));
}

async function loadReports() {
  renderReports(await request("/reports/recent"));
}

async function loadInvestigations() {
  renderInvestigations(await request("/investigations/recent"));
}

async function loadHistory() {
  renderHistory(await request("/history"));
}

async function loadSkills() {
  renderSkills(await request("/skills"));
}

async function loadMatrix() {
  renderMatrix(await request("/skills/matrix"));
}

async function loadMemoryRules() {
  renderMemoryRules(await request("/memory/rules"));
}

async function loadMemoryFeedback() {
  renderMemoryFeedback(await request("/memory/feedback"));
}

function bitdefenderPayload() {
  return { api_key: BITDEFENDER_DEFAULT_API_KEY };
}

async function runBitdefender(endpoint, statusCopy) {
  const status = document.getElementById("bitdefender-status");
  status.textContent = statusCopy;
  const data = await request(endpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bitdefenderPayload()),
  });
  renderBitdefender(data);
}

async function importBitdefender(endpoint, statusCopy) {
  const status = document.getElementById("bitdefender-status");
  status.textContent = statusCopy;
  const data = await request(endpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bitdefenderPayload()),
  });
  if (data.raw_event) {
    intakeState.rawEvent = data.raw_event;
    intakeState.normalizedEvent = data.normalized_event || null;
    intakeState.plannerPreview = data.planner_preview || null;
    intakeState.report = data.report;
    document.getElementById("raw-input").value = JSON.stringify(data.raw_event, null, 2);
    persistRawInput();
    renderNormalizeOutput(intakeState.normalizedEvent);
    renderPlannerPreview(intakeState.plannerPreview);
    renderReport(data.report);
    document.getElementById("intake-status").textContent = uiState.language === "zh" ? "Bitdefender 数据已导入平台并完成分析。" : "Bitdefender data has been imported into the platform and analyzed.";
    setView("intake");
  }
  await Promise.all([loadOverview(), loadReports(), loadInvestigations(), loadHistory(), loadMemoryRules(), loadMemoryFeedback()]);
  renderBitdefender(uiState.bitdefender);
}

async function previewNormalize() {
  setHealth(healthText("normalizing"), "busy");
  const payload = JSON.parse(document.getElementById("raw-input").value);
  persistRawInput();
  const data = await request("/normalize/preview", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  intakeState.rawEvent = payload;
  intakeState.normalizedEvent = data;
  renderNormalizeOutput(data);
  document.getElementById("intake-status").textContent = uiState.language === "zh" ? "归一化预览已生成。" : "Normalization preview is ready.";
  setHealth(healthText("healthy"), "idle");
  await Promise.all([loadMemoryRules(), loadMemoryFeedback()]);
  return data;
}

async function previewPlan() {
  setHealth(healthText("planning"), "busy");
  const normalized = await previewNormalize();
  const data = await request("/planner/preview", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(normalized)
  });
  intakeState.plannerPreview = data;
  renderPlannerPreview(data);
  document.getElementById("intake-status").textContent = uiState.language === "zh" ? "技能规划预览已生成。" : "Skill planning preview is ready.";
  setHealth(healthText("healthy"), "idle");
}

async function analyzeRaw() {
  setHealth(healthText("analyzing"), "busy");
  const payload = JSON.parse(document.getElementById("raw-input").value);
  persistRawInput();
  const report = await request("/ingest/raw", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  intakeState.rawEvent = payload;
  intakeState.report = report;
  renderReport(report);
  document.getElementById("intake-status").textContent = uiState.language === "zh" ? "分析已完成。" : "Analysis completed.";
  setHealth(healthText("healthy"), "idle");
  await Promise.all([loadOverview(), loadReports(), loadHistory(), loadMemoryRules(), loadMemoryFeedback()]);
}

async function uploadFiles(files) {
  if (!files.length) return;
  setHealth(uiState.language === "zh" ? `上传中：${files.length} 个文件...` : `Uploading ${files.length} file(s)...`, "busy");
  const body = new FormData();
  Array.from(files).forEach((file) => body.append("files", file));
  const data = await request("/ingest/files", { method: "POST", body });
  intakeState.uploadBatch = data;
  renderFileRuns(data);
  const first = data.results?.[0];
  if (first) {
    intakeState.rawEvent = first.raw_event;
    intakeState.normalizedEvent = first.normalized_event;
    intakeState.plannerPreview = first.planner_preview;
    intakeState.report = first.report;
    renderPlannerPreview(first.planner_preview);
    renderNormalizeOutput(first.normalized_event);
    renderReport(first.report);
    document.getElementById("raw-input").value = JSON.stringify(first.raw_event, null, 2);
    persistRawInput();
  }
  document.getElementById("intake-status").textContent = uiState.language === "zh" ? `已处理 ${data.count} 个文件。` : `Processed ${data.count} file(s).`;
  setHealth(healthText("healthy"), "idle");
  await Promise.all([loadOverview(), loadReports(), loadInvestigations(), loadHistory(), loadMemoryRules(), loadMemoryFeedback()]);
}

async function learnCurrentMemory() {
  if (!intakeState.rawEvent || !intakeState.normalizedEvent || !intakeState.plannerPreview) {
    document.getElementById("memory-learn-status").textContent = uiState.language === "zh" ? "先在 Intake 里完成一次正确分析，再保存记忆。" : "Complete a correct analysis in Intake before saving memory.";
    document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "先完成一次分析，再让系统记住这次分类。" : "Finish one analysis first, then let the system remember it.";
    return;
  }
  const payload = {
    raw_event: intakeState.rawEvent,
    expected_source_type: intakeState.normalizedEvent.source_type,
    expected_event_type: intakeState.normalizedEvent.event_type,
    preferred_skills: intakeState.plannerPreview.skills_to_execute || [],
  };
  document.getElementById("memory-learn-status").textContent = uiState.language === "zh" ? "正在保存当前分类记忆..." : "Saving the current classification memory...";
  document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "正在保存当前分类记忆..." : "Saving the current classification memory...";
  await request("/memory/learn/classification", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });
  document.getElementById("memory-learn-status").textContent = uiState.language === "zh" ? "已记住当前分类。后续相似材料会优先复用这条经验。" : "The current classification has been remembered. Similar materials will prefer this experience next time.";
  document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "已记住当前分类。后续相似材料会优先复用这条经验。" : "The current classification has been remembered. Similar materials will prefer this experience next time.";
  await Promise.all([loadMemoryRules(), loadMemoryFeedback()]);
}

async function saveCorrection() {
  if (!intakeState.rawEvent) {
    document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "先完成一次分析，再保存纠正。" : "Finish one analysis before saving a correction.";
    return;
  }
  const expectedSourceType = document.getElementById("correction-source-type").value.trim();
  const expectedEventType = document.getElementById("correction-event-type").value.trim();
  const selectedSkills = Array.from(document.getElementById("correction-skills").selectedOptions).map((option) => option.value);
  if (!expectedSourceType || !expectedEventType) {
    document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "请先填写正确的 source type 和 event type。" : "Please choose the correct source type and event type first.";
    return;
  }
  document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "正在保存这次纠正..." : "Saving this correction...";
  await request("/memory/learn/classification", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        raw_event: intakeState.rawEvent,
        expected_source_type: expectedSourceType,
        expected_event_type: expectedEventType,
        preferred_skills: selectedSkills.length ? selectedSkills : (intakeState.plannerPreview?.skills_to_execute || []),
        notes: "manual-correction-from-intake",
      }),
    });
  document.getElementById("memory-learn-status").textContent = uiState.language === "zh" ? "已保存这次纠正，后续相似文件会优先按你的判断处理。" : "This correction has been saved. Similar files will prefer your decision next time.";
  document.getElementById("intake-learn-status").textContent = uiState.language === "zh" ? "已保存这次纠正，系统后续会优先复用这条经验。" : "This correction has been saved, and the system will reuse it in similar cases.";
  document.getElementById("correction-form").classList.add("hidden");
  await Promise.all([loadMemoryRules(), loadMemoryFeedback()]);
}

document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

document.getElementById("refresh-overview").addEventListener("click", () => withRefreshState("refresh-overview", loadOverview));
document.getElementById("refresh-reports").addEventListener("click", () => withRefreshState("refresh-reports", loadReports));
document.getElementById("refresh-investigations").addEventListener("click", () => withRefreshState("refresh-investigations", loadInvestigations));
document.getElementById("refresh-history").addEventListener("click", () => withRefreshState("refresh-history", loadHistory));
document.getElementById("refresh-skills").addEventListener("click", () => withRefreshState("refresh-skills", loadSkills));
document.getElementById("refresh-matrix").addEventListener("click", () => withRefreshState("refresh-matrix", loadMatrix));
document.getElementById("refresh-memory-rules").addEventListener("click", () => withRefreshState("refresh-memory-rules", loadMemoryRules));
document.getElementById("refresh-memory-feedback").addEventListener("click", () => withRefreshState("refresh-memory-feedback", loadMemoryFeedback));
document.getElementById("run-bitdefender-test").addEventListener("click", () => runBitdefender("/integrations/bitdefender/test", uiState.language === "zh" ? "正在测试 Bitdefender 连接..." : "Testing Bitdefender connection..."));
document.getElementById("run-bitdefender-network").addEventListener("click", () => runBitdefender("/integrations/bitdefender/network", uiState.language === "zh" ? "正在读取终端与资产清单..." : "Loading asset and endpoint inventory..."));
document.getElementById("import-bitdefender-network").addEventListener("click", () => importBitdefender("/integrations/bitdefender/network/import", uiState.language === "zh" ? "正在把终端资产导入平台..." : "Importing asset inventory into the platform..."));
document.getElementById("run-bitdefender-reports").addEventListener("click", () => runBitdefender("/integrations/bitdefender/reports", uiState.language === "zh" ? "正在读取可用报表目录..." : "Loading available report catalog..."));
document.getElementById("run-bitdefender-report-links").addEventListener("click", () => runBitdefender("/integrations/bitdefender/reports/download-links", uiState.language === "zh" ? "正在获取最新报表下载链接..." : "Fetching latest report download links..."));
document.getElementById("import-bitdefender-latest-report").addEventListener("click", () => importBitdefender("/integrations/bitdefender/reports/latest/import", uiState.language === "zh" ? "正在导入最新报表内容..." : "Importing the latest report content..."));
document.getElementById("import-bitdefender-reports").addEventListener("click", () => importBitdefender("/integrations/bitdefender/reports/import", uiState.language === "zh" ? "正在导入报表目录元数据..." : "Importing report catalog metadata..."));
document.getElementById("run-bitdefender-incidents").addEventListener("click", () => runBitdefender("/integrations/bitdefender/incidents", uiState.language === "zh" ? "正在检查事件接口可用性..." : "Checking incident API availability..."));
document.getElementById("preview-normalize").addEventListener("click", previewNormalize);
document.getElementById("preview-plan").addEventListener("click", previewPlan);
document.getElementById("analyze").addEventListener("click", analyzeRaw);
document.getElementById("load-sample").addEventListener("click", () => {
  document.getElementById("raw-input").value = JSON.stringify(sampleRaw, null, 2);
  persistRawInput();
});
document.getElementById("learn-current-memory").addEventListener("click", learnCurrentMemory);
document.getElementById("learn-current-memory-intake").addEventListener("click", learnCurrentMemory);
document.getElementById("show-correction-form").addEventListener("click", () => {
  document.getElementById("correction-form").classList.toggle("hidden");
  document.getElementById("correction-source-type").value = intakeState.normalizedEvent?.source_type || "";
  document.getElementById("correction-event-type").value = intakeState.normalizedEvent?.event_type || "";
  populateCorrectionSkillOptions(intakeState.plannerPreview?.skills_to_execute || []);
});
document.getElementById("save-correction").addEventListener("click", saveCorrection);
document.getElementById("file-upload").addEventListener("change", (event) => {
  uploadFiles(event.target.files);
  event.target.value = "";
});
document.getElementById("raw-input").addEventListener("input", persistRawInput);
document.getElementById("skills-search").addEventListener("input", () => renderSkills(uiState.skills));
document.getElementById("skills-filter").addEventListener("change", () => renderSkills(uiState.skills));
document.getElementById("memory-search").addEventListener("input", () => renderMemoryRules(uiState.memoryRules));
document.getElementById("lang-zh").addEventListener("click", () => {
  uiState.language = "zh";
  localStorage.setItem(storageKeys.language, "zh");
  applyLanguage();
});
document.getElementById("lang-en").addEventListener("click", () => {
  uiState.language = "en";
  localStorage.setItem(storageKeys.language, "en");
  applyLanguage();
});

clearLegacyLocalState();
uiState.language = localStorage.getItem(storageKeys.language) || "zh";
document.getElementById("raw-input").value = localStorage.getItem(storageKeys.rawInput) || "";
fillSelectOptions("correction-source-type", sourceTypeOptions, uiState.language === "zh" ? "选择正确的来源类型" : "Choose the correct source type", sourceTypeLabel);
fillSelectOptions("correction-event-type", eventTypeOptions, uiState.language === "zh" ? "选择正确的事件类型" : "Choose the correct event type", eventTypeLabel);
renderPlannerPreview(null);
renderNormalizeOutput(null);
renderReport(null);
renderFileRuns(null);
document.getElementById("intake-status").textContent = t("ui").ready;
document.getElementById("memory-learn-status").textContent = t("ui").learningReadyHint;
applyLanguage();
loadHealth();
loadOverview();
loadReports();
loadInvestigations();
loadHistory();
loadSkills();
loadMatrix();
loadMemoryRules();
loadMemoryFeedback();
