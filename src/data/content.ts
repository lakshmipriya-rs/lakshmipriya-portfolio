export type DiagramKind = "provisioning" | "fleet" | "drift" | "synthetic" | "platform" | "gitops";
export type CaseTag = "provisioning" | "fleet" | "reliability" | "observability" | "gitops" | "cost";

export interface Metric { value: string; detail: string; caseId?: string; }
export interface FlowStep { id: string; label: string; tool: string[]; summary: string; bullets: string[]; snippet?: string; outcome?: string; }
export interface PipelineLog { time: string; message: string; }
export interface CaseStudy {
  id: string; index: string; title: string; company: string; phase: string; tags: CaseTag[]; outcome: string;
  stack: string[]; diagram: DiagramKind; metrics: Metric[]; steps: FlowStep[];
  problem: string; decision: string; result: string; improve: string;
}
export interface ExperienceItem { hash: string; company: string; role: string; dates: string; bullets: string[]; stack: string[]; }
export interface EducationItem { school: string; degree: string; location: string; dates: string; }

const step = (id: string, label: string, tool: string[], summary: string, bullets: string[], snippet: string, outcome?: string): FlowStep => ({ id, label, tool, summary, bullets, snippet, outcome });

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
    { value: "15+", detail: "VMs provisioned" },
    { value: "6", detail: "workflow stages automated" },
    { value: "8", detail: "infrastructure integrations" }
    ],
    steps: [
        step("request", "request", ["ManageIQ", "Hosted Environment Navigator(Internal Tool)"], "- A VM request is submitted through the Hosted Environment Navigator dashboard and routed to the ManageIQ catalog workflow. The request starts the automated provisioning process.", ["- Captures the server name, customer name, and target environment (PROD or TEST).", "- Validates credentials, resource availability, and provisioning requirements before proceeding."], "request: vm\nsource: manageiq", "Request validated and workflow triggered."),
        step("placement", "ESXi host placement", ["ManageIQ", "vSphere", "VMware ESXi", "Automated Embedded Ansible"], "- The workflow evaluates available VMware ESXi hosts in vSphere and selects the best fit for the Windows VM requirements.", ["- Checks CPU, memory, storage, and required subnet availability.", "- If no suitable ESXi host is found, provisioning stops, rolls back, and returns an error."], "placement:\n  provider: vsphere\n  host_type: esxi", "Best-fit ESXi host selected."),
        step("network", "IP / DNS allocation", ["OpUtils", "OPManagerCentral"], "- The workflow checks Oputils (OpManager Central) for an available IP and reserves one from the required subnet.", ["- Holds the IP for the VM throughout the provisioning process.", "- Passes the reserved address to the VM and DNS configuration stages."], "network:\n  ip: allocate\n  dns: register", "IP reserved for provisioning."),
        step("configure", "Windows VM configuration", ["Ansible Playbooks", "WinRM", "Windows Server", "vSphere"], "- A Windows Server VM is created on the selected ESXi host using the required golden template or requested specifications.", ["- Establishes WinRM access and applies the required Windows configuration through Ansible.", "- Applies required Windows settings, including HTTPS-related configuration."], "ansible-playbook configure-windows-vm.yml", "Windows VM created and configured."),
        step("environment", "environment setup", ["OPManagerCentral", "ManageIQ"], "- The workflow configures the server's domain and establishes the correct relationship between the hostname, IP address, and DNS.", ["- Creates and validates forward and reverse DNS resolution.", "- Updates Oputils to reflect the assigned IP as in use."], "environment: PROD", "Domain and DNS mapping completed."),
        step("ready", "ready VM", ["ManageIQ"], "- The completed VM is surfaced in the ManageIQ virtual machine inventory for final verification.", ["- Confirms the VM is present with the expected configuration and network identity.", "- Provides a ready state for use or handoff."], "status: ready", "VM ready for use."),
    ],
    problem: "Provisioning depended on multiple system handoffs and manual coordination, making server delivery slow and difficult to standardize.",
    decision: "Orchestrated the provisioning lifecycle through ManageIQ with Ansible handling server configuration and environment-specific automation.",
    result: "Reduced provisioning time from 7 days to approximately 14 minutes, with 7+ steps automated and 15+ VMs provisioned.",
    improve: "Add stronger failure recovery and resource cleanup for partial provisioning failures, and extend the automation to support for new product environments.",
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
    "- The dashboard provides a centralized view of the complete hosted server fleet.",
    [
        "- Server and environment information is available from one place.",
        "- Operators can inspect individual servers and their environments without switching systems."
    ],
    "fleet:\n  servers: 453+",
    "A centralized fleet inventory gives operators one reliable starting point for understanding the hosted environment."
    ),

    step(
    "operations",
    "server operations",
    ["PostgreSQL", "Ansible", "Celery"],
    "Server software, updates, SSL certificates, configuration, and operational details are surfaced through the same interface.",
    [
        "- Operators can review the state and details of individual servers.",
        "- Software, update, certificate, and configuration information stays tied to the relevant environment."
    ],
    "operations:\n  software: tracked\n  updates: tracked\n  ssl: tracked",
    "A complete server-level operational view makes day-to-day maintenance and troubleshooting easier to manage."
    ),

    step(
    "manageiq",
    "ManageIQ workspace",
    ["ManageIQ", "Flask"],
    "- The dashboard provides the entry point and UI for triggering and accessing ManageIQ workflows.",
    [
        "- Operators can launch ManageIQ functionality from the central dashboard.",
        "- ManageIQ becomes part of the same operational workflow instead of requiring a separate starting point."
    ],
    "integration:\n  manageiq: connected",
    "ManageIQ is brought into the central workflow while retaining its specialized environment-management capabilities."
    ),

    step(
    "drift",
    "configuration drift",
    ["Ansible", "Flask"],
    "- Configuration-drift information is surfaced through the same operational hub.",
    [
        "- Operators can access the configuration-drift dashboard from the main interface.",
        "- Drift information can be reviewed in the context of the affected server or environment."
    ],
    "config:\n  drift: available",
    "Configuration drift becomes part of the same server-management workflow rather than a disconnected operational task."
    ),

    step(
    "access",
    "centralized access",
    ["RBAC", "NGINX"],
    "- RBAC and the application layer provide a controlled entry point into the connected operational tools.",
    [
        "- Operators start from one dashboard.",
        "- Access to connected tools and operational information is managed through the central application."
    ],
    "role: operator\naccess: centralized",
    "A controlled access layer gives operators a consistent and secure entry point to the hosting toolset."
    ),

    step(
    "hub",
    "operations hub",
    ["Flask", "PostgreSQL"],
    "- The dashboard acts as the head of the hosting toolset, connecting smaller operational workflows into one experience.",
    [
        "- Server inventory, ManageIQ, configuration drift, certificates, updates, and other tools are brought together.",
        "- Operators have a single starting point for day-to-day hosting operations.",
        "- The dashboard reduces the need to remember which tool owns each individual workflow."
    ],
    "hub:\n  tools: connected\n  fleet: 453+",
    "One central operations hub connecting the hosting team's smaller tools and workflows."
    )],
problem:
    "Server information and operational workflows were spread across multiple dashboards, requiring operators to switch between tools to manage the fleet.",

decision:
    "Built the Hosted Environment Navigator as a central operational layer combining server details, SSL certificates, software, updates, ManageIQ, and configuration-drift workflows.",

result:
    "Created a single operational hub for 453+ servers, bringing key hosting workflows into one experience while keeping specialized systems connected.",

improve:
    "Deepen integration across the remaining workflows so data, navigation, and actions can flow seamlessly between systems."
},
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
      "fleet",
      "production fleet",
      ["Python"],
      "- The drift detection workflow starts with the production Windows fleet and the configurations shared across customer environments.",
      [
        "- The scope covers 13 production servers.",
        "- Multiple tenants can share the same underlying server infrastructure.",
        "- The workflow needs to distinguish expected customer-specific differences from unexpected configuration changes."
      ],
      "servers: 13\nmodel: shared + tenant-specific",
      "A defined fleet scope establishes the baseline for consistent configuration monitoring."
    ),

    step(
      "collect",
      "remote collection",
      ["WinRM", "PowerShell"],
      "- The system remotely collects the current configuration state from each production server.",
      [
        "- WinRM provides remote access to the Windows servers.",
        "- PowerShell is used to inspect and collect configuration state.",
        "- The collection process runs automatically instead of requiring an operator to inspect servers individually."
      ],
      "winrm collect --all",
      "Automated remote collection turns server configuration into repeatable, comparable data."
    ),

    step(
      "normalize",
      "hash + parse",
      ["Python", "PowerShell"],
      "- Collected configuration files are parsed and normalized so their state can be compared consistently.",
      [
        "- The workflow covers 144+ configuration files.",
        "- File contents are hashed to identify meaningful changes.",
        "- Normalization helps separate expected formatting or representation differences from actual configuration changes."
      ],
      "files: 144+\nmode: hash + parse",
      "Normalized configuration state creates a consistent basis for detecting changes across servers."
    ),

    step(
      "compare",
      "configuration comparison",
      ["Python", "PostgreSQL"],
      "- Current configuration state is compared against the expected or previously known state.",
      [
        "- Configuration changes are evaluated automatically.",
        "- Comparison results are persisted for visibility and historical tracking.",
        "- The workflow runs on a 15-minute schedule."
      ],
      "schedule: */15 * * * *\ncompare: current vs expected",
      "A repeatable comparison loop identifies configuration changes without waiting for a manual audit."
    ),

    step(
      "surface",
      "drift visibility",
      ["Celery", "PostgreSQL"],
      "- Detected differences are processed and surfaced so operators can identify which servers, files, and tenants require attention.",
      [
        "- The workflow covers 64 shared tenants.",
        "- Background processing supports repeated fleet-wide checks.",
        "- Stored results provide an operational record of detected drift."
      ],
      "drift: detected\nstatus: persisted",
      "Configuration drift becomes visible as an actionable operational signal instead of a manual discovery exercise."
    ),

    step(
      "act",
      "operations workflow",
      ["PostgreSQL", "Flask"],
      "- Drift results feed back into the central hosting operations workflow for investigation and remediation.",
      [
        "- Operators can identify the affected server and configuration.",
        "- Drift can be investigated alongside the other server details in the operations dashboard.",
        "- The detection workflow provides the signal while remediation remains an explicit operational action."
      ],
      "workflow:\n  detect -> investigate -> remediate",
      "Drift detection closes the loop between automated monitoring and day-to-day server operations."
    )
  ],
problem:
  "Manual configuration audits made it difficult to reliably spot unexpected changes across the production fleet.",

decision:
  "Automated remote collection, normalization, hashing, and comparison of configuration state on a 15-minute cycle.",

result:
  "Created a continuous drift-detection loop that gives operators a persistent, actionable view of configuration changes.",
  improve:
   "Connect drift results to the operations hub with ownership, severity, context, remediation status, and affected-server workflows.",
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
      "- Each customer environment is represented through configuration-driven YAML rather than hard-coded test definitions.",
      [
        "- Customer-specific URLs, environments, checks, and test parameters are defined through configuration.",
        "- The same test framework can be reused across different customer environments.",
        "- New customers can be added without creating a separate test implementation."
      ],
      "customer: example\nchecks: enabled\nenvironment: production",
      "Configuration-driven onboarding makes customer coverage repeatable and scalable."
    ),

    step(
      "pipeline",
      "test pipeline",
      ["Azure DevOps", "YAML"],
      "- Azure DevOps turns the customer configuration into an executable validation pipeline.",
      [
        "- The pipeline validates the customer configuration before execution.",
        "- Customer-specific YAML is generated or consumed as part of the pipeline flow.",
        "- Validation and test stages provide a repeatable execution path."
      ],
      "stages:\n  - validate\n  - generate\n  - test",
      "A standardized pipeline removes customer-by-customer manual test setup."
    ),

    step(
      "secrets",
      "secure credentials",
      ["Azure Key Vault"],
      "- Credentials and sensitive test values are retrieved securely during test execution.",
      [
        "- Azure Key Vault stores the secrets required by the test framework.",
        "- Customer configuration references secrets rather than embedding credentials.",
        "- The same secure pattern can be reused across customer environments."
      ],
      "secret:\n  source: key-vault\n  reference: customer-ref",
      "Secure secret handling keeps production validation automated without exposing customer credentials in test configuration."
    ),

    step(
      "checks",
      "synthetic validation",
      ["C#", "Playwright"],
      "- Playwright-based synthetic checks exercise real customer-facing workflows against production environments.",
      [
        "- Checks validate access, authentication, connectivity, and customer-specific application signals.",
        "- Tests execute on a recurring 5–10 minute cadence.",
        "- The framework supports the same validation model across 169+ customer environments."
      ],
      "dotnet test --filter synthetic\nschedule: 5-10m",
      "Synthetic checks continuously exercise critical customer paths instead of relying only on post-change manual validation."
    ),

    step(
      "signal",
      "failure signal",
      ["Azure DevOps", "Playwright"],
      "- Each execution produces a visible pass or failure signal that can be used to identify issues after changes or during normal operation.",
      [
        "- Pipeline results show whether the expected customer workflow completed successfully.",
        "- Failures provide an early signal that an environment may require investigation.",
        "- The same reporting path is used across the customer fleet."
      ],
      "result: pass | fail\nstatus: visible",
      "Continuous test results turn customer-facing failures into an observable operational signal."
    )
  ],
  problem:
    "Manual validation did not scale consistently across the customer fleet.",

  decision:
    "Built a YAML-driven Azure DevOps pipeline with Playwright checks and Key Vault-backed credentials.",

  result:
    "169+ customer environments are continuously validated every 5–10 minutes.",

  improve:
    "Next, connect test failures to the central operations dashboards with customer, server, and deployment context for faster investigation and remediation."
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
      ["Docker"],
      "- Application workloads are packaged into optimized container images for consistent deployment.",
      [
        "- Docker images provide a repeatable runtime artifact.",
        "- The image build was optimized to remove unnecessary layers and dependencies.",
        "- The resulting images were 35% smaller and better suited for Kubernetes workloads."
      ],
      "docker build -t service:latest .",
      "Smaller container images reduced deployment and runtime overhead."
    ),

    step(
      "cluster",
      "EKS platform",
      ["AWS EKS", "Kubernetes"],
      "- Containerized workloads run on a managed Kubernetes platform using AWS EKS and Linux EC2 nodes.",
      [
        "- Kubernetes provides the workload orchestration layer.",
        "- EKS manages the control-plane side of the platform.",
        "- Deployments and application resources are managed through Kubernetes manifests."
      ],
      "kubectl apply -f deployment.yaml",
      "EKS provides a repeatable production runtime for containerized workloads."
    ),

    step(
      "route",
      "traffic + scaling",
      ["NGINX Ingress", "AWS ALB", "HPA"],
      "- Application traffic is routed through the ingress and load-balancing layer while Kubernetes automatically adjusts workload capacity.",
      [
        "- AWS ALB provides the external load-balancing path.",
        "- NGINX Ingress manages application-level routing.",
        "- Horizontal Pod Autoscaling adjusts replicas based on workload demand."
      ],
      "ingress: nginx\nload_balancer: alb\nautoscaling: hpa",
      "Automated routing and horizontal scaling improved workload responsiveness by 40%."
    ),

    step(
      "logs",
      "log processing",
      ["Apache Airflow", "AWS S3"],
      "- Operational logs flow through an automated processing pipeline for storage and downstream analysis.",
      [
        "- Airflow orchestrates recurring log-processing workflows.",
        "- S3 provides durable storage for the processed data.",
        "- The pipeline handles millions of log records per day."
      ],
      "airflow dags trigger logs\nstorage: s3",
      "An automated log pipeline turned high-volume production data into a repeatable operational workflow."
    ),

    step(
      "observe",
      "observe + optimize",
      ["Grafana", "CloudWatch"],
      "- Application health, infrastructure behavior, and AWS usage are monitored to close the reliability and cost loop.",
      [
        "- Grafana provides operational dashboards and service visibility.",
        "- CloudWatch provides AWS infrastructure and application telemetry.",
        "Cost usage is reviewed alongside production health to identify optimization opportunities."
      ],
      "observe: grafana + cloudwatch\ncost: $700 -> $450",
      "Observability and cost monitoring helped reduce production downtime by 45% while lowering monthly AWS spend."
    )
  ],
  problem:
    "The existing production setup needed stronger scaling, more efficient workloads, and better visibility into reliability and infrastructure spend.",

  decision:
    "Containerized workloads on EKS with optimized images, automated scaling, layered traffic management, Airflow log pipelines, and Grafana/CloudWatch observability.",

  result:
    "Reduced image size by 35%, improved scaling by 40%, reduced downtime by 45%, and lowered monthly AWS cost from $700 to $450.",

  improve:
    "Next, formalize service SLOs, alert thresholds, and error budgets so reliability decisions are tied to measurable production objectives."
},
{
  id: "event-organizer",
  index: "06",
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
      "- Application and deployment changes begin as version-controlled Git changes.",
      [
        "- Git stores the desired application state.",
        "- Deployment configuration is versioned alongside the application.",
        "- Changes become auditable and reproducible through the repository."
      ],
      "git push origin main",
      "Git becomes the single source of deployment intent."
    ),

    step(
      "infra",
      "private AWS infrastructure",
      ["Terraform", "AWS"],
      "- Terraform defines and provisions the AWS infrastructure required by the application.",
      [
        "- Infrastructure is defined as code.",
        "- The application runs within a private-subnet network design.",
        "- Infrastructure changes can be reviewed and reproduced through Terraform."
      ],
      "terraform apply\nnetwork: private",
      "Infrastructure provisioning becomes repeatable and version-controlled."
    ),

    step(
      "sync",
      "GitOps reconciliation",
      ["ArgoCD"],
      "- ArgoCD continuously compares the Git-defined desired state with the live Kubernetes environment and reconciles differences.",
      [
        "- Git remains the source of deployment intent.",
        "- ArgoCD automatically synchronizes application changes into the cluster.",
        "- Self-healing restores the declared state when runtime drift occurs."
      ],
      "argocd app sync event-organizer\nsync: automated",
      "Self-healing GitOps removes manual deployment synchronization and supports frequent releases."
    ),

    step(
      "runtime",
      "EKS runtime",
      ["EKS", "Kubernetes"],
      "- The application runs as a Kubernetes workload on EKS.",
      [
        "- EKS provides the production runtime.",
        "- Kubernetes manages the deployed application resources.",
        "- The same deployment model is reused across releases."
      ],
      "kubectl get pods\nnamespace: event-organizer",
      "A consistent Kubernetes runtime makes releases repeatable and easier to recover."
    ),

    step(
      "data",
      "RDS persistence",
      ["RDS", "AWS"],
      "- Application state is persisted independently from the Kubernetes runtime through Amazon RDS.",
      [
        "- RDS provides managed relational persistence.",
        "- Application and infrastructure lifecycles remain separated from database state.",
        "- The production system maintains 99.9% uptime."
      ],
      "database: rds\nstatus: connected",
      "Managed persistence keeps application data independent from application deployments."
    )
  ],

  problem:
    "Manual deployment and infrastructure workflows made frequent releases and recovery harder to reproduce consistently.",

  decision:
    "Defined AWS infrastructure with Terraform and used Git as the desired state for self-healing ArgoCD deployments on EKS.",

  result:
    "The platform supports 10+ deployments per day with self-healing synchronization and 99.9% uptime.",

  improve:
    "Next, strengthen the platform with automated RDS backup-restore verification and disaster-recovery testing."
},
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
    "Cloud & Containers": ["AWS", "Azure", "EKS", "Kubernetes", "Docker", "EC2", "VPC", "RDS"],
    "CI/CD & IaC": ["GitHub Actions", "Azure DevOps", "Terraform", "ArgoCD", "Ansible", "Docker"],
    "Security & Observability": ["Azure Key Vault", "CloudWatch", "Grafana", "NGINX", "RBAC", "Airflow", "security checks"],
    "Languages & Practices": ["Python", "C#", "PowerShell", "Node.js", "PostgreSQL", "Playwright", "Linux", "WinRM", "React", "Neo4j GDS", "BigQuery", "GraphRAG"],
  },
} as const;

export const allTags: CaseTag[] = ["provisioning", "fleet", "reliability", "observability", "gitops", "cost"];
