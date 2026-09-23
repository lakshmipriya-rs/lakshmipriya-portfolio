export type DiagramKind = "provisioning" | "fleet" | "drift" | "synthetic" | "platform" | "gitops";
export type CaseTag = "provisioning" | "fleet" | "reliability" | "observability" | "gitops" | "cost";

export interface Metric { value: string; detail: string; caseId?: string; }
export interface FlowStep { id: string; label: string; tool: string[]; summary: string; }
export interface PipelineLog { time: string; message: string; }
export interface CaseStudy {
  id: string; index: string; title: string; company: string; phase: string; tags: CaseTag[]; outcome: string;
  stack: string[]; diagram: DiagramKind; metrics: Metric[]; steps: FlowStep[];
  problem: string; result: string;
  impact?: string;
}
export interface ExperienceItem { hash: string; company: string; role: string; dates: string; bullets: string[]; stack: string[]; }
export interface EducationItem { school: string; degree: string; location: string; dates: string; }

const step = (id: string, label: string, tool: string[], summary: string): FlowStep => ({ id, label, tool, summary });

export const content = {
  name: "Lakshmipriya RajeshKanna",
  role: "DevOps Engineer",
  location: "Philadelphia, PA",
  email: "rs.lakshmipriya08@gmail.com",
  github: "https://github.com/Lakshmipriya0812",
  linkedin: "https://www.linkedin.com/in/lakshmipriya-r/",
  metrics: [ ] as Metric[],
  cases: [
    {
    id: "vm-provisioning", index: "01", title: "Zero-touch VM provisioning", company: "AssetWorks / Hosting", phase: "provisioning", tags: ["provisioning", "reliability"], outcome: "7 days to approximately 14 minutes", diagram: "provisioning",
    stack: ["ManageIQ", "Automated Embedded Ansible", "vSphere", "VMware ESXi", "Windows Server", "IP allocation", "DNS", "OpUtils", "OPManager Central", "WinRM"],
    metrics: [
    { value: "~14 min", detail: "target" },
    { value: "7+", detail: "steps automated" },
    { value: "15+", detail: "VMs provisioned" }
    ],
steps: [
  step(
    "Request",
    "Request",
    ["ManageIQ", "Hosted Environment Navigator (Internal Tool)"],
    "An engineer submits a VM request through the Hosted Environment Navigator, providing the required environment and server details. The request is then passed to ManageIQ, which starts the provisioning workflow without requiring manual coordination across teams."
  ),

  step(
    "placement",
    "ESXi host placement",
    ["ManageIQ", "vSphere", "VMware ESXi", "Automated Embedded Ansible"],
    "The workflow evaluates the available VMware infrastructure and selects an appropriate ESXi host based on available capacity and placement requirements. This removes the need for an engineer to manually identify where the VM should be created."
  ),

  step(
    "network",
    "IP / DNS allocation",
    ["OpUtils", "OPManagerCentral"],
    "An available IP address is reserved and the required DNS record is created for the new VM. Automating this step ensures the server receives the correct network identity as part of provisioning instead of relying on separate manual requests."
  ),

  step(
    "configure",
    "Windows VM configuration",
    ["Ansible Playbooks", "WinRM", "Windows Server", "vSphere"],
    "The VM is created from the appropriate template and Ansible connects to the Windows server through WinRM to apply the required configuration. Standardized playbooks handle the repeatable setup so every provisioned VM starts from the same baseline."
  ),

  step(
    "environment",
    "Environment setup",
    ["OPManagerCentral", "ManageIQ"],
    "The newly created VM is connected to its target environment by applying domain and DNS configuration and updating the relevant infrastructure records. This prepares the server for the services and operational workflows that depend on it."
  ),

  step(
    "ready",
    "Ready VM",
    ["ManageIQ"],
    "Once provisioning and configuration complete successfully, the VM is registered in the operational inventory and becomes available for handoff. The workflow provides a clear end state instead of requiring an engineer to manually verify each system."
  ),
],
    problem: "Provisioning depended on multiple system handoffs and manual coordination, making server delivery slow and difficult to standardize.",
    result: "Reduced provisioning time from 7 days to approximately 14 minutes, with 7+ steps automated and 15+ VMs provisioned.",
    impact: "Engineers stopped being the bottleneck for customer environment delivery.",
next: "Expand the provisioning workflow with additional products and VM templates, allowing the platform to automatically select the right template and configuration based on different customer requirements."
    },
    {
    id: "environment-navigator",
    index: "02",
    title: "Hosted Environment Navigator",
    company: "AssetWorks / Hosting",
    phase: "fleet",
    tags: ["fleet", "reliability", "operations", "platform"],
    outcome: "Central operations hub for 453+ servers and key hosting workflows.", 
    diagram: "fleet",

    stack: [
        "Python",
        "Flask",
        "PostgreSQL",
        "Redis",
        "Celery",
        "Ansible",
        "NGINX",
        "RBAC",
        "ManageIQ"
    ],

    metrics: [
        { value: "453+", detail: "servers tracked" },
        { value: "337+", detail: "FA-EAM servers" },
        { value: "116+", detail: "M5 servers" }
    ],
steps: [
  step(
    "inventory",
    "server inventory",
    ["Python", "Flask", "PostgreSQL"],
    "Provides a centralized view of 453+ Windows servers supporting FA-EAM and M5, giving the team a shared view of hosted environments and server information."
  ),

  step(
    "connectivity",
    "server connectivity",
    ["WinRM", "Python", "Windows"],
    "Supports connectivity to Windows servers through the platform's existing backend and connectivity layer, enabling operators to work with hosted environments from a central interface."
  ),

  step(
    "operations",
    "operational workflows",
    ["Flask", "Ansible", "Celery"],
    "Brings existing operational workflows such as configuration management and server operations into the Navigator, reducing the need to work across disconnected tools."
  ),

  step(
    "m5",
    "M5 product workflows",
    ["Flask", "PostgreSQL", "Ansible"],
    "Contributed to adding new M5 product workflows and integrating them with the platform's existing backend, connectivity, and operational patterns."
  ),

  step(
    "provisioning",
    "provisioning integration",
    ["ManageIQ", "Ansible", "Flask"],
    "Worked on connecting provisioning and configuration-management workflows to the Navigator so M5-related infrastructure actions could follow the platform's existing operational flow."
  ),

  step(
    "access",
    "centralized access",
    ["RBAC", "NGINX", "Flask"],
    "Provides a consistent entry point for the team to access server information and connected operational workflows through the existing platform."
  ),

  step(
    "hub",
    "operations hub",
    ["Python", "Flask", "PostgreSQL", "Redis", "Celery"],
    "Brings fleet visibility, connectivity, and operational workflows together in one internal platform, with contributions extending its support for M5 environments."
  ),
],
problem: "Operators needed centralized connectivity and operational visibility across 453+ Windows servers supporting FA-EAM and M5, while new M5 workflows had to integrate with the platform's existing backend and connectivity layer.",

result: "Worked with the team lead to extend the Hosted Environment Navigator with M5 product workflows, integrating provisioning and configuration-management capabilities into the existing platform.",

impact: "Expanded the platform's operational coverage while keeping new product workflows connected to the same centralized infrastructure and connectivity layer.",

next: "Expand M5 workflows and automate more provisioning paths"},
{
  id: "config-drift",
  index: "03",
  title: "Configuration Drift Detection",
  company: "AssetWorks / Reliability",
  phase: "reliability",
  tags: ["reliability", "fleet", "automation"],
    outcome: "Automated 15-minute configuration drift detection across production.",
    diagram: "drift",

  stack: [
    "Python",
    "PowerShell",
    "WinRM",
    "Celery",
    "PostgreSQL"
  ],

  metrics: [
    { value: "13", detail: "production servers" },
    { value: "144+", detail: "configuration files" },
    { value: "64", detail: "shared tenants" }
  ],

steps: [
  step(
    "schedule",
    "scheduled drift checks",
    ["Celery", "Python"],
    "Runs configuration-drift checks on a 15-minute cycle so Windows environments are monitored continuously instead of relying on manual audits."
  ),

  step(
    "fanout",
    "parallel server checks",
    ["Celery", "Python", "WinRM"],
    "Uses a Celery fan-out approach to distribute configuration checks across 13 production servers, allowing multiple servers to be checked in parallel."
  ),

  step(
    "collect",
    "configuration collection",
    ["WinRM", "PowerShell", "Windows"],
    "Connects to each Windows server and collects the current state of 144+ configuration files for comparison against the expected configuration."
  ),

  step(
    "tenant",
    "shared-server handling",
    ["Python", "PowerShell"],
    "Accounts for multiple customers sharing the same server so configuration checks can distinguish customer-specific requirements while evaluating the shared environment."
  ),

  step(
    "compare",
    "drift detection",
    ["Python", "Ansible"],
    "Processes the collected configuration state and identifies differences from the expected configuration, making unexpected changes easier to detect."
  ),

  step(
    "fanin",
    "results aggregation",
    ["Celery", "PostgreSQL"],
    "Uses a fan-in stage to collect results from the distributed checks and make the combined status available for the operational workflow."
  ),

  step(
    "dashboard",
    "drift visibility",
    ["Flask", "PostgreSQL"],
    "Improved how configuration differences and check results were surfaced in the Navigator, giving operators a clearer view of drift across Windows environments."
  ),
],
problem: "Manual configuration audits made it difficult to reliably spot unexpected changes across the production fleet.",
result: "Created a continuous drift-detection loop that gives operators a persistent, actionable view of configuration changes.",
impact: "Reduced the effort required to monitor shared customer environments and helped surface configuration issues before they became harder-to-trace operational problems."
},
{
  id: "synthetic-testing",
  index: "04",
  title: "Synthetic Testing at Scale",
  company: "AssetWorks / Production Validation",
  phase: "reliability",
  tags: ["reliability", "observability", "automation"],
  outcome: "Continuous validation for 169+ customer environments.",
  diagram: "synthetic",

  stack: [
    "Azure DevOps",
    "C#",
    "Playwright",
    "Azure Key Vault",
    "YAML",
    "security checks"
  ],

  metrics: [
    { value: "169+", detail: "customers tested" },
    { value: "5–10 min", detail: "check interval" },
    { value: "YAML", detail: "self-service onboarding" }
  ],

steps: [
  step(
    "config",
    "customer configuration",
    ["YAML", "Azure DevOps"],
    "Each customer environment is represented through configuration-driven YAML, defining the application and checks that need to be validated."
  ),

  step(
    "onboarding",
    "self-service onboarding",
    ["Azure DevOps", "YAML"],
    "A self-service workflow generates the customer-specific YAML configuration and testing pipeline, removing the need to manually create a separate sanity-testing pipeline for each customer."
  ),

  step(
    "secrets",
    "secure credentials",
    ["Azure Key Vault"],
    "Retrieves application credentials securely from Azure Key Vault during test execution rather than storing sensitive values in customer-specific pipeline configuration."
  ),

  step(
    "application",
    "application validation",
    ["C#", "Playwright"],
    "Runs automated post-maintenance sanity checks against customer applications to verify that critical application workflows remain available."
  ),

  step(
    "database",
    "database connectivity",
    ["C#", "Playwright"],
    "Validates database connectivity as part of the recurring checks, helping identify issues that may not be visible from application-level checks alone."
  ),

  step(
    "schedule",
    "continuous validation",
    ["Azure DevOps", "YAML"],
    "Runs the configured checks every 5–10 minutes across 169+ customer environments, providing recurring validation after maintenance and infrastructure changes."
  ),

  step(
    "signal",
    "failure reporting",
    ["Azure DevOps", "Playwright"],
    "Reports failed checks through the pipeline so application or infrastructure issues can be identified and investigated instead of waiting for customers to report them."
  ),
],
  problem: "Manual validation did not scale consistently across the customer fleet.",
  result: "169+ customer environments are continuously validated every 5–10 minutes.",impact: "Helped reduce customer-impacting downtime by detecting application and database issues within minutes of maintenance, while removing repetitive manual validation work."
},
{
  id: "epilogue",
  index: "05",
  title: "Kubernetes Platform and Reliability",
  company: "Epilogue Systems",
  phase: "platform",
  tags: ["observability", "cost", "reliability"],
  outcome: "Smaller images, stronger scaling, lower operating cost",
  diagram: "platform",

  stack: [
    "AWS EKS",
    "AWS EC2",
    "VPC",
    "Linux",
    "Docker",
    "Kubernetes",
    "NGINX Ingress",
    "AWS ALB",
    "HPA",
    "Apache Airflow",
    "AWS S3",
    "PostgreSQL",
    "Grafana",
    "CloudWatch"
  ],

  metrics: [
    { value: "35%", detail: "smaller images" },
    { value: "40%", detail: "better scaling" },
    { value: "$7000 → $4500", detail: "monthly AWS cost" }
  ],

steps: [
  step(
    "image",
    "container optimization",
    ["Docker", "Linux"],
    "Optimized application container images to reduce unnecessary layers and dependencies, resulting in smaller workloads that are more efficient to build and deploy."
  ),

  step(
    "cluster",
    "EKS platform",
    ["AWS EKS", "Kubernetes", "EC2", "VPC"],
    "Ran containerized workloads on AWS EKS using Kubernetes and EC2-based worker nodes within a structured VPC environment."
  ),

  step(
    "traffic",
    "traffic management",
    ["NGINX Ingress", "AWS ALB"],
    "Configured the ingress and load-balancing layer to route application traffic reliably into Kubernetes workloads and expose services through the appropriate AWS infrastructure."
  ),

  step(
    "scaling",
    "workload scaling",
    ["Kubernetes", "HPA", "AWS EKS"],
    "Used Kubernetes Horizontal Pod Autoscaling to adjust application capacity based on workload demand, improving resource utilization and application responsiveness."
  ),

  step(
    "logs",
    "log processing",
    ["Apache Airflow", "AWS S3"],
    "Built an automated log-processing flow that moved application and operational logs through Airflow into S3 for storage and downstream analysis."
  ),

  step(
    "observe",
    "platform observability",
    ["Grafana", "CloudWatch"],
    "Used Grafana and CloudWatch to monitor application behavior, infrastructure health, and AWS resource usage, providing visibility for reliability and optimization work."
  ),

  step(
    "optimize",
    "cost optimization",
    ["AWS", "CloudWatch", "Grafana"],
    "Reviewed infrastructure usage and observability overhead to identify unnecessary spend while maintaining the monitoring needed to operate the platform reliably."
  ),
],
  problem: "The existing production setup needed stronger scaling, more efficient workloads, and better visibility into reliability and infrastructure spend.",
  result: "Reduced image size by 35%, improved scaling by 40%, reduced downtime by 45%, and lowered monthly AWS cost from $700 to $450.",
  impact: "Improved platform reliability and resource efficiency while reducing infrastructure spend and making production behavior easier to monitor."
},
{
  id: "mlops",
  index: "06",
  title: "Log Pipelines & MLOps",
  company: "Epilogue Systems",
  phase: "mlops",
  tags: ["observability", "reliability", "automation"],
  outcome: "Automated log intelligence and anomaly detection at production scale",
  diagram: "platform",

  stack: [
    "Graylog",
    "Apache Airflow",
    "AWS S3",
    "PostgreSQL",
    "Grafana",
    "Python",
    "Isolation Forest"
  ],

  metrics: [
    { value: "Millions", detail: "logs processed daily" },
    { value: "45%", detail: "less downtime" },
    { value: "4", detail: "severity categories" }
  ],

  steps: [
    step(
      "ingest",
      "log ingestion",
      ["Graylog"],
      "Collects millions of daily logs from multiple services into Graylog, creating a centralized stream of application and infrastructure events."
    ),

    step(
      "classify",
      "severity filtering",
      ["Graylog"],
      "Filters and categorizes incoming messages by severity, including critical, error, warning, and informational events, making high-value signals easier to isolate."
    ),

    step(
      "etl",
      "ETL pipeline",
      ["Apache Airflow", "Python"],
      "Processes and transforms log data through scheduled ETL workflows, preparing normalized events for downstream analysis and storage."
    ),

    step(
      "detect",
      "anomaly detection",
      ["Isolation Forest", "Python"],
      "Applies Isolation Forest to processed log patterns to identify abnormal behavior that may indicate emerging application or infrastructure issues."
    ),

    step(
      "store",
      "results storage",
      ["AWS S3", "PostgreSQL"],
      "Stores processed log data and anomaly results in S3 and PostgreSQL, providing durable storage for analysis and operational investigation."
    ),

    step(
      "visualize",
      "operational dashboards",
      ["Grafana", "PostgreSQL"],
      "Surfaces log patterns and detected anomalies through Grafana dashboards, giving engineers a clearer view of unusual production behavior."
    ),

    step(
      "respond",
      "reliability feedback",
      ["Grafana", "Isolation Forest"],
      "Uses anomaly signals and operational visibility to help identify abnormal production behavior earlier and support faster investigation of reliability issues."
    )
  ],

  problem: "Millions of daily multi-service logs made it difficult to identify abnormal production behavior and distinguish important signals from routine events.",

  result: "Built an automated ETL and anomaly-detection pipeline using Isolation Forest, processing millions of daily logs and surfacing abnormal patterns through Grafana.",

  impact: "Improved production visibility and helped reduce downtime by 45% through earlier detection of abnormal application and infrastructure behavior.",

  next: "Expand anomaly detection with richer signals and more actionable alerts"
},
{
  id: "event-organizer",
  index: "07",
  title: "Event Organizer GitOps",
  company: "Personal Project",
  phase: "platform",
  tags: ["gitops", "cost", "automation"],
  outcome: "10+ deployments per day with self-healing synchronization",
  diagram: "gitops",
  stack: [
    "ArgoCD",
    "Terraform",
    "EKS",
    "EC2",
    "VPC",
    "RDS",
    "AWS",
    "GitHub Actions"
  ],
  metrics: [
    { value: "10+", detail: "deployments per day" },
    { value: "99.9%", detail: "uptime" },
    { value: "Private", detail: "subnet AWS design" }
  ],
  steps: [
    step(
      "code",
      "Git as desired state",
      ["Git"],
      "Application and deployment changes begin as version-controlled Git changes."
    ),
    step(
      "infra",
      "private AWS infrastructure",
      ["Terraform", "AWS"],
      "Terraform defines and provisions the AWS infrastructure required by the application."
    ),
    step(
      "sync",
      "GitOps reconciliation",
      ["ArgoCD"],
      "ArgoCD continuously compares the Git-defined desired state with the live Kubernetes environment and reconciles differences."
    ),
    step(
      "runtime",
      "EKS runtime",
      ["EKS", "Kubernetes"],
      "The application runs as a Kubernetes workload on EKS."
    ),
    step(
      "data",
      "RDS persistence",
      ["RDS", "AWS"],
      "Application state is persisted independently from the Kubernetes runtime through Amazon RDS."
    )
  ],
  problem:
    "Manual deployment and infrastructure workflows made frequent releases and recovery harder to reproduce consistently.",
  result: "10+ deployments per day · self-healing synchronization · 99.9% uptime",
  impact: "Improved deployment frequency and reliability through automated GitOps workflows.",
}
  ] as CaseStudy[],
  pipelineLogs: [
    { time: "10:02:11", message: "request accepted · rbac ok" },
    { time: "10:02:14", message: "placement · host selected" },
    { time: "10:02:19", message: "dns · record created" },
    { time: "10:02:31", message: "ansible · applying config ... ok" },
    { time: "10:02:58", message: "vm ready · handoff" },
  ] as PipelineLog[],
  scale: {
    fleet: { total: 453, faEam: 337, m5: 116 },
    drift: { servers: 13, files: "144+", tenants: 64, cadence: "15 minutes" },
    synthetic: { customers: "169+", cadence: "5 to 10 minutes" },
    time: ["hypervisor placement", "IP/DNS allocation", "VM configuration", "environment-specific setup", "verification"],
  },
experience: [
  {
    hash: "a3f9c21",
    company: "AssetWorks",
    role: "DevOps Engineer",
    dates: "May 2026 – Present",
    bullets: [
      "- Turned fragmented hosting operations into reusable, self-service workflows for provisioning, fleet management, and validation.",
      "- Designed an operational layer that connects infrastructure data with day-to-day actions, giving operators one place to investigate and manage hosted environments.",
      "- Introduced continuous configuration awareness to surface unexpected state changes before they become harder-to-trace operational issues.",
      "- Built customer-focused synthetic workflows that continuously validate critical paths and provide fast feedback after infrastructure changes."
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
      "Playwright"
    ]
  },
  {
    hash: "b71e0dd",
    company: "Epilogue Systems",
    role: "DevOps Engineer",
    dates: "Sep 2025 – Mar 2026",
    bullets: [
      "- Improved the reliability of a Kubernetes-based platform by tightening the relationship between deployment, scaling, and traffic management.",
      "- Built an observability pipeline that transformed high-volume application logs into signals useful for debugging and operational decisions.",
      "- Reviewed cloud telemetry from a cost and usefulness perspective, removing unnecessary observability overhead without sacrificing visibility."
    ],
    stack: [
      "EKS",
      "Docker",
      "Terraform",
      "Airflow",
      "NGINX",
      "Grafana",
      "CloudWatch"
    ]
  },
  {
    hash: "7d2ab90",
    company: "Techavidity",
    role: "Software Engineer Intern",
    dates: "May 2025 – Aug 2025",
    bullets: [
      "- Helped make the software delivery process more predictable by embedding automated validation and security checks into development workflows.",
      "- Explored graph-based approaches for connecting complex healthcare data and improving how relationships could be queried.",
      "- Experimented with retrieval-augmented generation to evaluate how graph context could improve AI-driven information retrieval."
    ],
    stack: [
      "CI/CD",
      "Security",
      "Neo4j",
      "BigQuery",
      "GraphRAG",
      "HuggingFace"
    ]
  },
  {
    hash: "4c8f1b2",
    company: "Intellint Technology LLP",
    role: "Full Stack Developer",
    dates: "Apr 2022 – Apr 2023",
    bullets: [
      "- Developed an internal logistics platform that replaced repetitive shipment-management tasks with a streamlined web workflow.",
      "- Worked across the application and deployment layers, connecting frontend features, backend services, data persistence, and cloud delivery."
    ],
    stack: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "CI/CD"
    ]
  }
] as ExperienceItem[],
  education: [
    { school: "Drexel University", degree: "M.S., Software Engineering", location: "Philadelphia, PA", dates: "Sep 2023 to Mar 2025" },
    { school: "Sona College of Technology", degree: "B.Tech, Information Technology", location: "Salem, India", dates: "Sep 2018 to Jun 2022" },
  ] as EducationItem[],
capabilities: {
  "Cloud & Containers": [
    "AWS",
    "Azure",
    "Kubernetes",
    "EKS",
    "Docker",
    "EC2",
    "VPC",
    "RDS",
    "VMware ESXi"
  ],

  "CI/CD & Infrastructure": [
    "GitHub Actions",
    "Azure DevOps",
    "Terraform",
    "ArgoCD",
    "Ansible",
    "ManageIQ"
  ],

  "Observability & Reliability": [
    "CloudWatch",
    "Grafana",
    "Graylog",
    "Apache Airflow",
    "NGINX",
    "RBAC",
    "WinRM"
  ],

  "Languages & Automation": [
    "Python",
    "C#",
    "PowerShell",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "Celery",
    "Playwright",
    "React"
  ],

  "Data & AI": [
    "Neo4j GDS",
    "BigQuery",
    "GraphRAG",
    "Isolation Forest"
  ]
},
} as const;

export const allTags: CaseTag[] = ["provisioning", "fleet", "reliability", "observability", "gitops", "cost"];
