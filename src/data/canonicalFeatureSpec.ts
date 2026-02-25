/**
 * CARLOS Canonical Feature Specification
 * Auto-extracted from full codebase introspection
 * Generated: 2026-02-07
 */

export const canonicalFeatureSpec = {
  canonical_feature_spec: {
    meta: {
      app_name: "CARLOS",
      full_name: "Compliance & Assurance Retail Lifecycle Operating System",
      vendor: "THT",
      platform: "Lovable (AI-accelerated development)",
      tech_stack: [
        "React 18.3", "TypeScript", "Tailwind CSS", "Vite", "React Router 6",
        "TanStack React Query 5", "Framer Motion", "Recharts", "shadcn/ui",
        "Radix UI", "@dnd-kit", "date-fns", "Zod", "React Hook Form",
        "Lucide React", "Sonner", "cmdk", "Vaul", "react-simple-maps",
        "react-resizable-panels", "embla-carousel-react", "next-themes"
      ],
      version_observed: "0.0.0 (prototype)",
      extraction_date: new Date().toISOString(),
      extraction_method: "automated_codebase_introspection",
      total_screens: 22,
      total_components: 130,
      total_routes: 21,
      total_zustand_stores: 0,
      total_api_endpoints_or_mock_services: 0,
      build_status: "prototype",
      notes: "Auto-extracted from full codebase scan. All data is mock/seed. State management via React Context + hooks (no Zustand). No backend API — all client-side."
    },

    design_principles: {
      core_pillars: [
        "AI-First Compliance",
        "Scheme-Agnostic Architecture",
        "DPP-Ready by Design"
      ],
      architecture_pattern: "Component-based SPA with React Router v6. State managed via React Context (UserContext, DraftsContext) and custom hooks (useAIContext, useWidgetConfig). Feature flags via featureFlags.ts for progressive rollout. Layout via AppLayout wrapper with collapsible sidebar.",
      ai_philosophy: "AI is embedded throughout: task prioritisation with explainable reasoning (whyProblem, evidence, consequenceIfIgnored, fastestFix), risk scoring on TRFs/suppliers/products, readiness gauges with confidence levels, scenario simulation for what-if analysis, and an AI assistant (Carlos) available on every page. AI reasoning is always transparent — never a black box.",
      extensibility_model: "Sustainability evidence graph is scheme-agnostic — new compliance schemes (bluesign, GOTS, OEKO-TEX, ZDHC) can be added as data entries without code changes. Component/testing/approval model is generic enough to support any product type.",
      role_adaptive_design: "Every screen adapts per UserRole (buyer, supplier, lab_technician, manager, admin). Dashboard widgets reorder by role. Task prioritisation filters by role relevance. Sidebar shows admin-only sections conditionally. Demo role switching via user dropdown."
    },

    platform_architecture: {
      deployment: "Lovable Cloud hosting (Vite SPA). Published at tht-ai-carlos.lovable.app",
      frontend_framework: "React 18.3 with TypeScript, Vite bundler, Tailwind CSS + shadcn/ui component library",
      state_management: "React Context API — no Zustand stores. Key contexts: UserContext (role switching, demo users), DraftsContext (draft management). Custom hooks: useAIContext (AI computation), useWidgetConfig (dashboard widget configuration with localStorage persistence), useInspectionDragDrop, useSwipeGesture.",
      routing: {
        router_type: "react-router-dom v6",
        total_routes: 21,
        route_map: [
          { path: "/", component: "Dashboard", auth_required: false, role_restrictions: ["buyer","supplier","lab_technician","manager","admin"], description: "AI-prioritised task dashboard with role-adaptive widgets, readiness gauge, scenario simulator" },
          { path: "/styles", component: "Styles", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Product collection/style inventory with status tracking" },
          { path: "/styles/:id", component: "StyleDetail", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Style detail with component linking, testing levels, care labels, GSW" },
          { path: "/components", component: "Components", auth_required: false, role_restrictions: ["buyer","supplier"], description: "Fabric/trim/lining component library" },
          { path: "/testing-levels", component: "TestingLevels", auth_required: false, role_restrictions: ["buyer","lab_technician"], description: "Base/Bulk/Garment testing level gate progression" },
          { path: "/care-labelling", component: "CareLabelling", auth_required: false, role_restrictions: ["buyer"], description: "Care label package creation with symbol selection" },
          { path: "/gsw", component: "GSW", auth_required: false, role_restrictions: ["buyer","manager"], description: "Gold Seal Workbook submission and compliance scores" },
          { path: "/approval-levels", component: "SelfApprovalLevels", auth_required: false, role_restrictions: ["admin"], description: "Self-approval entitlement management (None/Bronze/Silver/Gold)" },
          { path: "/trfs", component: "TRFs", auth_required: false, role_restrictions: ["buyer","supplier","lab_technician","manager"], description: "Test Request Form list with status, priority, SLA tracking" },
          { path: "/trfs/:id", component: "TRFDetail", auth_required: false, role_restrictions: ["buyer","supplier","lab_technician","manager"], description: "TRF detail with timeline, test results, documents, approval workflow" },
          { path: "/products", component: "Products", auth_required: false, role_restrictions: ["buyer","supplier"], description: "Product inventory with compliance status and CSV import" },
          { path: "/products/:id", component: "ProductDetail", auth_required: false, role_restrictions: ["buyer","supplier"], description: "Product detail with image gallery, specifications, risk scoring" },
          { path: "/suppliers", component: "SuppliersEnhanced", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Enhanced supplier management with tier classification, compliance scoring, bulk actions" },
          { path: "/suppliers/new", component: "SupplierCreate", auth_required: false, role_restrictions: ["buyer","admin"], description: "Multi-step supplier onboarding wizard" },
          { path: "/suppliers/inbox", component: "SupplierInbox", auth_required: false, role_restrictions: ["buyer","supplier"], description: "Supplier task inbox with SLA tracking" },
          { path: "/suppliers/:id", component: "SupplierDetail", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Supplier detail with performance charts, certifications, linked styles" },
          { path: "/lab", component: "Lab", auth_required: false, role_restrictions: ["lab_technician","manager"], description: "Lab queue management with sample tracking and priority sorting" },
          { path: "/inspections", component: "InspectionsEnhanced", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Enhanced inspections with table/kanban views, filters, bulk actions" },
          { path: "/inspections/new", component: "InspectionCreate", auth_required: false, role_restrictions: ["buyer","admin"], description: "Inspection scheduling form" },
          { path: "/inspections/calendar", component: "Inspections", auth_required: false, role_restrictions: ["buyer","manager"], description: "Calendar view of inspections with world map" },
          { path: "/inspections/:id", component: "InspectionDetail", auth_required: false, role_restrictions: ["buyer","manager"], description: "Inspection detail with findings, checklists, photos, corrective actions" },
          { path: "/analytics", component: "Insight", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Analytics dashboard with Stripe-inspired metrics, charts, date range filtering" },
          { path: "/support-center", component: "SupportCenter", auth_required: false, role_restrictions: ["buyer","supplier","lab_technician","manager","admin"], description: "Help & support center with AI-powered answers, guided resolutions, escalation" },
          { path: "/settings", component: "Settings", auth_required: false, role_restrictions: ["buyer","supplier","lab_technician","manager","admin"], description: "User settings and preferences" },
          { path: "/documentation", component: "Documentation", auth_required: false, role_restrictions: ["admin"], description: "As-built documentation with app map, roles, workflows, data model, export" },
          { path: "/demo", component: "DemoDashboard", auth_required: false, role_restrictions: ["buyer","manager","admin"], description: "Demo dashboard with mock AI assessment, readiness gauge scenarios, real-time priority feed" },
        ]
      },
      data_layer: {
        persistence: "All data is mock/seed in TypeScript files. Some features use localStorage for session persistence (created suppliers, widget config, demo mode, feature flags). No Supabase or backend API.",
        mock_data_files: [
          "src/data/mockData.ts",
          "src/data/stylesData.ts",
          "src/data/mockSuppliers.ts",
          "src/data/mockInspections.ts",
          "src/data/mockReports.ts",
          "src/data/helpData.ts",
          "src/data/helpKnowledgeBase.ts",
          "src/data/guidedResolutions.ts",
          "src/data/inspectionDetailData.ts"
        ],
        api_integration_points: ["not_implemented"],
        data_models: [
          { entity: "User", fields: ["id:string","name:string","email:string","role:UserRole","avatar?:string","avatarUrl?:string","company?:string","department?:string"], relationships: ["User → Tasks (1:N)", "User → ApprovalEntitlement (1:1)"] },
          { entity: "TRF", fields: ["id","reference","productName","supplier","factory","status:TRFStatus","priority:Priority","progress:number","dueDate","createdAt","updatedAt","assignee?","category","testCount","passedTests","failedTests","riskScore?","slaRemaining?","description?","productCode?","lotNumber?","sampleCount?","timeline?:TRFTimelineEvent[]","tests?:TRFTest[]","documents?:TRFDocument[]"], relationships: ["TRF → TRFTests (1:N)", "TRF → TRFDocuments (1:N)", "TRF → TRFTimeline (1:N)", "TRF → Supplier (N:1)", "TRF → LabSample (1:N)"] },
          { entity: "ProductCollection (Style)", fields: ["id","name","season","brand","department","supplierId","supplierName","factories:string[]","status:CollectionStatus","riskScore","readinessScore","componentIds:string[]","baseTesting:TestingLevelState","bulkTesting:TestingLevelState","garmentTesting:TestingLevelState","careLabelPackage?","gswSubmission?","dppPassportId?","createdAt","updatedAt"], relationships: ["Style → Components (N:M)", "Style → Supplier (N:1)", "Style → TestingLevels (1:3)", "Style → CareLabel (1:1)", "Style → GSW (1:1)"] },
          { entity: "Component", fields: ["id","name","type:ComponentType","composition","construction","nominatedSource?","areaPercentage:number","riskAssessmentRequired:boolean","supplierId","supplierName","createdAt","updatedAt"], relationships: ["Component → Styles (N:M)", "Component → Supplier (N:1)"] },
          { entity: "Supplier (basic)", fields: ["id","name","email","contactPerson","country","factoryCount","status","complianceScore","qualityScore","deliveryScore","lastAudit?","certificatesExpiring","openTRFs"], relationships: ["Supplier → TRFs (1:N)", "Supplier → Styles (1:N)", "Supplier → Inspections (1:N)"] },
          { entity: "RichSupplier (enhanced)", fields: ["id","code","name","country","city?","factoryCount","status","tier:SupplierTier","complianceStatus","overallScore","complianceScore","qualityScore","deliveryScore","contacts:SupplierContact[]","certifications:SupplierCertification[]","specializations","openTRFs","activeStyles","passRate","lastAuditDate?","nextAuditDate?"], relationships: ["RichSupplier → Certifications (1:N)", "RichSupplier → Contacts (1:N)", "RichSupplier → LinkedStyles (1:N)"] },
          { entity: "Inspection", fields: ["id","type:InspectionType","title","description?","factoryId","factoryName","supplierId","supplierName","location","scheduledDate","scheduledTime?","duration","status:InspectionStatus","priority","assignee?","auditorTeam?","findings?","passRate?","notes?","createdAt","completedAt?"], relationships: ["Inspection → Supplier (N:1)", "Inspection → Findings (1:N)", "Inspection → Checklists (1:N)"] },
          { entity: "RichInspection (enhanced)", fields: ["id","inspectionNumber","poNumber","productName","typeCode:InspectionTypeCode","supplierName","factoryName","factoryLocation","inspectorName","scheduledDate","completedDate?","status","result:InspectionResult","riskLevel","score?","priority","sampleSize?","defectsFound?","defects?:InspectionDefect[]"], relationships: ["RichInspection → Defects (1:N)"] },
          { entity: "Product", fields: ["id","name","code","category","supplier","supplierId","description?","imageUrl?","images?:ProductImage[]","status","complianceStatus","lastTested?","activeTRFs","passRate","riskScore","specifications?"], relationships: ["Product → Supplier (N:1)", "Product → TRFs (1:N)", "Product → Images (1:N)"] },
          { entity: "LabSample", fields: ["id","trfReference","sampleType","status","priority","receivedDate","dueDate","assignee?","testType","progress"], relationships: ["LabSample → TRF (N:1)"] },
          { entity: "AIComputedTask", fields: ["id","title","description","priority","impactScore","urgencyScore","riskScore","dependencyChain","slaHoursRemaining?","objectType","objectId","reasoning:AIReasoning","recommendedAction"], relationships: ["AIComputedTask → TRF/Product/Supplier/Inspection (N:1)"] },
          { entity: "CareLabelPackage", fields: ["id","symbols:CareSymbol[]","careWording","hangerSpec?","labelInstructionRef?","isComplete","createdAt","updatedAt"], relationships: ["CareLabel → Style (1:1)", "CareLabel → CareSymbols (1:N)"] },
          { entity: "GSWSubmission", fields: ["id","fileName","fileSize","version","submittedTo?","submittedAt?","approvedBy?","approvedAt?","status","auditTrail:GSWAuditEvent[]"], relationships: ["GSW → Style (1:1)"] },
          { entity: "ApprovalEntitlement", fields: ["userId","level:ApprovalLevel"], relationships: ["ApprovalEntitlement → User (N:1)"] },
        ]
      },
      authentication: {
        method: "Demo role switching via React Context. No real authentication. UserContext provides currentUser and switchRole() function. 5 pre-configured demo users.",
        roles_defined: ["buyer", "supplier", "lab_technician", "manager", "admin"],
        role_switching: "Dropdown in sidebar footer allows switching between 5 demo personas. Role switch is instant and adapts dashboard, navigation visibility, and task filtering."
      },
      mobile_support: {
        responsive: "yes",
        pwa: "no",
        native_apps: "no"
      },
      accessibility: {
        aria_labels: "Partial — shadcn/ui components include ARIA by default. Custom components have limited ARIA.",
        keyboard_navigation: "yes (via Radix UI primitives)",
        screen_reader_support: "partial"
      }
    },

    product_modules: [
      {
        module_name: "Dashboard & AI Task Prioritisation",
        category: "ai_operations",
        route: "/",
        description: "AI-powered command center that computes task priority based on impact, urgency, and risk scores. Adapts layout by user role. Features readiness gauge, scenario simulator, regulatory alerts, and customisable widget grid.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "This isn't just a dashboard — it's an AI command center that computes what you should do first based on downstream impact, SLA pressure, and regulatory risk. Watch how it adapts instantly when I switch roles.",
        features: [
          { name: "AI Task Prioritisation", description: "Tasks ranked by computed impact, urgency, and risk scores with explainable reasoning", implementation_status: "complete", ai_presence: "core", ai_details: "Each task has impactScore, urgencyScore, riskScore computed by useAIContext hook. AIReasoning includes whyProblem, evidence, consequenceIfIgnored, fastestFix.", reasoning_visible: "true", ui_elements: ["AITaskCard with expandable reasoning","Priority badges","SLA countdown","Recommended action buttons"], interactions: ["click to expand reasoning","click recommended action","filter by priority"], data_source: "computed from mockData via useAIContext hook", unique_to_carlos: "true", competitive_notes: "Inspectorio's Paramo AI provides recommendations but doesn't show transparent reasoning chains. CARLOS makes AI thinking visible." },
          { name: "Readiness Gauge", description: "DPP attribute coverage gauge with confidence level and trend indicator", implementation_status: "complete", ai_presence: "heavy", ai_details: "Computes overall readiness score, identifies gaps with severity/reason/estimated resolution days", reasoning_visible: "true", ui_elements: ["Circular gauge","Trend arrow","Confidence badge","Gap list"], interactions: ["hover for details"], data_source: "computed", unique_to_carlos: "true", competitive_notes: "No equivalent in Inspectorio. Unique DPP-readiness visualisation." },
          { name: "Scenario Simulator", description: "What-if analysis: toggle DPP enforcement, adjust regulation thresholds, simulate supplier failures", implementation_status: "complete", ai_presence: "heavy", ai_details: "Computes readiness delta, new critical tasks, affected products, and remediation timeline for hypothetical scenarios", reasoning_visible: "true", ui_elements: ["Toggle switches","Slider","Impact summary cards"], interactions: ["toggle DPP enforcement","adjust regulation threshold","simulate supplier failure"], data_source: "computed", unique_to_carlos: "true", competitive_notes: "No competitor offers what-if scenario simulation for compliance readiness." },
          { name: "Role-Adaptive Layout", description: "Dashboard widgets reorder and filter based on current user role", implementation_status: "complete", ai_presence: "moderate", ai_details: "layoutConfig computed from AIContext determines primary widget and emphasis areas per role", reasoning_visible: "false", ui_elements: ["Dynamic widget grid","Widget catalog","Drag-and-drop reorder"], interactions: ["drag to reorder","toggle widget visibility","open widget catalog"], data_source: "useWidgetConfig with localStorage persistence", unique_to_carlos: "true", competitive_notes: "Inspectorio has role-based views but not AI-computed layout prioritisation." },
          { name: "Regulatory Alerts", description: "Upcoming regulatory deadlines with countdown and impact assessment", implementation_status: "complete", ai_presence: "light", ai_details: "Static regulatory data with computed countdown", reasoning_visible: "false", ui_elements: ["Alert cards","Countdown badges","Impact indicators"], interactions: ["click for details"], data_source: "mock", unique_to_carlos: "true", competitive_notes: "Inspectorio tracks compliance but doesn't surface regulatory horizons proactively." },
          { name: "KPI Summary Widget", description: "Role-specific KPI cards with trend indicators", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["KPI cards","Trend arrows","Target indicators"], interactions: ["hover"], data_source: "mock", unique_to_carlos: "false", competitive_notes: "Standard feature across platforms." },
          { name: "Today / Next Strip", description: "Quick glance at today's critical items, overdue tasks, and upcoming actions", implementation_status: "complete", ai_presence: "light", ai_details: "Computed from AIContext critical items count", reasoning_visible: "false", ui_elements: ["Metric pills","Count badges"], interactions: ["click to navigate"], data_source: "computed", unique_to_carlos: "false", competitive_notes: "Similar to Inspectorio's notification summaries." },
        ],
        screens: [
          { route: "/", screen_name: "Dashboard", layout: "sidebar + main with responsive grid", widgets: ["TodayNextStrip","AITaskCard list","ReadinessGauge","ScenarioSimulator","LabQueueWidget","ConfidenceDashboardWidget","SupplierDashboardWidget","RegulatoryAlerts","KPISummaryWidget","ActivityFeed","WidgetCatalog"], conditional_sections: ["Admin badge (admin only)","Lab queue (lab_technician)","Supplier widget (buyer/manager)","Demo link (demoMode localStorage)"], animations: ["Framer Motion fade-in on cards","Loading spinner during AI computation","Gauge animation"] }
        ]
      },
      {
        module_name: "Styles & Product Collections",
        category: "compliance_management",
        route: "/styles",
        description: "Product collection management with component linking, three-tier testing gates (Base/Bulk/Garment), care label creation, and GSW submission workflow.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Here's where the magic happens — every style flows through a gated testing pipeline. Watch how components are linked, testing progresses through Base to Garment, and care labels are auto-suggested by AI.",
        features: [
          { name: "Style List", description: "Filterable list of product collections with status, season, brand", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Table/card list","Status badges","Filter controls"], interactions: ["filter","sort","click to detail"], data_source: "stylesData.ts mock", unique_to_carlos: "false", competitive_notes: "Standard product listing." },
          { name: "Component Linking", description: "Link fabric/trim/lining components to styles with area percentage tracking", implementation_status: "complete", ai_presence: "light", ai_details: "AI suggests component sets based on style type", reasoning_visible: "true", ui_elements: ["Component cards","Area percentage","Risk assessment flag"], interactions: ["add/remove components","edit area %"], data_source: "stylesData.ts mock", unique_to_carlos: "true", competitive_notes: "Inspectorio doesn't have component-level traceability within product collections." },
          { name: "Testing Level Gates", description: "Three-tier gate progression: Base → Bulk → Garment. Each gate links to TRF.", implementation_status: "complete", ai_presence: "light", ai_details: "AI suggests test plans based on component risk", reasoning_visible: "true", ui_elements: ["Gate stepper","Status indicators","Lock icons (approved gates lock components)"], interactions: ["view gate status","submit for testing","approve gate"], data_source: "stylesData.ts mock", unique_to_carlos: "true", competitive_notes: "Unique three-tier gated testing with component locking. No Inspectorio equivalent." },
          { name: "Care Label Creation", description: "Interactive care symbol selection with AI-suggested labels", implementation_status: "complete", ai_presence: "moderate", ai_details: "AI suggests care label packages based on component composition", reasoning_visible: "true", ui_elements: ["Symbol grid","Care wording editor","Preview"], interactions: ["select symbols","edit wording","AI suggest"], data_source: "stylesData.ts mock", unique_to_carlos: "true", competitive_notes: "No competitor auto-generates care labels from test results." },
          { name: "GSW Submission", description: "Gold Seal Workbook upload, versioning, and approval workflow", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["File upload","Version history","Approval status","Audit trail"], interactions: ["upload","submit","approve/reject"], data_source: "stylesData.ts mock", unique_to_carlos: "false", competitive_notes: "Document submission is standard." },
        ],
        screens: [
          { route: "/styles", screen_name: "Styles List", layout: "sidebar + main", widgets: ["Style cards/table","Filter toolbar","Status summary"], conditional_sections: [], animations: ["Framer Motion list animations"] },
          { route: "/styles/:id", screen_name: "Style Detail", layout: "sidebar + main with tabbed sections", widgets: ["Style header","Components panel","Testing levels stepper","Care label editor","GSW panel","AI assist panel"], conditional_sections: ["AI suggestions based on style status"], animations: ["Tab transitions"] }
        ]
      },
      {
        module_name: "Test Request Forms (TRFs)",
        category: "compliance_management",
        route: "/trfs",
        description: "Full TRF lifecycle management from draft to approval, with timeline tracking, test result monitoring, document management, and AI-powered approval recommendations.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Watch the full testing lifecycle: from request submission through lab testing to AI-recommended approval. The AI explains exactly why it recommends approval — including the evidence it considered.",
        features: [
          { name: "TRF List", description: "Filterable list with status, priority, SLA, progress tracking", implementation_status: "complete", ai_presence: "light", ai_details: "AI-computed priority and risk scores", reasoning_visible: "false", ui_elements: ["Table rows","Status badges","Priority indicators","SLA countdown","Progress bars"], interactions: ["filter","sort","click to detail"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Similar to Inspectorio's test request tracking." },
          { name: "TRF Detail Timeline", description: "Visual timeline of all TRF events: created, submitted, samples received, testing, review, approval", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Vertical timeline","Event cards","Actor attribution","Timestamp"], interactions: ["scroll through events"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Standard audit trail." },
          { name: "Test Results Dashboard", description: "Visual display of all tests with pass/fail status, actual vs threshold values", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Test result cards","Pass/fail badges","Threshold comparison","Category grouping"], interactions: ["expand test details","view notes"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Standard test result display." },
          { name: "TRF Approval Workflow", description: "Approval/rejection workflow with AI recommendation and confidence score", implementation_status: "complete", ai_presence: "heavy", ai_details: "AI recommends approve/reject/escalate with confidence score and reasoning chain", reasoning_visible: "true", ui_elements: ["Approval panel","AI recommendation card","Confidence indicator","Action buttons"], interactions: ["approve","reject","escalate","request retest"], data_source: "computed", unique_to_carlos: "true", competitive_notes: "Inspectorio doesn't surface AI approval recommendations with transparent reasoning." },
          { name: "Document Management", description: "Upload and manage COAs, test reports, sample photos, specifications", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Document list","Type badges","Upload button","Download action"], interactions: ["upload","download","preview"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Standard document management." },
        ],
        screens: [
          { route: "/trfs", screen_name: "TRF List", layout: "sidebar + main", widgets: ["TRF table","Filters","Status summary stats"], conditional_sections: [], animations: [] },
          { route: "/trfs/:id", screen_name: "TRF Detail", layout: "sidebar + main with tabs", widgets: ["TRF header","Timeline tab","Test results tab","Documents tab","Approval workflow panel"], conditional_sections: ["Approval actions visible to buyer/admin"], animations: ["Tab transitions","Timeline animations"] }
        ]
      },
      {
        module_name: "Suppliers Management",
        category: "compliance_management",
        route: "/suppliers",
        description: "Comprehensive supplier lifecycle management with tier classification, performance scoring, certification tracking, bulk actions, and multi-step onboarding wizard.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Supplier management goes beyond tracking — we classify by tier, score performance across quality/compliance/delivery, and flag certificate expirations proactively.",
        features: [
          { name: "Enhanced Supplier List", description: "Table with tier badges, compliance status, scores, bulk actions", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Table","TierBadge","ComplianceBadge","Score indicators","Bulk action toolbar","Filters"], interactions: ["filter by status/tier/compliance/country","sort","select multiple","bulk actions","click to detail"], data_source: "mockSuppliers.ts with localStorage persistence", unique_to_carlos: "false", competitive_notes: "Similar to Inspectorio's supplier management." },
          { name: "Supplier Onboarding Wizard", description: "5-step form: company info, contacts, tier/compliance, certifications, specializations", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Step indicator","Form fields","Validation","Review step"], interactions: ["fill form","navigate steps","submit"], data_source: "localStorage persistence", unique_to_carlos: "false", competitive_notes: "Standard onboarding flow." },
          { name: "Supplier Detail", description: "Performance charts, certifications, contacts, linked styles, audit history", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Performance chart (Recharts)","Certification cards","Contact list","Linked styles table","KPI cards"], interactions: ["view charts","expand certifications"], data_source: "mockSuppliers.ts", unique_to_carlos: "false", competitive_notes: "Standard supplier profile." },
          { name: "Supplier Inbox", description: "Task inbox for supplier-related actions with SLA tracking", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Task list","Priority badges","SLA indicators","Action buttons"], interactions: ["filter","sort","complete task"], data_source: "mockSuppliers.ts", unique_to_carlos: "false", competitive_notes: "Inspectorio has similar supplier task management." },
        ],
        screens: [
          { route: "/suppliers", screen_name: "Suppliers List", layout: "sidebar + main", widgets: ["SupplierStats","SupplierFilters","SupplierTable","SupplierBulkActions"], conditional_sections: [], animations: [] },
          { route: "/suppliers/new", screen_name: "Supplier Create", layout: "sidebar + main", widgets: ["Multi-step wizard form"], conditional_sections: [], animations: ["Step transitions"] },
          { route: "/suppliers/:id", screen_name: "Supplier Detail", layout: "sidebar + main with drawer", widgets: ["Supplier header","Performance chart","Certifications","Contacts","Linked styles"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Inspections",
        category: "compliance_management",
        route: "/inspections",
        description: "Dual-view inspection management with table/kanban views, calendar with world map, inspection creation, detail with findings and corrective actions.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Inspections across your entire supply chain — visualised on a world map, managed through kanban boards, with every finding tracked to corrective action. This replaces spreadsheets and emails overnight.",
        features: [
          { name: "Table/Kanban Toggle", description: "Switch between table and kanban board views of inspections", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Table view","Kanban columns","Toggle switch","Filter bar"], interactions: ["toggle view","filter","sort","drag (kanban)","click to detail"], data_source: "mockInspections.ts", unique_to_carlos: "false", competitive_notes: "Inspectorio has similar dual views." },
          { name: "Calendar + World Map", description: "Calendar view of scheduled inspections with interactive world map showing factory locations", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Calendar grid","Map (react-simple-maps)","Factory pins","Day cell inspection dots"], interactions: ["navigate months","click map pin","drag inspection to reschedule"], data_source: "mockInspections.ts", unique_to_carlos: "true", competitive_notes: "Map-based inspection visualisation is more visual than Inspectorio's list-based scheduling." },
          { name: "Inspection Detail", description: "Full inspection record with findings, checklists, photos, corrective actions", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Finding cards","Severity badges","Checklist items","Photo gallery","Corrective action tracker","Workflow progress"], interactions: ["view findings","check items","view photos"], data_source: "inspectionDetailData.ts", unique_to_carlos: "false", competitive_notes: "Standard inspection detail." },
          { name: "Bulk Actions", description: "Select multiple inspections for bulk status updates", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Select checkboxes","Bulk action toolbar"], interactions: ["select","bulk update status"], data_source: "mock", unique_to_carlos: "false", competitive_notes: "Standard bulk operations." },
        ],
        screens: [
          { route: "/inspections", screen_name: "Inspections (Enhanced)", layout: "sidebar + main", widgets: ["InspectionStats","InspectionFilters","InspectionTable or InspectionKanban","InspectionBulkActions"], conditional_sections: ["View toggle"], animations: [] },
          { route: "/inspections/calendar", screen_name: "Inspections Calendar", layout: "sidebar + main", widgets: ["Calendar grid","WorldMap","FactoryDetailsModal"], conditional_sections: [], animations: ["Map zoom/pan"] },
          { route: "/inspections/:id", screen_name: "Inspection Detail", layout: "sidebar + main", widgets: ["Inspection header","Findings list","Checklists","Photos","Corrective actions","Workflow progress"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Lab Operations",
        category: "compliance_management",
        route: "/lab",
        description: "Lab technician queue management with sample tracking, priority-based sorting, and progress monitoring.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "Lab technicians get their own optimised view — samples sorted by priority and SLA, so the most critical testing happens first.",
        features: [
          { name: "Lab Queue", description: "Priority-sorted sample queue with status, assignee, and progress tracking", implementation_status: "complete", ai_presence: "light", ai_details: "Priority sorting influenced by AI context", reasoning_visible: "false", ui_elements: ["Sample cards","Priority badges","Progress bars","Assignee avatars"], interactions: ["sort","filter","click to detail"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Inspectorio LabSync has similar lab management." },
        ],
        screens: [
          { route: "/lab", screen_name: "Lab Queue", layout: "sidebar + main", widgets: ["Lab KPIs","Sample queue"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Products & Catalogue",
        category: "compliance_management",
        route: "/products",
        description: "Product inventory with compliance tracking, image gallery, CSV import, and risk scoring.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "Every product tracked with compliance status, risk score, and linked testing — plus CSV import for bulk onboarding.",
        features: [
          { name: "Product List", description: "Filterable product catalogue with compliance status and risk scores", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Product cards/table","Status badges","Risk indicators"], interactions: ["filter","sort","search","click to detail"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Standard product management." },
          { name: "CSV Import", description: "Bulk product import via CSV file upload with preview and validation", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Upload dialog","Preview table","Validation feedback"], interactions: ["upload CSV","preview","confirm import"], data_source: "client-side parsing", unique_to_carlos: "false", competitive_notes: "Standard import capability." },
          { name: "Product Image Gallery", description: "Multi-image gallery with primary image selection", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Image grid","Lightbox","Primary badge"], interactions: ["click to enlarge","set primary"], data_source: "mockData.ts", unique_to_carlos: "false", competitive_notes: "Standard." },
        ],
        screens: [
          { route: "/products", screen_name: "Products", layout: "sidebar + main", widgets: ["Product grid","Filters","CSV import dialog"], conditional_sections: [], animations: [] },
          { route: "/products/:id", screen_name: "Product Detail", layout: "sidebar + main", widgets: ["Product header","Image gallery","Specifications","Compliance status","Risk score","Linked TRFs"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Analytics & Insights",
        category: "reporting",
        route: "/analytics",
        description: "Stripe-inspired analytics dashboard with interactive charts, date range filtering, saved views, AI narrative cards, and scheduled reports.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Analytics that actually tell you something. AI-generated narrative cards explain what the numbers mean, and you can save custom views and schedule automated reports.",
        features: [
          { name: "Stripe-Inspired Metrics", description: "Overview metrics with trend sparklines following Stripe Dashboard aesthetic", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["StripeMetricCard","Sparkline charts","Trend indicators"], interactions: ["hover for details","click to drill down"], data_source: "mockReports.ts", unique_to_carlos: "true", competitive_notes: "More polished than Inspectorio's analytics." },
          { name: "AI Narrative Cards", description: "AI-generated plain-English summaries of key trends and anomalies", implementation_status: "complete", ai_presence: "heavy", ai_details: "AI generates narrative explanations of data trends, anomalies, and recommended actions", reasoning_visible: "true", ui_elements: ["Narrative card","Insight summary","Action suggestions"], interactions: ["read","dismiss","act on suggestion"], data_source: "computed", unique_to_carlos: "true", competitive_notes: "Inspectorio doesn't generate narrative analytics." },
          { name: "Date Range Filtering", description: "Interactive date range selector with presets", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["DateRangeToolbar","Preset buttons","Calendar picker"], interactions: ["select preset","custom range"], data_source: "client-side", unique_to_carlos: "false", competitive_notes: "Standard." },
          { name: "Saved Views & Scheduled Reports", description: "Save custom analytics configurations and schedule automated report delivery", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["SavedViewsDropdown","ScheduleDialog","EditColumnsPopover"], interactions: ["save view","schedule report","edit columns"], data_source: "ui_only", unique_to_carlos: "false", competitive_notes: "Standard enterprise feature." },
          { name: "Transaction Detail Drawer", description: "Slide-out drawer with full transaction details", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Drawer panel","Transaction fields","Timeline"], interactions: ["click row to open","close"], data_source: "mock", unique_to_carlos: "false", competitive_notes: "Standard." },
          { name: "Multiple Report Views", description: "Pipeline flow, risk summary, compliance health, collection readiness funnel, balances", implementation_status: "complete", ai_presence: "light", ai_details: "Risk scoring computation", reasoning_visible: "false", ui_elements: ["PipelineFlowDashboard","RiskSummaryDashboard","ComplianceHealthView","CollectionReadinessFunnel","BalancesView"], interactions: ["switch views","interact with charts"], data_source: "mockReports.ts", unique_to_carlos: "true", competitive_notes: "More comprehensive reporting views than Inspectorio." },
        ],
        screens: [
          { route: "/analytics", screen_name: "Insight", layout: "sidebar + main with tabs", widgets: ["DateRangeToolbar","StripeOverviewTab","StripeTransactionsTab","AINarrativeCard","SavedViewsDropdown","Report sub-views"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Support Center & AI Assistant",
        category: "ai_operations",
        route: "/support-center",
        description: "Integrated help and support center with AI-powered answers, guided resolutions, knowledge base, escalation, and the Carlos AI chat assistant available globally.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Support doesn't mean waiting for a ticket response. Carlos AI answers questions instantly using the knowledge base, and guided resolutions walk users through complex issues step by step.",
        features: [
          { name: "AI-Powered Answers", description: "Ask questions and get AI-generated answers from the knowledge base", implementation_status: "complete", ai_presence: "core", ai_details: "Simulated AI search over helpKnowledgeBase.ts with relevance-ranked results", reasoning_visible: "true", ui_elements: ["Search input","AI answer panel","Source citations"], interactions: ["type question","view answer","click source"], data_source: "helpKnowledgeBase.ts", unique_to_carlos: "true", competitive_notes: "More contextual than Inspectorio's static help center." },
          { name: "Guided Resolutions", description: "Step-by-step troubleshooting flows for common issues", implementation_status: "complete", ai_presence: "moderate", ai_details: "Rule-based decision trees with AI-suggested next steps", reasoning_visible: "false", ui_elements: ["Step cards","Decision buttons","Progress indicator"], interactions: ["follow steps","select options","resolve"], data_source: "guidedResolutions.ts", unique_to_carlos: "true", competitive_notes: "No equivalent in Inspectorio." },
          { name: "Carlos AI Chat (Global)", description: "Intercom-style floating chat assistant available on every page", implementation_status: "complete", ai_presence: "core", ai_details: "Simulated AI chat with context-aware responses, suggestions, and source links", reasoning_visible: "true", ui_elements: ["Floating launcher button","Chat panel","Message bubbles","Suggestion chips","Source links"], interactions: ["open/close chat","type message","click suggestion","view sources"], data_source: "simulated", unique_to_carlos: "true", competitive_notes: "Always-available AI assistant is a differentiator vs Inspectorio's separate support portal." },
          { name: "Escalation", description: "Escalate issues to human support with context and form submission", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Escalation form","Context summary","Submit button"], interactions: ["fill form","submit"], data_source: "ui_only", unique_to_carlos: "false", competitive_notes: "Standard." },
          { name: "Help Drawer", description: "Slide-out help panel with contextual articles and drafts", implementation_status: "complete", ai_presence: "light", ai_details: "Context-aware article suggestions", reasoning_visible: "false", ui_elements: ["Drawer panel","Article list","Drafts tab","AI answer tab"], interactions: ["open/close","search","read article","save draft"], data_source: "helpData.ts", unique_to_carlos: "false", competitive_notes: "Standard." },
        ],
        screens: [
          { route: "/support-center", screen_name: "Support Center", layout: "sidebar + main with intent cards", widgets: ["CategoryNav","IntentCards","AskCarlosPanel","GuidedResolution","ArticlePanel","EscalationPanel"], conditional_sections: [], animations: ["Panel transitions"] },
        ]
      },
      {
        module_name: "Components & Testing Levels",
        category: "compliance_management",
        route: "/components",
        description: "Component library for fabrics, trims, and linings with testing level gate management.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "Components are reusable building blocks — link them across multiple styles, and testing levels gate progression ensures nothing ships without proper certification.",
        features: [
          { name: "Component Library", description: "Catalogue of fabric/trim/lining components with composition, construction, supplier", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Component cards","Type badges","Composition details","Area percentage"], interactions: ["view","filter","search"], data_source: "stylesData.ts", unique_to_carlos: "true", competitive_notes: "Component-level traceability is unique to CARLOS." },
          { name: "Testing Level Gates", description: "Visual gate progression: Base → Bulk → Garment with approval tracking", implementation_status: "complete", ai_presence: "light", ai_details: "AI suggests test plans", reasoning_visible: "true", ui_elements: ["Gate stepper","Status badges","Lock indicators","TRF links"], interactions: ["view gate status","link TRF","approve"], data_source: "stylesData.ts", unique_to_carlos: "true", competitive_notes: "Three-tier gated testing with progressive locking is unique." },
        ],
        screens: [
          { route: "/components", screen_name: "Components", layout: "sidebar + main", widgets: ["Component grid","Filter bar"], conditional_sections: [], animations: [] },
          { route: "/testing-levels", screen_name: "Testing Levels", layout: "sidebar + main", widgets: ["Testing level matrix","Gate status indicators"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Care Labelling",
        category: "compliance_management",
        route: "/care-labelling",
        description: "Interactive care label package creation with symbol selection and AI-suggested labels.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "AI-suggested care labels based on component composition — no more manual lookups. Select symbols, preview the label, and attach it to the style.",
        features: [
          { name: "Care Symbol Selection", description: "Interactive grid of care symbols with drag-and-drop arrangement", implementation_status: "complete", ai_presence: "moderate", ai_details: "AI suggests appropriate care symbols based on fabric composition", reasoning_visible: "true", ui_elements: ["Symbol grid","Preview panel","Wording editor"], interactions: ["select symbols","rearrange","edit wording","AI suggest"], data_source: "stylesData.ts", unique_to_carlos: "true", competitive_notes: "No competitor auto-suggests care labels from composition data." },
        ],
        screens: [
          { route: "/care-labelling", screen_name: "Care Labelling", layout: "sidebar + main", widgets: ["Care symbol grid","Label preview","Wording editor"], conditional_sections: [], animations: [] },
        ]
      },
      {
        module_name: "Self-Approval Levels (Admin)",
        category: "ai_operations",
        route: "/approval-levels",
        description: "Admin-only configuration of self-approval entitlements: None, Bronze, Silver, Gold tiers with escalating permissions.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "Graduated autonomy — Bronze users can approve care labels, Silver adds Base and Bulk testing, Gold adds Garment. This reduces approval bottlenecks while maintaining oversight.",
        features: [
          { name: "Approval Level Management", description: "Configure user approval entitlements across four tiers", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["User list","Level selector","Permission matrix"], interactions: ["change level","view permissions"], data_source: "stylesData.ts", unique_to_carlos: "true", competitive_notes: "Graduated self-approval is unique to CARLOS. Inspectorio has binary approve/reject." },
        ],
        screens: [
          { route: "/approval-levels", screen_name: "Self-Approval Levels", layout: "sidebar + main", widgets: ["Approval matrix","User cards"], conditional_sections: ["Admin only"], animations: [] },
        ]
      },
      {
        module_name: "Documentation (As-Built)",
        category: "ai_operations",
        route: "/documentation",
        description: "Admin-only as-built documentation module with app map, roles, workflows, data model, and export.",
        maturity: "implemented",
        demo_readiness: "needs_polish",
        demo_wow_factor: 5,
        demo_talk_track: "Self-documenting platform — every screen, workflow, and data entity is catalogued and exportable as JSON or Markdown for AI agent training.",
        features: [
          { name: "App Map Tab", description: "Registry of all screens with routes, personas, jobs to be done", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Screen table","Expandable rows"], interactions: ["expand details","filter"], data_source: "docs/registry.ts", unique_to_carlos: "true", competitive_notes: "No competitor has self-documenting architecture." },
          { name: "Roles Tab", description: "Role definitions and approval permission matrix", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Role cards","Permission matrix table"], interactions: ["view"], data_source: "docs/registry.ts", unique_to_carlos: "true", competitive_notes: "Unique." },
          { name: "Workflows Tab", description: "Step-by-step workflow documentation with decision points and AI moments", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Workflow steppers","Decision point cards","AI moment indicators"], interactions: ["expand steps"], data_source: "docs/registry.ts", unique_to_carlos: "true", competitive_notes: "Unique." },
          { name: "Data Model Tab", description: "Entity definitions with fields, relationships, and DPP relevance", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Entity cards","Field tables","Relationship indicators"], interactions: ["expand entities","view fields"], data_source: "docs/registry.ts", unique_to_carlos: "true", competitive_notes: "Unique." },
          { name: "Export Tab", description: "Export documentation as JSON or Markdown", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: "false", ui_elements: ["Export buttons","Preview"], interactions: ["click to download JSON","click to download Markdown"], data_source: "docs/registry.ts + docs/exporters.ts", unique_to_carlos: "true", competitive_notes: "Unique." },
        ],
        screens: [
          { route: "/documentation", screen_name: "Documentation", layout: "sidebar + main with tabs", widgets: ["AppMapTab","RolesTab","WorkflowsTab","DataModelTab","ExportTab"], conditional_sections: ["Admin only"], animations: [] },
        ]
      },
      {
        module_name: "Demo Dashboard",
        category: "ai_operations",
        route: "/demo",
        description: "Dedicated demo mode with scenario-switching readiness gauge, mock AI assessment with reasoning, and real-time priority feed.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "This is our demo stage — switch between Approve, Escalate, and Reject scenarios to see how AI reasoning adapts. The readiness gauge shifts in real-time. Perfect for showing stakeholders the AI in action.",
        features: [
          { name: "Scenario Switching", description: "Toggle between Approve/Escalate/Reject scenarios to demonstrate AI reasoning variations", implementation_status: "complete", ai_presence: "core", ai_details: "Pre-configured AI assessment scenarios with different reasoning chains, confidence levels, and recommendations", reasoning_visible: "true", ui_elements: ["Scenario selector","MockReadinessGauge","MockAIAssessment","Real-time feed"], interactions: ["switch scenario","view reasoning","click Take Action"], data_source: "mock computed", unique_to_carlos: "true", competitive_notes: "No competitor has a built-in demo mode with switchable AI scenarios." },
        ],
        screens: [
          { route: "/demo", screen_name: "Demo Dashboard", layout: "sidebar + main", widgets: ["MockReadinessGauge","MockAIAssessment","MockRealtimeDashboard"], conditional_sections: ["Visible only when demoMode localStorage is 'true'"], animations: ["Gauge animations","Feed auto-scroll"] },
        ]
      },
    ],

    ai_capabilities: {
      summary: "AI is embedded across the platform as a first-class citizen, not bolted on. Every AI capability surfaces its reasoning transparently. The AI computes task priorities based on downstream impact chains, provides approval recommendations with confidence scores, suggests component sets and care labels, generates analytics narratives, and powers a global chat assistant. All AI is currently simulated/rule-based for prototype — designed for real model integration.",
      capabilities: [
        { name: "AI Task Prioritisation", type: "prioritisation", description: "Computes priority ranking for all tasks based on impactScore (downstream effects), urgencyScore (SLA pressure), and riskScore (regulatory exposure)", where_used: ["/"], user_facing: true, reasoning_transparency: "Full: whyProblem, evidence[], consequenceIfIgnored, fastestFix", confidence_display: "yes — aiConfidence percentage on each task", implementation: "rule_based", technical_details: "useAIContext hook computes scores from mock data using deterministic rules based on SLA, risk, and dependencies" },
        { name: "Readiness Gauge", type: "risk_scoring", description: "Computes overall DPP attribute coverage readiness with gap analysis", where_used: ["/", "/demo"], user_facing: true, reasoning_transparency: "Shows gaps with severity, reason, and estimated resolution days", confidence_display: "yes — confidence level (low/medium/high) and trend", implementation: "rule_based", technical_details: "ReadinessScore computed in useAIContext with gap identification" },
        { name: "Scenario Simulator", type: "reasoning", description: "What-if analysis computing impact of DPP enforcement, regulation changes, or supplier failures", where_used: ["/"], user_facing: true, reasoning_transparency: "Shows readiness delta, new critical tasks, affected products, remediation timeline", confidence_display: "no", implementation: "rule_based", technical_details: "ScenarioImpact computed from ScenarioState parameters" },
        { name: "TRF Approval Recommendation", type: "recommendation", description: "AI recommends approve/reject/escalate with confidence score and reasoning", where_used: ["/trfs/:id"], user_facing: true, reasoning_transparency: "Full reasoning chain visible", confidence_display: "yes", implementation: "simulated", technical_details: "Pre-configured recommendations in mock data" },
        { name: "Component Set Suggestion", type: "recommendation", description: "AI suggests optimal component sets for a style based on product type and season", where_used: ["/styles/:id"], user_facing: true, reasoning_transparency: "Shows reasoning and confidence", confidence_display: "yes", implementation: "simulated", technical_details: "AIAssistSuggestion with type 'component_set'" },
        { name: "Care Label Suggestion", type: "generation", description: "AI suggests care label symbols and wording based on fabric composition and test results", where_used: ["/care-labelling", "/styles/:id"], user_facing: true, reasoning_transparency: "Shows reasoning for each symbol choice", confidence_display: "yes", implementation: "simulated", technical_details: "AIAssistSuggestion with type 'care_label'" },
        { name: "Test Plan Suggestion", type: "recommendation", description: "AI suggests required tests based on component risk assessment and regulatory requirements", where_used: ["/testing-levels", "/styles/:id"], user_facing: true, reasoning_transparency: "Shows reasoning", confidence_display: "yes", implementation: "simulated", technical_details: "aiTestPlanSuggestions.ts" },
        { name: "AI Analytics Narratives", type: "generation", description: "AI generates plain-English summaries of data trends and anomalies", where_used: ["/analytics"], user_facing: true, reasoning_transparency: "Narrative explains the 'why' behind numbers", confidence_display: "no", implementation: "simulated", technical_details: "AINarrativeCard component with pre-written narratives" },
        { name: "Carlos AI Chat Assistant", type: "recommendation", description: "Global conversational AI assistant for platform questions and guidance", where_used: ["global — every page"], user_facing: true, reasoning_transparency: "Provides source citations", confidence_display: "no", implementation: "simulated", technical_details: "CarlosLauncher + CarlosChatPanel with pre-configured responses" },
        { name: "AI Assessment Strip", type: "risk_scoring", description: "Inline AI assessment on object detail pages showing readiness, risk, and recommendation", where_used: ["/trfs/:id", "/products/:id", "/styles/:id"], user_facing: true, reasoning_transparency: "Shows primary risk and recommendation", confidence_display: "yes — trend and confidence level", implementation: "simulated", technical_details: "AIAssessmentStrip component reading AIAssessment type" },
      ],
      ai_vs_inspectorio: {
        carlos_advantages: [
          "Transparent AI reasoning (whyProblem, evidence, consequenceIfIgnored) — Inspectorio's Paramo AI is a black box",
          "Scenario simulation for what-if compliance analysis — no Inspectorio equivalent",
          "DPP readiness gauge with gap analysis — unique to CARLOS",
          "AI-suggested care labels from composition data — no competitor equivalent",
          "AI-generated analytics narratives — Inspectorio has charts but no narrative intelligence",
          "Global AI chat assistant (Carlos) on every page — Inspectorio has separate support",
          "Demo mode with switchable AI scenarios for stakeholder presentations",
          "Role-adaptive AI — prioritisation adapts by persona, not just user permissions"
        ],
        inspectorio_advantages: [
          "Production-grade ML models (Paramo AI trained on millions of inspections)",
          "Real-time supplier risk scoring from actual historical data",
          "Automated inspection scheduling based on risk algorithms",
          "LabSync with actual LIMS integration",
          "Mature multi-tenant SaaS with 100+ brand deployments",
          "Native mobile app for field inspectors"
        ],
        parity: [
          "Task management and prioritisation",
          "Supplier performance scoring",
          "Inspection management with findings",
          "Test request lifecycle tracking",
          "Document management",
          "Role-based access control"
        ]
      }
    },

    sustainability_module: {
      description: "Sustainability is designed as a first-class concern through the DPP-ready data model. Every product collection tracks component composition, testing provenance, and can generate a Digital Product Passport.",
      evidence_graph: {
        description: "The data model is designed for scheme-agnostic sustainability evidence. Components track composition and sourcing. Testing results provide compliance evidence. Certifications are tracked per supplier with expiry monitoring.",
        scheme_agnostic: true,
        supported_schemes: ["OEKO-TEX", "GOTS", "bluesign (planned)", "ZDHC (planned)"],
        scheme_extensibility: "New schemes can be added as certification types on suppliers and as test categories on TRFs without code changes.",
        evidence_types: ["lab_test_results", "certificates_of_analysis", "supplier_certifications", "audit_reports", "composition_declarations"],
        claim_validation: "Testing gates (Base/Bulk/Garment) validate claims progressively. Each gate approval provides evidence for the next.",
        overclaim_prevention: "Component locking after gate approval prevents composition changes. Audit trail on GSW submissions prevents document tampering."
      },
      dpp_readiness: {
        description: "EU Digital Product Passport 2027 readiness through comprehensive data model",
        data_model_alignment: "ProductCollection tracks all DPP-relevant fields: composition, origin (via supplier/factory), testing results, care instructions, sustainability certifications. dppPassportId field is reserved.",
        export_capability: "planned — data model supports DPP export but no generator implemented yet",
        audit_trail: "Full audit trail via TRF timelines, GSW audit events, testing gate approvals, and supplier certification tracking"
      },
      competitive_advantage: "CARLOS is scheme-agnostic by design — new regulations plug in as data, not code. Inspectorio's ESG module is bolted on to their QRM platform. CARLOS treats sustainability as a core data architecture concern."
    },

    demo_focus_system: {
      present: "true",
      description: "Demo mode activated via localStorage.demoMode='true'. Demo dashboard at /demo with scenario switching. Demo parameter (?demo=1) on detail pages activates enhanced AI demonstrations. Demo sidebar link conditionally visible.",
      personas: ["buyer (Sarah Chen)", "supplier (Marcus Wong)", "lab_technician (Dr. Amm Martinez)", "manager (Mark Richardson)", "admin (Hajra Khan)"],
      focus_levels: ["standard", "demo_enhanced (with ?demo=1 parameter)"],
      keyboard_shortcuts: ["not_implemented"],
      demo_routes: ["/demo"],
      visibility_map: "Demo link appears in sidebar My Work section when demoMode localStorage is 'true'. Role switching via user dropdown adapts all screens."
    },

    insights_and_reporting: {
      dashboards: [
        { name: "Insight Dashboard", route: "/analytics", widgets: ["StripeMetricCards","StripeOverviewTab","StripeTransactionsTab","AINarrativeCard","TransactionDetailDrawer","PipelineFlowDashboard","RiskSummaryDashboard","ComplianceHealthView","CollectionReadinessFunnel","BalancesView"], ai_presence: "moderate", ai_details: "AI narrative cards, risk computation", export_options: ["planned"] },
        { name: "Dashboard KPIs", route: "/", widgets: ["KPISummaryWidget","role-specific KPI cards"], ai_presence: "light", ai_details: "AI-computed priority metrics", export_options: ["not_implemented"] },
      ],
      charts_and_visualisations: [
        { type: "bar", library: "recharts", location: "/analytics", data_source: "mockReports.ts" },
        { type: "line", library: "recharts", location: "/analytics", data_source: "mockReports.ts" },
        { type: "pie", library: "recharts", location: "/analytics", data_source: "mockReports.ts" },
        { type: "gauge", library: "custom SVG", location: "/", data_source: "computed readiness" },
        { type: "area", library: "recharts", location: "/analytics", data_source: "mockReports.ts" },
        { type: "radar", library: "recharts", location: "/suppliers/:id", data_source: "mockSuppliers.ts" },
        { type: "funnel", library: "custom", location: "/analytics (Collection Readiness)", data_source: "mockReports.ts" },
        { type: "world_map", library: "react-simple-maps", location: "/inspections/calendar", data_source: "mockInspections.ts" },
      ],
      regulatory_tracking: {
        tracked_regulations: ["EU DPP 2027", "CPSC eFiling July 2026", "REACH Updates", "California Prop 65"],
        alert_system: "RegulatoryAlerts widget on dashboard surfaces upcoming deadlines with countdown and impact assessment"
      }
    },

    administration: {
      user_management: {
        role_based_access: "5 roles with distinct permissions. Admin sees Documentation and Self-Approval Levels. Demo role switching via dropdown.",
        roles_defined: ["buyer", "supplier", "lab_technician", "manager", "admin"],
        role_switching_for_demo: "Instant role switching via avatar dropdown in sidebar. All screens adapt immediately."
      },
      configuration: {
        custom_workflows: "not_implemented",
        template_management: "not_implemented",
        notification_rules: "not_implemented",
        branding_customization: "THT branding applied via CSS variables and logo"
      },
      audit_trail: "TRF timeline events, GSW audit trail, supplier certification tracking. No global audit log.",
      data_export: "Documentation module exports JSON and Markdown. Analytics export planned."
    },

    cross_cutting_capabilities: {
      search: { type: "per-page", description: "Search/filter functionality on list pages (suppliers, products, inspections, TRFs). No global search." },
      notifications: { type: "in-app", description: "Notification badges on sidebar nav items. Toast notifications via Sonner. No email or push." },
      file_management: { upload: "CSV import for products, document upload on TRFs, GSW file upload", preview: "Document list with type badges", supported_formats: ["CSV", "PDF", "JPEG/PNG (sample photos)", "ZIP"] },
      i18n: { multi_language: "no", languages: ["English"] },
      theming: { dark_mode: "yes (via next-themes)", custom_themes: "no", tht_branding: "THT logo, CARLOS AI branding, custom color palette with ai-primary/ai-secondary gradient, sidebar theme" }
    },

    ui_component_inventory: {
      total_custom_components: 130,
      design_system: "shadcn/ui (Radix UI primitives + Tailwind CSS)",
      components: [
        { name: "AITaskCard", type: "ai_widget", file_path: "src/components/ai/AITaskCard.tsx", props: ["task:AIComputedTask"], used_in: ["/"], demo_relevant: "true" },
        { name: "ReadinessGauge", type: "ai_widget", file_path: "src/components/ai/ReadinessGauge.tsx", props: ["readiness:ReadinessScore"], used_in: ["/"], demo_relevant: "true" },
        { name: "ScenarioSimulator", type: "ai_widget", file_path: "src/components/ai/ScenarioSimulator.tsx", props: ["state","setState","impact"], used_in: ["/"], demo_relevant: "true" },
        { name: "AIAssessmentStrip", type: "ai_widget", file_path: "src/components/ai/AIAssessmentStrip.tsx", props: ["assessment:AIAssessment"], used_in: ["/trfs/:id","/products/:id"], demo_relevant: "true" },
        { name: "AIReasoningPanel", type: "ai_widget", file_path: "src/components/ai/AIReasoningPanel.tsx", props: ["reasoning:AIReasoning"], used_in: ["/"], demo_relevant: "true" },
        { name: "AIAssistPanel", type: "ai_widget", file_path: "src/components/ai/AIAssistPanel.tsx", props: ["suggestions"], used_in: ["/styles/:id"], demo_relevant: "true" },
        { name: "CarlosLauncher", type: "ai_widget", file_path: "src/components/carlos/CarlosLauncher.tsx", props: [], used_in: ["global"], demo_relevant: "true" },
        { name: "CarlosChatPanel", type: "ai_widget", file_path: "src/components/carlos/CarlosChatPanel.tsx", props: [], used_in: ["global"], demo_relevant: "true" },
        { name: "MockAIAssessment", type: "ai_widget", file_path: "src/components/demo/MockAIAssessment.tsx", props: ["scenario"], used_in: ["/demo"], demo_relevant: "true" },
        { name: "MockReadinessGauge", type: "ai_widget", file_path: "src/components/demo/MockReadinessGauge.tsx", props: ["scenario"], used_in: ["/demo"], demo_relevant: "true" },
        { name: "MockRealtimeDashboard", type: "ai_widget", file_path: "src/components/demo/MockRealtimeDashboard.tsx", props: [], used_in: ["/demo"], demo_relevant: "true" },
        { name: "StripeMetricCard", type: "data_display", file_path: "src/components/insights/StripeMetricCard.tsx", props: ["metric"], used_in: ["/analytics"], demo_relevant: "true" },
        { name: "AINarrativeCard", type: "ai_widget", file_path: "src/components/insights/AINarrativeCard.tsx", props: ["narrative"], used_in: ["/analytics"], demo_relevant: "true" },
        { name: "InspectionKanban", type: "data_display", file_path: "src/components/inspection/InspectionKanban.tsx", props: ["inspections"], used_in: ["/inspections"], demo_relevant: "true" },
        { name: "WorldMap", type: "chart", file_path: "src/components/inspections/WorldMap.tsx", props: ["markers"], used_in: ["/inspections/calendar"], demo_relevant: "true" },
        { name: "SupplierPerformanceChart", type: "chart", file_path: "src/components/suppliers/SupplierPerformanceChart.tsx", props: ["supplier"], used_in: ["/suppliers/:id"], demo_relevant: "true" },
        { name: "PlatformTour", type: "feedback", file_path: "src/components/tour/PlatformTour.tsx", props: [], used_in: ["global"], demo_relevant: "true" },
        { name: "TodayNextStrip", type: "data_display", file_path: "src/components/home/TodayNextStrip.tsx", props: ["metrics"], used_in: ["/"], demo_relevant: "true" },
        { name: "AppLayout", type: "layout", file_path: "src/components/layout/AppLayout.tsx", props: ["children"], used_in: ["all pages"], demo_relevant: "false" },
        { name: "Sidebar", type: "navigation", file_path: "src/components/layout/Sidebar.tsx", props: [], used_in: ["all pages"], demo_relevant: "false" },
      ]
    },

    demo_highlights: {
      top_10_wow_moments: [
        { rank: 1, feature: "AI Task Prioritisation with Transparent Reasoning", route: "/", what_to_show: "Click a critical task card → expand reasoning → show whyProblem, evidence, consequence, fastest fix", why_it_wows: "Nobody else shows you WHY the AI thinks this is critical. Full explainability for TIC.", talk_track: "Unlike any other platform, CARLOS tells you exactly why this task is critical — the evidence it considered, what happens if you ignore it, and the fastest way to fix it.", vs_inspectorio: "Inspectorio's Paramo AI makes recommendations but never explains its reasoning. CARLOS makes AI transparent.", vs_current_uki: "Current NIS has no AI — all prioritisation is manual and relies on individual knowledge." },
        { rank: 2, feature: "Scenario Simulator", route: "/", what_to_show: "Toggle DPP enforcement ON → watch readiness drop → show new critical tasks and remediation timeline", why_it_wows: "What-if analysis for compliance is completely novel. No competitor offers this.", talk_track: "Watch this — if EU DPP enforcement kicks in tomorrow, here's exactly how it impacts your portfolio. These new critical tasks appear, and here's the remediation timeline.", vs_inspectorio: "No equivalent. Inspectorio can't simulate regulatory changes.", vs_current_uki: "Current portal has no predictive capabilities." },
        { rank: 3, feature: "Role-Adaptive Dashboard", route: "/", what_to_show: "Switch from Buyer to Lab Technician → watch dashboard completely reconfigure", why_it_wows: "Same platform, completely different experience per role. Instant adaptation.", talk_track: "Watch what happens when I switch to a lab technician — the entire dashboard reconfigures. AI decides what's most important for each role.", vs_inspectorio: "Inspectorio has role-based views but they're statically configured, not AI-adapted.", vs_current_uki: "Current NIS has one view for everyone." },
        { rank: 4, feature: "Three-Tier Gated Testing Pipeline", route: "/styles/:id", what_to_show: "Show a style with Base testing approved → Bulk in progress → Garment locked. Show component locking after approval.", why_it_wows: "Progressive testing with automatic component locking ensures nothing ships without proper certification.", talk_track: "Each style flows through Base, Bulk, and Garment testing. Once a gate is approved, components are locked — no one can change composition without re-testing. This is built-in compliance, not afterthought.", vs_inspectorio: "Inspectorio has test tracking but no gated progression with component locking.", vs_current_uki: "Current process is entirely manual with spreadsheets." },
        { rank: 5, feature: "Inspection World Map", route: "/inspections/calendar", what_to_show: "Show inspections plotted on world map → click a factory pin → see factory details and scheduled inspections", why_it_wows: "Visual supply chain oversight across the globe. Immediately communicates scale and control.", talk_track: "Your entire inspection programme visualised on a world map. Click any factory to see what's scheduled, in progress, or completed. This is supply chain visibility at a glance.", vs_inspectorio: "Inspectorio has map views but integrated within their Tracking module, not as a standalone visualisation.", vs_current_uki: "Current portal has no map visualisation." },
        { rank: 6, feature: "AI Care Label Suggestion", route: "/care-labelling", what_to_show: "Select a style → AI suggests care symbols based on fabric composition → show reasoning", why_it_wows: "Automated care label generation from composition data eliminates manual lookup and human error.", talk_track: "Based on the fabric composition — 100% organic cotton — the AI suggests these care symbols with reasoning. No more looking up care codes manually.", vs_inspectorio: "No equivalent. Care labelling is typically a separate process outside Inspectorio.", vs_current_uki: "Manual process with reference books." },
        { rank: 7, feature: "Stripe-Inspired Analytics with AI Narratives", route: "/analytics", what_to_show: "Show overview metrics → click AI narrative card → read plain-English trend analysis", why_it_wows: "Analytics that explain themselves. AI tells you what the numbers mean.", talk_track: "These aren't just numbers — the AI writes a narrative explaining what's happening and what you should do about it. Analytics that think for you.", vs_inspectorio: "Inspectorio has dashboards but no narrative AI explaining trends.", vs_current_uki: "Current portal has basic reports with no analysis." },
        { rank: 8, feature: "Carlos AI Chat Assistant", route: "any page", what_to_show: "Click the floating chat icon → ask 'What TRFs are expiring this week?' → show contextual response with sources", why_it_wows: "An always-available AI assistant that understands the platform and your data.", talk_track: "Carlos is always here. Ask a question in natural language and get instant answers grounded in your data. No more searching through menus or waiting for support tickets.", vs_inspectorio: "Inspectorio has a separate help center, not an embedded AI assistant.", vs_current_uki: "No AI assistance. Users rely on email support." },
        { rank: 9, feature: "Demo Mode with Scenario Switching", route: "/demo", what_to_show: "Switch between Approve/Escalate/Reject scenarios → watch gauge and reasoning change in real-time", why_it_wows: "A built-in demo stage that lets you showcase AI capabilities with pre-configured scenarios.", talk_track: "We've built in a demo mode specifically for presentations like this. Watch how the AI reasoning and confidence shift between approval, escalation, and rejection scenarios.", vs_inspectorio: "Inspectorio has no demo mode — they use sandbox environments.", vs_current_uki: "N/A" },
        { rank: 10, feature: "Self-Approval Levels (Graduated Autonomy)", route: "/approval-levels", what_to_show: "Show the four tiers: None → Bronze → Silver → Gold → explain escalating permissions", why_it_wows: "Graduated autonomy reduces bottlenecks while maintaining oversight. Novel governance model.", talk_track: "Not everyone needs the same approval rights. Bronze users handle care labels. Silver adds base and bulk testing. Gold handles everything. This reduces your approval bottleneck by 60% while keeping full oversight.", vs_inspectorio: "Inspectorio has binary role-based permissions, not graduated autonomy.", vs_current_uki: "Current process requires senior QA for all approvals." },
      ],
      demo_flow_recommended: [
        { order: 1, screen: "Dashboard", route: "/", duration_minutes: "4", transition_to_next: "Click a critical TRF task to drill into the testing lifecycle." },
        { order: 2, screen: "TRF Detail", route: "/trfs/trf-001", duration_minutes: "3", transition_to_next: "Show the AI approval recommendation, then navigate to Styles to show the broader pipeline." },
        { order: 3, screen: "Style Detail", route: "/styles/coll-001", duration_minutes: "4", transition_to_next: "Walk through component linking and testing gates, then show care labelling." },
        { order: 4, screen: "Care Labelling", route: "/care-labelling", duration_minutes: "2", transition_to_next: "Show AI-suggested care labels, then navigate to Inspections for supply chain oversight." },
        { order: 5, screen: "Inspections Calendar + Map", route: "/inspections/calendar", duration_minutes: "2", transition_to_next: "Show the world map, then switch to table/kanban view." },
        { order: 6, screen: "Inspections (Enhanced)", route: "/inspections", duration_minutes: "2", transition_to_next: "Show kanban board, then navigate to Suppliers." },
        { order: 7, screen: "Suppliers", route: "/suppliers", duration_minutes: "2", transition_to_next: "Show tier classification and performance, then navigate to Analytics." },
        { order: 8, screen: "Analytics", route: "/analytics", duration_minutes: "3", transition_to_next: "Show AI narrative cards and Stripe-inspired metrics, then switch back to Dashboard for scenario simulation." },
        { order: 9, screen: "Dashboard - Scenario Simulation", route: "/", duration_minutes: "3", transition_to_next: "Toggle DPP enforcement, then switch roles to show adaptability." },
        { order: 10, screen: "Role Switching", route: "/", duration_minutes: "2", transition_to_next: "Switch to Lab Technician, then Admin to show self-approval levels." },
      ],
      audience_adaptations: {
        steering_committee: "Lead with the Scenario Simulator (investment protection narrative), then AI reasoning transparency (differentiator), then competitive positioning slides. Emphasise DPP readiness and the 2027 deadline. Close with demo mode showing all three scenarios.",
        technical_team: "Start with architecture overview (React SPA, component model, data layer). Show the registry/documentation module. Discuss AI integration points and the path from simulated to real AI. Walk through the type system and data model.",
        client_buyers: "Lead with Dashboard (this is YOUR command center). Focus on reducing approval bottlenecks (self-approval levels). Show the inspection world map for supply chain visibility. Emphasise time savings: AI does the prioritisation so you focus on decisions, not triaging.",
        sustainability_teams: "Lead with DPP readiness and the evidence graph architecture. Show component traceability. Demonstrate how testing gates build the evidence chain. Show regulatory alerts. Emphasise scheme-agnostic design — new standards plug in without code changes."
      }
    },

    comparison_positioning: {
      vs_inspectorio: {
        carlos_strengths: [
          "AI reasoning transparency — every recommendation explains WHY with evidence chains",
          "Scenario simulation for what-if compliance analysis — completely novel",
          "DPP-ready data model with readiness gauge and gap analysis",
          "Three-tier gated testing with component locking",
          "AI-suggested care labels from composition data",
          "Global AI chat assistant (Carlos) on every page",
          "Self-documenting platform (Documentation module)",
          "Scheme-agnostic sustainability architecture",
          "Self-approval levels with graduated autonomy",
          "Built-in demo mode for stakeholder presentations"
        ],
        inspectorio_strengths: [
          "Production-grade ML models trained on millions of real inspections",
          "Mature multi-tenant SaaS with 100+ enterprise deployments",
          "Native mobile apps for field inspectors",
          "Real LIMS integration (LabSync)",
          "Automated inspection scheduling with risk-based algorithms",
          "Traceability module with real supply chain data",
          "Established API ecosystem with ERP integrations",
          "ISO-certified platform infrastructure",
          "$50M+ venture backing with dedicated R&D team"
        ],
        parity: [
          "Test request lifecycle management",
          "Supplier performance scoring and management",
          "Inspection management with findings and corrective actions",
          "Document management",
          "Role-based access control",
          "Analytics and reporting dashboards"
        ],
        key_differentiator: "CARLOS embeds AI as a transparent thinking partner that explains its reasoning, while Inspectorio uses AI as a black-box recommendation engine. In regulated TIC industries, explainability isn't optional — it's a requirement."
      },
      vs_current_uki_nis: {
        capabilities_replaced: [
          "Manual TRF tracking via spreadsheets → automated lifecycle management",
          "Email-based supplier communication → integrated supplier inbox and portal",
          "Paper-based inspection reports → digital inspection management with findings/photos",
          "Manual quality score calculation → automated performance scoring",
          "No compliance dashboard → AI-prioritised command center",
          "Fragmented approval workflows → unified gated testing pipeline",
          "No care label management → AI-assisted care label creation"
        ],
        capabilities_added: [
          "AI task prioritisation with explainable reasoning",
          "DPP readiness tracking with scenario simulation",
          "Component-level traceability and testing",
          "Self-approval levels for graduated autonomy",
          "Global AI assistant (Carlos)",
          "Interactive inspection world map",
          "Stripe-inspired analytics with AI narratives",
          "Self-documenting platform architecture"
        ],
        user_experience_delta: "From a 2015-era portal requiring 7 separate systems and manual data aggregation to a single AI-powered platform that prioritises work, explains decisions, and adapts to each user's role. Estimated 60% reduction in approval cycle time and 80% reduction in manual data entry."
      },
      vs_sgs_smart: {
        capabilities_beyond_smart: [
          "AI-first architecture vs SMART's workflow-first approach",
          "Client-facing portal (buyer, supplier, lab) vs SMART's internal-only focus",
          "DPP readiness and sustainability evidence graph",
          "Scheme-agnostic design for new compliance regulations",
          "Modern UX with role-adaptive AI vs SMART's form-based interface",
          "Scenario simulation for compliance planning"
        ],
        smart_migration_relevance: "CARLOS complements SMART by providing the client-facing layer that SMART lacks. While SMART handles internal lab operations and LIMS, CARLOS serves as the customer portal where buyers, suppliers, and managers interact with THT services. The two systems can coexist: SMART for internal ops, CARLOS for external engagement."
      }
    },

    technical_debt_and_gaps: {
      stubbed_features: [
        "Authentication — demo role switching only, no real auth",
        "Backend API — all data is mock/client-side",
        "Email notifications — not implemented",
        "File upload to storage — UI exists but no actual storage",
        "DPP passport generation — data model ready but no export",
        "Real AI models — all AI is rule-based/simulated",
        "GSW file processing — upload UI only, no validation",
        "Inspection photo capture — viewing only, no camera integration",
        "Report PDF export — not implemented",
        "Global search — only per-page filtering"
      ],
      mock_data_dependencies: [
        "All TRFs, tasks, suppliers, inspections, products, components, styles, lab samples, KPIs, activities, help articles",
        "AI reasoning and recommendations are pre-configured, not computed by models"
      ],
      known_bugs: [
        "None critical — prototype-quality code with occasional layout inconsistencies on edge-case viewports"
      ],
      performance_concerns: [
        "mockData.ts is 1271 lines — could be split for tree-shaking",
        "No virtualisation on long lists — fine for demo data volumes but would need list virtualisation at scale",
        "All mock data loaded on app start regardless of route"
      ],
      production_readiness_gaps: [
        "Supabase/database integration for real data persistence",
        "Authentication and authorization with proper JWT tokens",
        "API layer for LIMS, ERP, and supply chain integrations",
        "Real AI model integration (LLM for Carlos chat, ML for risk scoring)",
        "Testing suite (currently minimal)",
        "Error boundaries and error handling",
        "Performance monitoring and analytics",
        "Security audit and penetration testing",
        "Accessibility audit (WCAG 2.1 AA)",
        "i18n for multi-language support",
        "CI/CD pipeline with staging environments"
      ]
    },

    file_manifest: {
      total_files: 180,
      total_lines_of_code: "~25,000",
      key_directories: [
        { path: "src/components/", file_count: 95, purpose: "UI components organised by feature domain (ai, carlos, dashboard, inspection, insights, layout, navigation, suppliers, etc.)" },
        { path: "src/pages/", file_count: 25, purpose: "Top-level page components, one per route" },
        { path: "src/data/", file_count: 9, purpose: "Mock data and seed files for all entities" },
        { path: "src/types/", file_count: 5, purpose: "TypeScript type definitions for all data entities" },
        { path: "src/hooks/", file_count: 6, purpose: "Custom React hooks (useAIContext, useWidgetConfig, useMobile, etc.)" },
        { path: "src/contexts/", file_count: 2, purpose: "React Context providers (UserContext, DraftsContext)" },
        { path: "src/docs/", file_count: 3, purpose: "Documentation registry, types, and exporters" },
        { path: "src/components/ui/", file_count: 45, purpose: "shadcn/ui component library (buttons, cards, dialogs, etc.)" },
      ],
      largest_files: [
        "src/data/mockData.ts (~1271 lines)",
        "src/data/mockSuppliers.ts (~599 lines)",
        "src/data/stylesData.ts (~481 lines)",
        "src/data/mockInspections.ts (~424 lines)",
        "src/pages/Dashboard.tsx (~408 lines)",
        "src/components/navigation/SidebarSections.tsx (~413 lines)",
        "src/data/mockReports.ts (~400+ lines)",
        "src/pages/Insight.tsx (~350+ lines)",
        "src/docs/registry.ts (~500+ lines)",
        "src/components/layout/Sidebar.tsx (~281 lines)"
      ],
      entry_points: [
        "src/main.tsx",
        "src/App.tsx",
        "index.html"
      ]
    }
  }
};
