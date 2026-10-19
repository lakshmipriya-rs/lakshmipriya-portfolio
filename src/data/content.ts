export type CaseCategory =
  | "provisioning"
  | "platform"
  | "reliability"
  | "sre"
  | "kubernetes"
  | "observability"
  | "gitops";

export interface Metric {
  value: string;
  label: string;
  caseId?: string;
}

export interface FlowStep {
  id: string;
  label: string;
  tools: string[];
  summary: string;
}

export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  context: string;
  category: CaseCategory;
  outcome: string;
  metrics: Metric[];
  steps: FlowStep[];
  problem: string;
  result: string;
  impact: string;
  future: string;
  stack: string[];
}

export interface PipelineLog {
  time: string;
  message: string;
}

export interface ExperienceItem {
  hash: string;
  company: string;
  role: string;
  dates: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  location: string;
  dates: string;
}

export interface SkillGroup {
  name: string;
  key: string;
  tools: string[];
}

export interface PortfolioContent {
  name: string;
  role: string;
  focus: string[];
  location: string;
  email: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  linkedinHandle: string;
  resume: string;
  seeking: string;
  headline: string;
  highlights: Metric[];
  heroPipeline: {
    caseId: string;
    hints: Record<string, string>;
    logs: PipelineLog[];
  };
  cases: CaseStudy[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

const step = (
  id: string,
  label: string,
  tools: string[],
  summary: string,
): FlowStep => ({ id, label, tools, summary });

export const content: PortfolioContent = {
  name: "Lakshmipriya",
  role: "DevOps Engineer",
  focus: ["DevOps", "SRE", "Platform Engineering"],
  location: "Philadelphia, PA",
  email: "rs.lakshmipriya08@gmail.com",
  github: "https://github.com/Lakshmipriya0812",
  githubHandle: "Lakshmipriya0812",
  linkedin: "https://www.linkedin.com/in/lakshmipriya-r/",
  linkedinHandle: "in/lakshmipriya-r",
  resume: "projects/Lakshmipriya.pdf",
  seeking: "DevOps, SRE & Platform Engineering roles",
  headline:
    "Platform and DevOps Engineer with 2+ years across AWS, Azure, and VMware, building internal platforms in Go and automating Kubernetes/EKS deployments with ArgoCD and Terraform. Focused on reliability and platform automation, I turn multi-day manual operations into minutes-long, auditable workflows across Azure, AWS, and Kubernetes.",

  highlights: [
    {
      value: "~14 min",
      label: "VM provisioning, down from 7 days",
      caseId: "vm-provisioning",
    },
    {
      value: "453+",
      label: "Windows servers behind one platform",
      caseId: "environment-navigator",
    },
    {
      value: "169+",
      label: "customer environments probed every 5–10 min",
      caseId: "synthetic-testing",
    },
    {
      value: "45%",
      label: "less production downtime on AWS EKS",
      caseId: "epilogue",
    },
    {
      value: "35%",
      label: "lower AWS costs through observability optimization",
      caseId: "epilogue",
    },
  ],

  heroPipeline: {
    caseId: "vm-provisioning",
    hints: {
      request: "Self-service · RBAC",
      placement: "vSphere · ESXi",
      network: "IPAM · DNS",
      configure: "Windows · Ansible · WinRM",
      environment: "Environment-specific config",
      ready: "Inventory · handoff",
    },
    logs: [
      { time: "10:02:11", message: "request accepted · rbac ok" },
      { time: "10:02:14", message: "placement · host selected" },
      { time: "10:02:19", message: "ipam · dns record created" },
      { time: "10:02:31", message: "ansible · applying config … ok" },
      { time: "10:02:47", message: "environment · domain joined" },
      { time: "10:02:58", message: "vm ready · handoff" },
    ],
  },

  cases: [
    {
      id: "vm-provisioning",
      index: "01",
      title: "Zero-touch VM provisioning",
      context: "AssetWorks · Hosting",
      category: "provisioning",
      outcome:
        "Cut Windows VM provisioning from 7 days of manual hand-offs to about 14 minutes.",
      metrics: [
        { value: "~14 min", label: "end-to-end, from 7 days" },
        { value: "7+", label: "manual steps automated" },
        { value: "15+", label: "VMs provisioned" },
      ],
      steps: [
        step(
          "request",
          "Request",
          ["ManageIQ", "Hosted Environment Navigator"],
          "An engineer submits a VM request through the Hosted Environment Navigator with the required environment and server details. ManageIQ picks it up and starts the provisioning workflow — no manual coordination across teams.",
        ),
        step(
          "placement",
          "ESXi host placement",
          ["ManageIQ", "vSphere", "VMware ESXi", "Embedded Ansible"],
          "The workflow evaluates available VMware capacity and selects an ESXi host that meets placement requirements, removing the need for an engineer to decide where the VM should live.",
        ),
        step(
          "network",
          "IP / DNS allocation",
          ["OpUtils", "OpManager Central"],
          "An available IP address is reserved and the DNS record is created automatically, so every VM gets the correct network identity as part of provisioning instead of through separate tickets.",
        ),
        step(
          "configure",
          "Windows VM configuration",
          ["Ansible", "WinRM", "Windows Server", "vSphere"],
          "The VM is cloned from the right template, then Ansible connects over WinRM to apply standardized playbooks — every server starts from the same audited baseline.",
        ),
        step(
          "environment",
          "Environment setup",
          ["OpManager Central", "ManageIQ"],
          "Domain and DNS configuration is applied and infrastructure records are updated, preparing the server for the services and operational workflows that depend on it.",
        ),
        step(
          "ready",
          "Ready VM",
          ["ManageIQ"],
          "The VM is registered in the operational inventory and handed off, giving a clear, verifiable end state instead of an engineer manually checking each system.",
        ),
      ],
      problem:
        "Provisioning depended on multiple system hand-offs and manual coordination, making server delivery slow and hard to standardize.",
      result:
        "Provisioning time dropped from 7 days to approximately 14 minutes, with 7+ steps automated and 15+ VMs delivered through the workflow.",
      impact:
        "Engineers stopped being the bottleneck for customer environment delivery.",
      future:
        "Add more products and VM templates so the workflow automatically selects the right template and configuration for each customer's requirements.",
      stack: [
        "ManageIQ",
        "Ansible",
        "vSphere",
        "VMware ESXi",
        "Windows Server",
        "WinRM",
        "OpUtils",
        "OpManager Central",
      ],
    },
    {
      id: "environment-navigator",
      index: "02",
      title: "Hosted Environment Navigator",
      context: "AssetWorks · Hosting",
      category: "platform",
      outcome:
        "A central operations hub for 453+ Windows servers and the team's key hosting workflows.",
      metrics: [
        { value: "453+", label: "servers tracked" },
        { value: "337+", label: "FA-EAM servers" },
        { value: "116+", label: "M5 servers" },
      ],
      steps: [
        step(
          "inventory",
          "Server inventory",
          ["Python", "Flask", "PostgreSQL"],
          "A single view of 453+ Windows servers supporting FA-EAM and M5, giving the team one shared source of truth for hosted environments.",
        ),
        step(
          "connectivity",
          "Server connectivity",
          ["WinRM", "Python", "Windows"],
          "Operators reach Windows servers through the platform's backend connectivity layer, working with hosted environments from one interface.",
        ),
        step(
          "operations",
          "Operational workflows",
          ["Flask", "Ansible", "Celery"],
          "Configuration management and server operations run inside the Navigator, reducing context-switching across disconnected tools.",
        ),
        step(
          "m5",
          "M5 product workflows",
          ["Flask", "PostgreSQL", "Ansible"],
          "Added new M5 product workflows and integrated them with the platform's existing backend, connectivity, and operational patterns.",
        ),
        step(
          "provisioning",
          "Provisioning integration",
          ["ManageIQ", "Ansible", "Flask"],
          "Connected provisioning and configuration-management workflows so M5 infrastructure actions follow the same operational flow as the rest of the fleet.",
        ),
        step(
          "access",
          "Centralized access",
          ["RBAC", "NGINX", "Flask"],
          "Role-based access gives the team one consistent, audited entry point to server information and connected workflows.",
        ),
        step(
          "hub",
          "Operations hub",
          ["Python", "Flask", "PostgreSQL", "Redis", "Celery"],
          "Fleet visibility, connectivity, and operational workflows now live in one internal platform — extended to fully support M5 environments.",
        ),
      ],
      problem:
        "Operators needed centralized connectivity and visibility across 453+ Windows servers, and new M5 workflows had to integrate with the existing backend and connectivity layer.",
      result:
        "Worked with the team lead to extend the Navigator with M5 product workflows, integrating provisioning and configuration management into the existing platform.",
      impact:
        "Expanded operational coverage while keeping new product workflows on the same centralized infrastructure and connectivity layer.",
      future:
        "Expand M5 workflow coverage and automate additional provisioning paths end to end.",
      stack: [
        "Python",
        "Flask",
        "PostgreSQL",
        "Redis",
        "Celery",
        "Ansible",
        "NGINX",
        "RBAC",
        "WinRM",
        "ManageIQ",
      ],
    },
    {
      id: "config-drift",
      index: "03",
      title: "Configuration drift detection",
      context: "AssetWorks · Reliability",
      category: "reliability",
      outcome:
        "Automated, 15-minute configuration drift detection across shared production servers.",
      metrics: [
        { value: "144+", label: "configuration files watched" },
        { value: "13", label: "production servers" },
        { value: "64", label: "shared tenants" },
      ],
      steps: [
        step(
          "schedule",
          "Scheduled checks",
          ["Celery", "Python"],
          "Drift checks run on a 15-minute cycle, so Windows environments are monitored continuously instead of through periodic manual audits.",
        ),
        step(
          "fanout",
          "Parallel fan-out",
          ["Celery", "Python", "WinRM"],
          "A Celery fan-out distributes checks across 13 production servers so they are evaluated in parallel.",
        ),
        step(
          "collect",
          "State collection",
          ["WinRM", "PowerShell", "Windows"],
          "Each server is queried over WinRM and the current state of 144+ configuration files is collected for comparison.",
        ),
        step(
          "tenant",
          "Shared-server handling",
          ["Python", "PowerShell"],
          "Checks account for multiple customers sharing one server, separating customer-specific requirements from the shared baseline.",
        ),
        step(
          "compare",
          "Drift detection",
          ["Python"],
          "Collected state is compared against the expected configuration, flagging unexpected changes as soon as they appear.",
        ),
        step(
          "fanin",
          "Results fan-in",
          ["Celery", "PostgreSQL"],
          "A fan-in stage aggregates the distributed results and persists the combined status for the operational workflow.",
        ),
        step(
          "dashboard",
          "Drift visibility",
          ["Flask", "PostgreSQL"],
          "Configuration differences surface in the Navigator, giving operators a clear, persistent view of drift across Windows environments.",
        ),
      ],
      problem:
        "Manual configuration audits could not reliably catch unexpected changes across a production fleet shared by many tenants.",
      result:
        "A continuous drift-detection loop gives operators a persistent, actionable view of configuration changes every 15 minutes.",
      impact:
        "Less effort to monitor shared customer environments, and configuration issues surface before they become hard-to-trace incidents.",
      future:
        "Expand coverage to more customers and provide deeper, file-level drift details to speed up remediation.",
      stack: ["Python", "PowerShell", "WinRM", "Celery", "PostgreSQL", "Flask"],
    },
    {
      id: "synthetic-testing",
      index: "04",
      title: "Synthetic testing at scale",
      context: "AssetWorks · Production validation",
      category: "sre",
      outcome:
        "Continuous post-change validation for 169+ customer environments, every 5–10 minutes.",
      metrics: [
        { value: "169+", label: "customers validated" },
        { value: "5–10 min", label: "check interval" },
        { value: "YAML", label: "self-service onboarding" },
      ],
      steps: [
        step(
          "config",
          "Customer configuration",
          ["YAML", "Azure DevOps"],
          "Each customer environment is described in configuration-driven YAML that defines the application and the checks to validate.",
        ),
        step(
          "onboarding",
          "Self-service onboarding",
          ["Azure DevOps", "YAML"],
          "A self-service workflow generates the customer's YAML and testing pipeline — no more hand-building a sanity pipeline per customer.",
        ),
        step(
          "secrets",
          "Secure credentials",
          ["Azure Key Vault"],
          "Application credentials are pulled from Azure Key Vault at run time instead of being stored in pipeline configuration.",
        ),
        step(
          "application",
          "Application checks",
          ["C#", "Playwright"],
          "Automated post-maintenance sanity checks verify that critical customer application workflows remain available.",
        ),
        step(
          "database",
          "Database connectivity",
          ["C#", "Playwright"],
          "Database connectivity is validated on every run, catching issues that application-level checks alone would miss.",
        ),
        step(
          "schedule",
          "Continuous validation",
          ["Azure DevOps", "YAML"],
          "Checks run every 5–10 minutes across 169+ customer environments after maintenance and infrastructure changes.",
        ),
        step(
          "signal",
          "Failure reporting",
          ["Azure DevOps", "Playwright"],
          "Failed checks are reported through the pipeline so issues are investigated before customers notice them.",
        ),
      ],
      problem:
        "Manual post-change validation did not scale consistently across the customer fleet.",
      result:
        "169+ customer environments are continuously validated every 5–10 minutes, with onboarding reduced to a generated YAML file.",
      impact:
        "Application and database issues are detected within minutes of maintenance, reducing customer-facing downtime and repetitive manual checks.",
      future:
        "Standardize test configurations and improve failure reporting and diagnosis so on-call engineers can act faster.",
      stack: ["Azure DevOps", "C#", "Playwright", "Azure Key Vault", "YAML"],
    },
    {
      id: "epilogue",
      index: "05",
      title: "Kubernetes platform & reliability",
      context: "Epilogue Systems",
      category: "kubernetes",
      outcome:
        "Smaller images, stronger autoscaling, and lower operating cost on AWS EKS.",
      metrics: [
        { value: "$7,000 → $4,500", label: "monthly AWS cost" },
        { value: "45%", label: "less downtime" },
        { value: "35%", label: "smaller images" },
      ],
      steps: [
        step(
          "image",
          "Container optimization",
          ["Docker", "Linux"],
          "Rebuilt application images to strip unnecessary layers and dependencies — smaller workloads that build and deploy faster.",
        ),
        step(
          "cluster",
          "EKS platform",
          ["AWS EKS", "Kubernetes", "EC2", "VPC"],
          "Containerized workloads run on AWS EKS with EC2 worker nodes inside a structured VPC.",
        ),
        step(
          "traffic",
          "Traffic management",
          ["NGINX Ingress", "AWS ALB"],
          "Ingress and load balancing route traffic reliably into Kubernetes workloads through the appropriate AWS infrastructure.",
        ),
        step(
          "scaling",
          "Workload autoscaling",
          ["Kubernetes", "HPA", "AWS EKS"],
          "Horizontal Pod Autoscaling adjusts capacity to demand, improving scaling by 40% and overall resource utilization.",
        ),
        step(
          "logs",
          "Log processing",
          ["Apache Airflow", "AWS S3"],
          "An automated Airflow flow moves application and operational logs into S3 for storage and downstream analysis.",
        ),
        step(
          "observe",
          "Platform observability",
          ["Grafana", "CloudWatch"],
          "Grafana and CloudWatch track application behavior, infrastructure health, and AWS resource usage.",
        ),
        step(
          "optimize",
          "Cost optimization",
          ["AWS", "CloudWatch", "Grafana"],
          "Reviewed infrastructure usage and observability overhead to remove unnecessary spend without losing the monitoring the platform needs.",
        ),
      ],
      problem:
        "The production setup needed stronger scaling, leaner workloads, and better visibility into reliability and infrastructure spend.",
      result:
        "Image size down 35%, scaling improved 40%, downtime reduced 45%, and monthly AWS cost lowered from $7,000 to $4,500.",
      impact:
        "A more reliable, more efficient platform that costs less to run and is easier to monitor in production.",
      future:
        "Tune autoscaling further and strengthen observability with explicit platform SLOs.",
      stack: [
        "AWS EKS",
        "EC2",
        "VPC",
        "Docker",
        "Kubernetes",
        "NGINX Ingress",
        "AWS ALB",
        "HPA",
        "Apache Airflow",
        "AWS S3",
        "Grafana",
        "CloudWatch",
      ],
    },
    {
      id: "mlops",
      index: "06",
      title: "Log pipelines & MLOps",
      context: "Epilogue Systems",
      category: "observability",
      outcome:
        "Automated log intelligence and anomaly detection over millions of daily events.",
      metrics: [
        { value: "Millions", label: "logs processed daily" },
        { value: "45%", label: "less downtime" },
        { value: "4", label: "severity categories" },
      ],
      steps: [
        step(
          "ingest",
          "Log ingestion",
          ["Graylog"],
          "Millions of daily logs from multiple services stream into Graylog as one centralized event feed.",
        ),
        step(
          "classify",
          "Severity filtering",
          ["Graylog"],
          "Messages are classified as critical, error, warning, or informational so high-value signals are easy to isolate.",
        ),
        step(
          "etl",
          "ETL pipeline",
          ["Apache Airflow", "Python"],
          "Scheduled Airflow ETL jobs transform and normalize events for downstream analysis and storage.",
        ),
        step(
          "detect",
          "Anomaly detection",
          ["Isolation Forest", "Python"],
          "An Isolation Forest model scores processed log patterns to flag abnormal behavior that may signal an emerging incident.",
        ),
        step(
          "store",
          "Results storage",
          ["AWS S3", "PostgreSQL"],
          "Processed logs and anomaly results are stored in S3 and PostgreSQL for investigation and trend analysis.",
        ),
        step(
          "visualize",
          "Operational dashboards",
          ["Grafana", "PostgreSQL"],
          "Grafana dashboards surface log patterns and detected anomalies, giving engineers a clear view of unusual production behavior.",
        ),
        step(
          "respond",
          "Reliability feedback",
          ["Grafana", "Isolation Forest"],
          "Anomaly signals feed back into operations so abnormal behavior is caught earlier and investigated faster.",
        ),
      ],
      problem:
        "Millions of daily multi-service logs made it hard to spot abnormal production behavior among routine events.",
      result:
        "An automated ETL and Isolation Forest anomaly-detection pipeline processes millions of daily logs and surfaces abnormal patterns in Grafana.",
      impact:
        "Better production visibility and a 45% reduction in downtime through earlier detection of abnormal behavior.",
      future:
        "Enrich anomaly detection with additional signals and route more actionable, severity-aware alerts to on-call.",
      stack: [
        "Graylog",
        "Apache Airflow",
        "Python",
        "Isolation Forest",
        "AWS S3",
        "PostgreSQL",
        "Grafana",
      ],
    },
    {
      id: "event-organizer",
      index: "07",
      title: "Event Organizer GitOps",
      context: "Personal project",
      category: "gitops",
      outcome:
        "10+ deployments per day with self-healing GitOps synchronization on AWS.",
      metrics: [
        { value: "10+", label: "deployments per day" },
        { value: "99.9%", label: "uptime" },
        { value: "Private", label: "subnet AWS design" },
      ],
      steps: [
        step(
          "code",
          "Git as desired state",
          ["Git", "GitHub Actions"],
          "Every application and deployment change starts as a version-controlled commit, validated by GitHub Actions.",
        ),
        step(
          "infra",
          "Private AWS infrastructure",
          ["Terraform", "AWS", "VPC"],
          "Terraform defines and provisions the AWS network and compute the application needs, with workloads in private subnets.",
        ),
        step(
          "sync",
          "GitOps reconciliation",
          ["ArgoCD"],
          "ArgoCD continuously compares the Git-defined desired state with the live cluster and self-heals any drift.",
        ),
        step(
          "runtime",
          "EKS runtime",
          ["EKS", "Kubernetes"],
          "The application runs as a Kubernetes workload on EKS.",
        ),
        step(
          "data",
          "RDS persistence",
          ["RDS", "AWS"],
          "Application state lives in Amazon RDS, independent of the Kubernetes runtime.",
        ),
      ],
      problem:
        "Manual deployment and infrastructure workflows made frequent releases and recovery hard to reproduce consistently.",
      result:
        "10+ deployments per day with self-healing synchronization and 99.9% uptime.",
      impact:
        "Higher deployment frequency and reliability through fully automated GitOps workflows.",
      future:
        "Automate and regularly verify RDS backup and restore workflows as part of the pipeline.",
      stack: [
        "ArgoCD",
        "Terraform",
        "GitHub Actions",
        "EKS",
        "EC2",
        "VPC",
        "RDS",
        "AWS",
      ],
    },
  ],

  skills: [
    {
      name: "Cloud & Kubernetes",
      key: "cloud_kubernetes",
      tools: [
        "AWS",
        "Azure",
        "Kubernetes",
        "EKS",
        "Docker",
        "EC2",
        "VPC",
        "RDS",
        "S3",
        "VMware vSphere / ESXi",
      ],
    },
    {
      name: "CI/CD & Infrastructure as Code",
      key: "cicd_iac",
      tools: [
        "GitHub Actions",
        "Azure DevOps",
        "Terraform",
        "ArgoCD",
        "Ansible",
        "ManageIQ",
      ],
    },
    {
      name: "Observability & Reliability",
      key: "observability_sre",
      tools: ["Grafana", "CloudWatch", "Graylog", "Playwright"],
    },
    {
      name: "Security & Networking",
      key: "security_networking",
      tools: ["RBAC", "Azure Key Vault", "NGINX", "WinRM"],
    },
    {
      name: "Languages & Frameworks",
      key: "languages_frameworks",
      tools: ["Python", "PowerShell", "C#", "Flask", "Node.js", "React"],
    },
    {
      name: "Data, Pipelines & ML",
      key: "data_pipelines_ml",
      tools: [
        "PostgreSQL",
        "Redis",
        "Celery",
        "Apache Airflow",
        "BigQuery",
        "Neo4j GDS",
        "GraphRAG",
        "Isolation Forest",
      ],
    },
    {
      name: "Platform Engineering & Certifications",
      key: "platform_certifications",
      tools: [
        "Go",
        "Gin",
        "HTMX",
        "Asynq",
        "Server-Sent Events",
        "OpenShift",
        "Bicep",
        "Azure NSG",
        "Jenkins",
        "Trivy",
        "Helm",
        "AWS Certified Solutions Architect – Associate",
        "Certified Kubernetes Administrator (CKA)",
        "HashiCorp Terraform Associate",
        "Azure certification path",
        "Docker Swarm",
        "SLOs",
      ],
    },
  ],

  experience: [
    {
      hash: "a3f9c21",
      company: "AssetWorks",
      role: "DevOps Engineer",
      dates: "May 2026 – Oct 2026",
      bullets: [
        "Turned fragmented hosting operations into reusable, self-service workflows for provisioning, fleet management, and validation.",
        "Designed an operational layer that connects infrastructure data with day-to-day actions, giving operators one place to investigate and manage hosted environments.",
        "Introduced continuous configuration awareness to surface unexpected state changes before they become hard-to-trace operational issues.",
        "Built customer-focused synthetic workflows that continuously validate critical paths and give fast feedback after infrastructure changes.",
        "Architected and led a 57k-line rebuild of the internal operations platform from Python/Flask to Go/Gin, HTMX, Asynq, and PostgreSQL, covering 408 routes and 12 Celery tasks; split FA-EAM and M5 into independent products over a shared platform with CI-enforced layer boundaries.",
        "Built the SRE foundation with default-deny RBAC, CSRF protection on every write, durable audit-logged jobs, live SSE progress, p95 latency SLOs below 300 ms, and alerts under 2 minutes; ran v1 alongside v2 with golden contract tests for zero-downtime cutover.",
        "Built self-service Windows VM provisioning with capacity-based ESXi placement, IP/DNS allocation, and approval-gated Azure DevOps pipelines, reducing delivery from 7 days to about 20 minutes and provisioning 15+ VMs.",
        "Extended Navigator configuration checks with Celery fan-out/fan-in across 300+ files on 30+ servers every 15 minutes, with shared and customer-specific dashboards to eliminate manual audits.",
        "Automated post-maintenance health and database-connectivity checks for 169+ customer applications using Azure DevOps, Playwright, and Key Vault; added self-service onboarding that generates customer-specific YAML and test workflows.",
        "Automated production IP whitelisting with Azure NSG and Bicep behind IT-approved pull requests, and validated database replication across 6–7 test phases.",
      ],
      stack: [
        "ManageIQ",
        "Ansible",
        "Python",
        "Flask",
        "PostgreSQL",
        "Redis",
        "Celery",
        "WinRM",
        "Azure DevOps",
        "C#",
        "Playwright",
        "Go",
        "Gin",
        "HTMX",
        "Asynq",
        "PostgreSQL",
        "SSE",
        "Bicep",
        "Azure Key Vault",
      ],
    },
    {
      hash: "b71e0dd",
      company: "Epilogue Systems",
      role: "DevOps Engineer",
      dates: "Sep 2025 – Mar 2026",
      bullets: [
        "Improved the reliability of a Kubernetes-based platform by tightening the relationship between deployment, scaling, and traffic management.",
        "Built an observability pipeline that turned high-volume application logs into signals useful for debugging and operational decisions.",
        "Reviewed cloud telemetry for cost and usefulness, removing unnecessary observability overhead without sacrificing visibility.",
        "Containerized services on EKS with NGINX Ingress and AWS ALB, reduced Docker image size by 35%, and improved scaling response time by 40% with HPA.",
        "Built 5–6 product CI/CD pipelines that delivered 20+ Kubernetes version updates; implemented ArgoCD GitOps with rolling updates and self-healing sync for 10+ automated deployments daily at 99.9% uptime.",
        "Provisioned private-subnet AWS infrastructure (VPC, EKS, and RDS) with Terraform and least-privilege IAM; added Trivy CI scans that reduced vulnerabilities by 90%.",
        "Built Airflow and Graylog/Grafana pipelines for 8–9M logs per day, adding anomaly detection and Slack/email alerts with error, time, and owner details to reduce production downtime by 45%.",
        "Audited redundant CloudWatch ingestion and unused metrics, reducing monthly AWS costs by 35% from $7,000 to $4,500.",
      ],
      stack: [
        "EKS",
        "Docker",
        "Terraform",
        "Airflow",
        "NGINX",
        "Grafana",
        "CloudWatch",
        "ArgoCD",
        "AWS ALB",
        "HPA",
        "IAM",
        "Trivy",
        "Graylog",
        "Slack",
      ],
    },
    {
      hash: "7d2ab90",
      company: "Techavidity",
      role: "Software Engineer Intern",
      dates: "May 2025 – Aug 2025",
      bullets: [
        "Made software delivery more predictable by embedding automated validation and security checks into development workflows.",
        "Explored graph-based approaches for connecting complex healthcare data and improving how relationships could be queried.",
        "Evaluated retrieval-augmented generation to measure how graph context could improve AI-driven information retrieval.",
        "Deployed and managed 10+ containerized applications on AWS EKS with rolling updates and health checks, achieving 99.95% application availability.",
        "Added automated tests and security gates to CI/CD pipelines, reducing deployment time by 40%.",
      ],
      stack: [
        "CI/CD",
        "Security",
        "Neo4j",
        "BigQuery",
        "GraphRAG",
        "HuggingFace",
        "Docker",
        "Kubernetes",
        "EKS",
      ],
    },
    {
      hash: "4c8f1b2",
      company: "Intellint Technology LLP",
      role: "Full Stack Developer",
      dates: "Apr 2022 – Apr 2023",
      bullets: [
        "Developed an internal logistics platform that replaced repetitive shipment-management tasks with a streamlined web workflow.",
        "Worked across application and deployment layers, connecting frontend features, backend services, data persistence, and cloud delivery.",
        "Built a shipment portal for 50+ daily users with Docker CI/CD on AWS, cutting manual work by 30% and deployment failures by 25%.",
      ],
      stack: ["React", "Node.js", "PostgreSQL", "Docker", "AWS", "CI/CD"],
    },
  ],

  education: [
    {
      school: "Drexel University",
      degree: "M.S., Software Engineering",
      location: "Philadelphia, PA",
      dates: "Sep 2023 – Mar 2025",
    },
    {
      school: "Sona College of Technology",
      degree: "B.Tech, Information Technology",
      location: "Salem, India",
      dates: "Sep 2018 – Jun 2022",
    },
  ],
};

const normalize = (value: string) => value.toLowerCase().trim();
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const caseTools = content.cases.flatMap((item) => [
  ...item.stack,
  ...item.steps.flatMap((s) => s.tools),
]);

/** True when a skill appears as a whole word in any case study's tools. */
export const isFeaturedTool = (tool: string) =>
  normalize(tool)
    .split(/\s*\/\s*/)
    .some((part) => {
      const word = new RegExp(`(^|[\\s/])${escapeRegExp(part)}($|[\\s/])`);
      return caseTools.some((entry) => word.test(normalize(entry)));
    });
