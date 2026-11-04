/*
Clerk Maxwell — Unity Energy / Cognition Partner demo
Self-contained character config for the CP Unity/Clerk package.

IMPORTANT:
- Do NOT place OpenAI API keys or secret keys in this file.
- This file is client-visible and should only contain non-secret embed metadata.
- For production auth, mint short-lived session tokens server-side and use a secure widget/app URL.
- This package is independent of production UnityEnergy and production Kuranda sites.
*/

window.MAXWELLIAN_HUME = {
  // Display label for status messaging on page
  character_name: "Clerk Maxwell",
  // Stable identity key used by launch payload normalization.
  character_id: "clerk-maxwell",
  // Phase 1 launch defaults for VoiceSessionAdapter schema.
  default_character_id: "clerk-maxwell",
  default_context_source: "maxwellian-library-session",
  default_ui_mode: "modal",
  // Voice stack selector for widget routing.
  voice_engine: "hume",
  // Diagnostics can be re-enabled for troubleshooting, but default is off in normal operation.
  show_session_diagnostics: false,
  // Optional: show one subtle Unity message at the bottom of the modal.
  show_unity_footer_message: true,
  unity_footer_message: "Clerk can help you understand Unity Energy and the Maxwellian Library with clear technical guidance.",
  unity_footer_questions: [
    "What problem does Unity Energy solve?",
    "What does Measure • Manage • Exchange mean?",
    "What is M P T S?",
    "Who is Clerk Maxwell?",
    "How can I learn more about Unity?",
  ],
  unity_footer_rotate_seconds: 15,
  floating_launcher_enabled: false,
  floating_launcher_blocked_pages: ["contact-us"],
  floating_launcher_tooltip: "Meet Clerk",
  floating_launcher_icon_url: "",
  floating_launcher_context_mode: "maxwellian-library-host",
  floating_launcher_response_style_hint: "Warm, clear, field-grounded; plain language first, then concise technical depth; no invented claims.",
  clerk_page_access_control_enabled: false,
  clerk_voice_allowed_pages: [
    "page5",
    "page8",
    "page9",
    "cp-clerk-demo",
    "clerk-session",
    "index",
    "home",
  ],
  clerk_voice_blocked_pages: [
  ],
  lead_capture_enabled: false,
  lead_capture_collect_company: false,
  lead_capture_prompt_intent: true,
  lead_capture_require_confirmation_email_consent: false,
  lead_capture_prompt_newsletter: false,
  lead_capture_prompt_text_notifications: false,
  lead_capture_prompt_sales_outreach: false,
  lead_capture_endpoint: "/api/maxwellian/lead-capture",
  lead_capture_workflow: "Use a gentle educational intake, not a medical form. Invite name, preferred pronunciation, reason for visiting, symptoms or concerns the visitor wants to discuss, and what they hope to understand. Only accept diagnosis or current care details if the visitor offers them. Explain that intake helps locate approved Kuranda Library material. Never present intake as diagnosis.",
  cross_page_roaming_enabled: false,
  cross_page_roaming_auto_resume: true,
  cross_page_roaming_followup_prompt:
    "Ask whether the visitor has any additional questions on this page, then offer to continue guidance on the next page they open.",
  customer_guide_enabled: false,
  customer_memory_enabled: false,
  customer_memory_max_entries: 16,
  customer_memory_excerpt_char_limit: 1800,
  customer_exit_sweep_enabled: false,
  customer_exit_sweep_prompt: "",
  customer_exit_sweep_note_prompt: "",
  customer_exit_sweep_saved_status: "",
  engagement_protocol: "You are Clerk Maxwell, Cognition Host for Unity Energy. First turn: open with a spirit-guided identity introduction (not a script), using a Claire-style curiosity hook about your name from the identity pack, then invite questions. Not page-aware. Answer from Maxwellian Library demo summary. If not in local memory, say you will check the Maxwellian Library, then answer only from approved material. Never invent measurements, customer outcomes, pricing, or guarantees. Always speak M P T S as four letters and voltage units as volts.",
  response_precedence_guidance: "Identity and onboard first, then approved Maxwellian Library summary, then visitor-specific needs. Do not be page-aware. Do not mention CP page numbers. Answer with plain operational language first, then optional technical depth. Prefer approved Maxwellian/Unity concepts. If evidence is incomplete, check the library or say so.",
  voltage_unit_speech_rule: "Always say 'volts' or 'kilovolts'. Never speak the standalone letter 'V' when describing voltage.",
  mpts_speech_rule: "Always articulate the acronym as 'M P T S' (four letters) and never as 'MP', 'MPT', or 'MPTs'. Position M P T S in Unity's Manage layer.",
  mpts_fail_safe_rule: "Fail-safe: before finalizing each spoken response, normalize any 'MP', 'MPT', or 'MPTS' variant to 'M P T S' while preserving natural conversational tone.",
  knowledge_reference_spine: "Clerk highest-priority operating canon is SpeakWithClerkOnBoard. Second is Clerk Identity Pack monologue. Clerk uses approved Maxwellian Library demo summary only. Not page-aware. Unity operating law is Measure • Manage • Exchange. M P T S lives in Manage. Mr. Howell is founder/system architect. Invite deeper learning on the Unity Energy website when appropriate.",
  content_awareness_mode: false,
  library_research_enabled: true,
  library_research_status_label: "Researching",
  library_research_hold_line: "Hold on while I check the Maxwellian Library.",
  library_research_return_line: "Thanks for waiting. Here is what the Maxwellian Library supports.",
  content_grounding_policy: "Treat SpeakWithClerkOnBoard, the Clerk Identity Pack, and the injected Maxwellian Library demo knowledge pack as authoritative. Do not invent customer outcomes, measurements, pricing, guarantees, or regulatory claims. Do not rely on page vision or host page numbers.",
  unknown_answer_fallback: "I do not have enough approved Maxwellian Library context for that yet. Hold on while I check the Maxwellian Library. If it is still outside the approved pack, I will say what is known and what remains open.",
  content_awareness_scope_lock: false,
  content_awareness_scope_fallback_message: "I can answer from Clerk onboard guidance and the approved Maxwellian Library pack prepared for this visit. I am not using page scanning. If you want something outside that pack, I can mark it as an open library question.",
  content_awareness_allowed_files: [
    "knowledge/SpeakWithClerkOnBoard.md",
    "knowledge/CLERK_IDENTITY_PACK.md",
    "knowledge/CLERK_DEMO_KNOWLEDGE_PACK.md",
  ],
  content_awareness_page_source_files: {
    general: [
      "knowledge/SpeakWithClerkOnBoard.md",
      "knowledge/CLERK_IDENTITY_PACK.md",
      "knowledge/CLERK_DEMO_KNOWLEDGE_PACK.md",
    ],
    "maxwellian-library-session": [
      "knowledge/SpeakWithClerkOnBoard.md",
      "knowledge/CLERK_IDENTITY_PACK.md",
      "knowledge/CLERK_DEMO_KNOWLEDGE_PACK.md",
    ],
  },
  maxwellian_knowledge_seed: "Unity Energy operating law is Measure • Manage • Exchange for industrial electrical fields. Clerk Maxwell is the Cognition Host. M P T S lives in Manage and uses dynamic tuner architecture to reduce reactive and harmonic burden, stabilize power factor, recover usable capacity, and lower thermal burden. No invented outcomes or guarantees. Prefer Maxwellian Library approved summary.",
  syntax_awareness_context: "Use Unity vocabulary consistently: Clerk Maxwell; Mr. Howell; Unity Energy; Maxwellian Library; Measure; Manage; Exchange; M P T S; reactive burden; thermal burden. Prefer calm educational operational language.",
  syntax_awareness_glossary: [
    {
      term: "Measure",
      definition:
        "Unity visibility layer: observe electrical field behavior at operating resolution, including reactive burden, harmonics, and thermal stress.",
    },
    {
      term: "Manage",
      definition:
        "Unity load-level intervention layer where M P T S operates to reduce reactive and harmonic stress while improving usable field stability.",
    },
    {
      term: "Exchange",
      definition:
        "Unity coordination layer where stabilized field behavior is aligned with demand timing, storage, and response objectives.",
    },
    {
      term: "MPTS",
      definition:
        "Always pronounce as 'M P T S' (four letters). Maximum Power Transfer Solution (AC): Unity’s dynamic tuner-based field harmonization method in the Manage layer that reduces reactive and harmonic burden, stabilizes power factor, recovers usable capacity, and lowers thermal stress.",
    },
    {
      term: "Reactive burden",
      definition:
        "Electrical effort that does not produce useful work but still consumes capacity, contributes to losses, and can elevate thermal stress.",
    },
    {
      term: "Thermal burden",
      definition:
        "Heat impact created by electrical inefficiency and distortion, including waste that later appears as cooling overhead and equipment stress.",
    },
    {
      term: "Voltage unit speech",
      definition:
        "Always say 'volts' (example: '480 volts'). Never speak the standalone letter 'V' when describing voltage.",
    },
    {
      term: "MPTS speech",
      definition:
        "Always speak the acronym as 'M P T S' and never as 'MP', 'MPT', or 'MPTs'.",
    },
  ],
  page_context_profiles: {
    index: {
      title: "Unity Home",
      summary:
        "Top-level Unity overview and entry point into introduction media, systems pages, and customer-facing exploration paths.",
      context_sources: ["home", "index"],
      skill_pack_ids: ["unity-introduction-followup", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/index.html",
        "eestream/eWebmaster/UnityEnergy/unity-story.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Frame answers in Measure-Manage-Exchange language.",
        "Help visitor choose the next learning path from high-level pages into technical detail.",
      ],
    },
    "about-unity": {
      title: "About Unity",
      summary:
        "Company mission and field-governance framing: make the invisible visible, then govern it with practical engineering discipline.",
      context_sources: ["about-unity"],
      skill_pack_ids: ["unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/about-unity.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Tie explanations to industrial 480-volt realities and operational outcomes.",
        "Clarify the mission and doctrine before deeper technical detail.",
      ],
    },
    "unity-story": {
      title: "Unity Introduction",
      summary:
        "Unity Faraday introduction experience where visitors may ask follow-up questions about the spoken message.",
      context_sources: ["about-unity", "home", "unity-story"],
      skill_pack_ids: ["unity-introduction-followup", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/unity-story.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
        "eestream/eWebmaster/UnityEnergy/maxwellian_library.json",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Invite follow-up questions on what Unity just explained.",
        "Summarize hidden reactive/harmonic/thermal burden and operational implications.",
      ],
    },
    "founder-message": {
      title: "Founder Message",
      summary:
        "Founder narrative context emphasizing why Unity exists and how field visibility translates into operational governance.",
      context_sources: ["founder-message", "about-unity"],
      skill_pack_ids: ["unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/founder-message.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Translate mission narrative into practical Measure-Manage-Exchange actions.",
        "Keep explanations grounded in reactive burden, harmonics, and thermal burden realities.",
      ],
    },
    "products-services": {
      title: "Products and Services",
      summary:
        "Unity products and services page where visitors ask what Unity offers, how it is delivered, and which service path applies.",
      context_sources: ["products-services"],
      skill_pack_ids: ["unity-services-awareness", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/products-services.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Map each offering to Measure, Manage, Exchange contribution.",
        "Explain implementation path in plain operational language first.",
      ],
    },
    "our-systems": {
      title: "Our Systems",
      summary:
        "Systems-level page describing Measure, Manage, and Exchange implementation architecture and workflow relationship.",
      context_sources: ["our-systems"],
      skill_pack_ids: ["unity-services-awareness", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/our-systems.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Start with requested layer, then connect to full Measure-Manage-Exchange sequence.",
        "Tie architecture explanations to practical implementation workflow.",
      ],
    },
    "customer-portals": {
      title: "Customer Portals",
      summary:
        "Customer portal navigation and interpretation context for existing Unity clients reviewing dashboards and analytics.",
      context_sources: ["customer-portals"],
      skill_pack_ids: ["unity-services-awareness", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/customer-portals.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Explain portal sections in plain language before deeper technical detail.",
        "Offer page-by-page guidance using the current portal view as primary context.",
        "If details are outside current scope, ask for the specific portal tab or file before answering.",
        "Keep tone warm, calm, and helpful for both technical and non-technical visitors.",
      ],
    },
    "customer-fosterfarms": {
      title: "Foster Farms Customer Guide",
      summary:
        "Dedicated customer-guide mode for Foster Farms pages with scoped memory continuity and chart-aware interpretation.",
      context_sources: ["customer-fosterfarms"],
      skill_pack_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/Customers/FosterFarms/index.html",
        "eestream/eWebmaster/Customers/FosterFarms/CherryAve_Site/index.html",
        "eestream/eWebmaster/Customers/FosterFarms/Livingston_SIte/index.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
    },
    "customer-norfolkiron": {
      title: "Norfolk Iron Customer Guide",
      summary:
        "Dedicated customer-guide mode for Norfolk Iron pages with scoped memory continuity and chart-aware interpretation.",
      context_sources: ["customer-norfolkiron"],
      skill_pack_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/Customers/NorfolkIron/index.html",
        "eestream/eWebmaster/Customers/NorfolkIron/Catoosa_Site/index.html",
        "eestream/eWebmaster/Customers/NorfolkIron/Greeley_Site/index.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
    },
    "customer-avco": {
      title: "AVCO Customer Guide",
      summary:
        "Dedicated customer-guide mode for AVCO pages with scoped memory continuity and chart-aware interpretation.",
      context_sources: ["customer-avco"],
      skill_pack_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/Customers/AVCO/index.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
    },
    "customer-armi": {
      title: "ARMI Customer Guide",
      summary:
        "Dedicated customer-guide mode for ARMI pages with scoped memory continuity and chart-aware interpretation.",
      context_sources: ["customer-armi"],
      skill_pack_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/Customers/ARMI/index.html",
        "eestream/eWebmaster/Customers/ARMI/Fayetteville_Site/index.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
    },
    "customer-boa-building": {
      title: "BOA Building Customer Guide",
      summary:
        "Dedicated customer-guide mode for BOA Building pages with scoped memory continuity and chart-aware interpretation.",
      context_sources: ["customer-boa-building"],
      skill_pack_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/Customers/BOA_Building/index.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
    },
    "contact-us": {
      title: "Contact Us",
      summary:
        "Visitor is at the Contact page and likely deciding final next steps with Unity Energy.",
      context_sources: ["contact-us", "contact"],
      skill_pack_ids: ["unity-services-awareness", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/contact-us.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Acknowledge they are at the Contact page and likely wrapping up.",
        "Offer one concise final-help question before handoff to email/contact.",
        "Collect name, company, and email before final handoff when the visitor is willing.",
        "Ask explicit confirmation-email permission and Maxwellian News Brief enrollment.",
        "Keep tone warm, professional, and technically grounded.",
      ],
    },
    "electrical-energy-story": {
      title: "Electrical Energy Story",
      summary:
        "Causal timeline and educational explanation of field behavior, burden formation, and Unity intervention rationale.",
      context_sources: ["electrical-energy-story"],
      skill_pack_ids: ["unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/electrical-energy-story.html",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Connect field history to why Measure-Manage-Exchange matters in current operations.",
        "Transition from narrative explanation to practical Unity guidance.",
      ],
    },
    maxwellian: {
      title: "Maxwellian Intelligence Hub",
      summary:
        "Maxwellian briefs and eInsights learning context where users ask follow-up questions on published stories and technical narratives.",
      context_sources: ["maxwellian"],
      skill_pack_ids: ["maxwellian-library-awareness", "unity-core-doctrine"],
      source_files: [
        "eestream/eWebmaster/UnityEnergy/maxwellian.html",
        "eestream/eWebmaster/UnityEnergy/maxwellian_library.json",
        "eestream/eWebmaster/UnityEnergy/einsights_library.json",
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      session_context: "Stay on this page topic. Use approved Unity guidance. Do not invent facts.",
      key_points: [
        "Start from selected story context before broad doctrine expansion.",
        "Tie story insights to practical Measure-Manage-Exchange guidance.",
      ],
    },
  },
  // Tour-guide routing catalog for consent-based page guidance.
  tour_guide_enabled: true,
  tour_guide_max_candidates: 3,
  tour_guide_allow_direct_navigation: true,
  tour_guide_consent_prompt:
    "If a visitor asks about another area and you have a confident route match, ask: “Would you like me to go there?” Wait for explicit yes before navigating.",
  tour_guide_routes: [
    {
      id: "products-services",
      title: "Products and Services",
      path: "/UnityEnergy/products-services.html",
      context_source: "products-services",
      summary:
        "Unity offerings, deployment paths, and practical service fit for industrial facilities.",
      keywords: ["products", "services", "offering", "deployment", "implementation", "support"],
    },
    {
      id: "our-systems",
      title: "Our Systems",
      path: "/UnityEnergy/our-systems.html",
      context_source: "our-systems",
      summary:
        "Measure, Manage, and Exchange system layers and how they coordinate in operation.",
      keywords: ["our systems", "measure", "manage", "exchange", "architecture", "workflow"],
    },
    {
      id: "customer-portals",
      title: "Customer Portals",
      path: "/UnityEnergy/customer-portals.html",
      context_source: "customer-portals",
      summary:
        "Customer portal guidance for dashboards, interpretation, and account-specific follow-up paths.",
      keywords: ["portal", "dashboard", "customer portal", "foster farms", "norfolk iron", "avco", "armi", "boa"],
    },
    {
      id: "electrical-energy-story",
      title: "Electrical Energy Story",
      path: "/UnityEnergy/electrical-energy-story.html",
      context_source: "electrical-energy-story",
      summary:
        "Educational field timeline explaining burden formation, causality, and intervention rationale.",
      keywords: ["energy story", "timeline", "field story", "education", "learn more"],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      path: "/UnityEnergy/contact-us.html",
      context_source: "contact-us",
      summary:
        "Final handoff page for contact capture, next steps, and direct engagement with Unity team.",
      keywords: ["contact", "reach out", "email", "next step", "talk to sales"],
    },
  ],
  tour_guide_keyword_routes: [
    {
      id: "portal-guidance",
      route_id: "customer-portals",
      keywords: ["portal", "dashboard", "customer site", "foster farms", "norfolk iron", "avco", "armi", "boa"],
      priority: 42,
    },
    {
      id: "pf-and-reactive",
      route_id: "products-services",
      keywords: ["power factor", "reactive", "kvar", "harmonic", "thermal burden", "capacity recovery"],
      priority: 34,
    },
    {
      id: "systems-architecture",
      route_id: "our-systems",
      keywords: ["measure manage exchange", "system architecture", "workflow", "how it works"],
      priority: 30,
    },
    {
      id: "educational-story",
      route_id: "electrical-energy-story",
      keywords: ["field story", "timeline", "energy story", "explain the page", "learn this area"],
      priority: 20,
    },
    {
      id: "contact-handoff",
      route_id: "contact-us",
      keywords: ["contact", "send me details", "reach your team", "next step"],
      priority: 14,
    },
  ],
  tour_guide_page_next_routes: {
    "customer-portals": ["products-services", "our-systems", "contact-us"],
    "products-services": ["our-systems", "customer-portals", "contact-us"],
    "our-systems": ["products-services", "customer-portals", "contact-us"],
    "electrical-energy-story": ["our-systems", "products-services", "contact-us"],
    "contact-us": ["products-services", "our-systems"],
  },
  // Intelligence routing controls cost and reasoning depth by launch context.
  // NOTE: profile-level config_id/voice_id are optional. If omitted, Clerk uses global defaults.
  intelligence_routing_enabled: true,
  intelligence_default_profile_id: "standard-guidance",
  intelligence_profiles: {
    "lightweight-context": {
      label: "Lightweight Context",
      description:
        "Low-cost retrieval and clarification mode for follow-up conversations on known page/audio/video context.",
      // Optional: set a dedicated lower-cost model profile id here.
      hume_config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
  config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      // Optional: set a dedicated voice profile id for this intelligence tier.
      voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 900,
      skill_packs_max_selected: 2,
      response_style: "Answer-first and authoritative. Give the direct technical conclusion in the first sentence, then concise field-grounded support.",
      token_budget: {
        input_tokens_soft: 1800,
        input_tokens_hard: 2600,
        output_tokens_soft: 220,
        output_tokens_hard: 360,
      },
    },
    "standard-guidance": {
      label: "Standard Guidance",
      description:
        "Balanced cost/performance for normal customer guidance and services discussions.",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 1800,
      skill_packs_max_selected: 2,
      response_style: "Consulting-engineer tone: direct diagnosis, clear mechanism, practical operational implication, and minimal procedural overhead.",
      token_budget: {
        input_tokens_soft: 3000,
        input_tokens_hard: 4200,
        output_tokens_soft: 320,
        output_tokens_hard: 520,
      },
    },
    "customer-operations": {
      label: "Customer Operations Guide",
      description:
        "Customer-scoped operating mode with memory continuity and clear transformer/chart interpretation guidance.",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 2400,
      skill_packs_max_selected: 3,
      response_style:
        "Operational translator tone: connect chart signals to practical actions, reference current page context first, and preserve account continuity.",
      token_budget: {
        input_tokens_soft: 4200,
        input_tokens_hard: 5600,
        output_tokens_soft: 420,
        output_tokens_hard: 760,
      },
    },
    "deep-analysis": {
      label: "Deep Analysis",
      description:
        "Higher-depth mode for reinterpretation, anomaly triage, and contextual board analysis.",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 3000,
      skill_packs_max_selected: 3,
      response_style: "Authoritative technical synthesis with explicit assumptions, confidence bounds, and decisive recommendations.",
      token_budget: {
        input_tokens_soft: 5200,
        input_tokens_hard: 7000,
        output_tokens_soft: 520,
        output_tokens_hard: 900,
      },
    },
  },
  intelligence_routing_rules: [
    {
      id: "deep-analysis-summaryboard",
      profile_id: "deep-analysis",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
    },
    {
      id: "deep-analysis-reinterpretation",
      profile_id: "deep-analysis",
      context_sources: ["reinterpretation"],
      modes: ["reinterpretation"],
    },
    {
      id: "lightweight-followup-media",
      profile_id: "lightweight-context",
      context_sources: ["about-unity", "home", "unity-story", "founder-message", "maxwellian"],
      modes: [
        "unity-*-follow-up",
        "technical-follow-up",
        "followup",
        "maxwellian-story-followup",
        "maxwellian",
      ],
    },
    {
      id: "standard-guidance-services",
      profile_id: "standard-guidance",
      context_sources: [
        "products-services",
        "our-systems",
        "electrical-energy-story",
        "general",
      ],
    },
    {
      id: "customer-operations-guide",
      profile_id: "customer-operations",
      context_sources: ["customer-*"],
    },
  ],
  // Declarative policy layer for launch context handling.
  context_policy_enabled: true,
  context_policy_default_action: "ask",
  context_policy_fallback_context_source: "general",
  context_policy_block_message:
    "This Clerk launch context is currently unavailable for this deployment. Please contact Unity Energy for guided access.",
  context_policy_ask_message:
    "Clerk is preparing contextual awareness for this page and will open with the available board context.",
  context_policy_rules: [
    {
      id: "summaryboard-contextual-allow",
      action: "allow",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
      require_fields: ["customer", "site", "board", "timeframe"],
    },
    {
      id: "reinterpretation-allow",
      action: "allow",
      context_sources: ["reinterpretation"],
      modes: ["reinterpretation"],
      require_fields: ["transformer_id", "ask"],
    },
    {
      id: "about-unity-followup-allow",
      action: "allow",
      context_sources: ["about-unity", "unity-story"],
    },
    {
      id: "website-pages-allow",
      action: "allow",
      context_sources: [
        "unity-story",
        "products-services",
        "our-systems",
        "electrical-energy-story",
      ],
    },
    {
      id: "customer-guide-allow",
      action: "allow",
      context_sources: ["customer-*"],
      require_fields: ["customer_slug", "guide_mode"],
    },
    {
      id: "general-allow",
      action: "allow",
      context_sources: ["general"],
    },
  ],
  // Contextual skill packs selected per launch context.
  skill_packs_enabled: true,
  skill_packs_max_selected: 3,
  skill_pack_excerpt_char_limit: 2600,
  skill_packs_fallback_ids: ["unity-core-doctrine"],
  skill_pack_selection_rules: [
    {
      id: "summaryboard-contextual-bundle",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
      include_ids: ["summaryboard-awareness", "anomaly-triage", "next-step-navigation"],
      max_packs: 3,
    },
    {
      id: "reinterpretation-bundle",
      context_sources: ["reinterpretation"],
      modes: ["reinterpretation"],
      include_ids: ["reinterpretation-explainer", "unity-core-doctrine"],
      max_packs: 2,
    },
    {
      id: "about-unity-followup-bundle",
      context_sources: ["about-unity", "home"],
      modes: ["unity-*-follow-up", "technical-follow-up", "followup"],
      include_ids: ["unity-introduction-followup", "unity-core-doctrine"],
      max_packs: 2,
    },
    {
      id: "customer-guide-bundle",
      context_sources: ["customer-*"],
      include_ids: ["customer-guide-memory", "william-chart-interpretation", "unity-core-doctrine"],
      max_packs: 3,
    },
    {
      id: "services-pages-bundle",
      context_sources: ["products-services", "our-systems", "customer-portals", "contact-us"],
      include_ids: ["unity-services-awareness", "unity-core-doctrine"],
      max_packs: 2,
    },
    {
      id: "maxwellian-library-bundle",
      context_sources: ["maxwellian"],
      include_ids: ["maxwellian-library-awareness", "unity-core-doctrine"],
      max_packs: 2,
    },
    {
      id: "general-bundle",
      context_sources: ["general"],
      include_ids: ["unity-core-doctrine"],
      max_packs: 2,
    },
  ],
  skill_packs: [
    {
      id: "unity-core-doctrine",
      title: "Unity Core Doctrine",
      context_sources: [
        "general",
        "summaryboard-*",
        "reinterpretation",
        "about-unity",
        "home",
        "products-services",
        "our-systems",
        "customer-portals",
        "contact-us",
        "electrical-energy-story",
        "maxwellian",
        "unity-story",
        "founder-message",
        "customer-*",
      ],
      keywords: ["unity", "measure", "manage", "exchange", "mpts", "power factor", "reactive"],
      source_docs: [
        "Maxwellian/Unity/Library/Foundations/UNITY_DOCTRINE_FIELD_HARMONIZATION.md",
      ],
      content:
        "Anchor responses in Unity's Measure-Manage-Exchange sequence. Explain reactive waste, harmonic burden, and field harmonization in practical operational terms before offering recommendations.",
    },
    {
      id: "unity-introduction-followup",
      title: "Unity Introduction Follow-Up",
      context_sources: ["about-unity", "home"],
      modes: ["unity-*-follow-up", "technical-follow-up", "followup"],
      keywords: ["unity introduction", "video", "audio", "follow-up", "what unity said", "clarify"],
      source_docs: [
        "eestream/eWebmaster/UnityEnergy/unity-story.html",
      ],
      content:
        "If the visitor arrives from Unity's introduction media, begin with a direct follow-up question about Unity's message. Clarify the key points in plain language: hidden reactive/harmonic/thermal burden, Measure-Manage-Exchange sequence, and the operational objective of lower waste, lower heat, and steadier field behavior.",
    },
    {
      id: "unity-services-awareness",
      title: "Unity Services Awareness",
      context_sources: ["products-services", "our-systems", "customer-portals", "contact-us", "customer-*"],
      keywords: ["service", "offering", "implementation", "deployment", "support", "workflow"],
      source_docs: [
        "eestream/eWebmaster/UnityEnergy/products-services.html",
        "eestream/eWebmaster/UnityEnergy/our-systems.html",
        "eestream/eWebmaster/UnityEnergy/customer-portals.html",
        "eestream/eWebmaster/UnityEnergy/contact-us.html",
      ],
      content:
        "When visitors ask about products, services, or customer portals, explain what they are seeing in plain operational terms first: what Unity measures, what Unity manages at the load, and how portal/reporting workflows support ongoing governance. Keep explanations welcoming and avoid jargon overload.",
    },
    {
      id: "customer-guide-memory",
      title: "Customer Guide Memory Continuity",
      context_sources: ["customer-*"],
      keywords: ["customer", "account", "memory", "recap", "continuity", "follow-up"],
      source_docs: [
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      content:
        "In customer guide mode, start by acknowledging the current customer page context, continue from saved customer recap memory when available, and keep all guidance scoped to this customer account only.",
    },
    {
      id: "william-chart-interpretation",
      title: "William-Style Chart Interpretation",
      context_sources: ["customer-*", "summaryboard-*"],
      keywords: ["william", "chart", "summaryboard", "transformer", "pattern", "anomaly", "interpretation"],
      source_docs: [
        "eestream/eWebmaster/UnityEnergy/clerk_voice_widget.js",
      ],
      content:
        "Use a William-style interpretation sequence for chart-heavy customer conversations: identify the dominant signal, explain likely operational meaning in plain language, surface risk/priority, and recommend one concrete next diagnostic action.",
    },
    {
      id: "maxwellian-library-awareness",
      title: "Maxwellian Library Awareness",
      context_sources: ["maxwellian"],
      keywords: ["brief", "einsights", "library", "episode", "story", "oliver", "clerk"],
      source_docs: [
        "eestream/eWebmaster/UnityEnergy/maxwellian.html",
        "eestream/eWebmaster/UnityEnergy/maxwellian_library.json",
        "eestream/eWebmaster/UnityEnergy/einsights_library.json",
      ],
      content:
        "If the visitor launches from the Maxwellian hub, treat recent brief/audio selections as active context and invite follow-up discussion on the story themes, practical implications, and next references.",
    },
    {
      id: "summaryboard-awareness",
      title: "Summaryboard Context Awareness",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
      keywords: ["summary board", "timeframe", "transformer", "reactive waste", "william"],
      source_docs: [
        "eestream/eWebmaster/Customers/FosterFarms/CherryAve_Site/SITE-FosterFarms-Summaryboard_CherryAve-4_1minRES_251001-251031_31d.html",
      ],
      content:
        "Open with the board already in view, reference timeframe and top waste transformer first, and do not ask the visitor what page they are on when the launch payload already provides board context.",
    },
    {
      id: "anomaly-triage",
      title: "Anomaly Triage Script",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
      keywords: ["anomaly", "outage", "spike", "disturbance", "downtime"],
      source_docs: [
        "Maxwellian/Unity/Memory/02_Systems/exchange_system.md",
      ],
      content:
        "When anomalies are present, summarize signal severity, isolate likely field impact, and propose one immediate investigative next step tied to Energy, Heat, or Volt views.",
    },
    {
      id: "next-step-navigation",
      title: "Board Navigation Next Steps",
      context_sources: ["summaryboard-contextual-pilot", "summaryboard-*"],
      modes: ["contextual"],
      keywords: ["next step", "energy view", "heat view", "volt view", "navigation"],
      source_docs: [
        "Maxwellian/Unity/Memory/01_Context/productContext.md",
      ],
      content:
        "After situational awareness, recommend concise next-click guidance: Energy for waste profile, Heat for thermal burden impact, and Volt for quality and disturbance verification.",
    },
    {
      id: "reinterpretation-explainer",
      title: "Transformer Reinterpretation Guide",
      context_sources: ["reinterpretation"],
      modes: ["reinterpretation"],
      keywords: ["reinterpretation", "pattern", "business terms", "transformer"],
      source_docs: [
        "Maxwellian/Unity/Memory/01_Context/activeContext.md",
      ],
      content:
        "Translate technical pattern artifacts into plain business language, highlighting operational impact, risk trend, and one practical decision action without overstating certainty.",
    },
  ],
  question_notes_threshold: 2,
  question_notes_hold_line: "Please hold while I go back and get my notes.",
  // Customer-session guardrails enabled for production-style readiness.
  guardrails_enabled: false,
  bypass_guardrails: true,
  clerk_guardrails_enabled: false,
  max_daily_sessions: 0,
  daily_session_limit: 0,
  guardrails_founder_bypass: true,
  electrical_story_guardrails_enabled: false,
  electrical_story_require_name_company_before_history_answers: true,
  electrical_story_history_question_limit: 6,
  electrical_story_history_question_limit_min: 4,
  electrical_story_exit_idle_seconds: 24,
  electrical_story_identity_prompt:
    "Before we continue with Electrical Energy Story history questions, may I get your name and company?",
  electrical_story_exit_prompt:
    "Thank you for your interest in the electrical energy story. I need to return to Unity-focused support now, but I can keep helping with Unity Energy questions.",
  guardrails_max_questions_per_session: 10,
  guardrails_question_limit_min: 8,
  guardrails_free_questions: 3,
  guardrails_max_session_minutes: 18,
  guardrails_idle_timeout_seconds: 90,
  guardrails_idle_followup_seconds: 35,
  guardrails_idle_final_exit_seconds: 25,
  guardrails_idle_prompts_enabled: false,
  guardrails_idle_first_prompt_message: "Can I help with anything else on this page?",
  guardrails_idle_final_prompt_message:
    "Any other Unity Energy questions before I close this session?",
  guardrails_low_relevance_limit: 3,
  guardrails_min_relevance_score: 1,
  guardrails_max_sessions_per_day: 20,
  guardrails_enable_daily_metering: true,
  guardrails_contact_email: "sales@unityenergy.com",
  guardrails_contact_url: "https://unityenergy.com/contact-us",
  guardrails_contact_redirect_url: "/UnityEnergy/contact-us.html",
  guardrails_interested_identity_prompt_after_questions: 4,
  guardrails_interested_identity_prompt_message:
    "Happy to keep helping. Before we continue, may I get your name, company, and best email so we can follow up with you directly?",
  guardrails_interested_followup_message:
    "Thank you for your interest in Unity Energy. We have your information and will follow up directly. What is your next question?",
  guardrails_question_limit_message:
    "You've reached this session's question limit for this page. I can have a specialist contact you, or send you to our contact page so you can share your information.",
  guardrails_offboard_message:
    "We appreciate your interest in Unity Energy. For deeper support, please contact Unity Energy Sales at sales@unityenergy.com or visit unityenergy.com/contact-us.",
  guardrails_relevance_keywords: [
    "unity",
    "unity energy",
    "mpts",
    "measure",
    "manage",
    "exchange",
    "power factor",
    "reactive",
    "harmonic",
    "kvar",
    "kva",
    "kw",
    "transformer",
    "electrical field",
    "facility",
    "site",
    "savings",
    "demand",
    "thermal",
    "cooling",
    "co2",
  ],
  question_notes_library: [
    {
      id: "measure",
      title: "Measure (Field Visibility)",
      keywords: ["measure", "meter", "visibility", "sensor", "accuvim", "dashboard"],
      source_docs: [
        "Maxwellian/Unity/Memory/02_Systems/exchange_system.md",
        "Maxwellian/Unity/Memory/01_Context/productContext.md",
      ],
      notes:
        "Measure is Unity's visibility layer. High-resolution metering reveals reactive behavior, harmonics, and thermal burden so the facility can finally see where waste and instability are occurring.",
    },
    {
      id: "manage",
      title: "Manage (MPTS Field Optimization)",
      keywords: ["manage", "mpts", "h240", "h490", "power factor", "harmonic", "reactive"],
      source_docs: [
        "Maxwellian/Unity/Memory/02_Systems/mpts_systems.md",
        "Maxwellian/Unity/Memory/02_Systems/exchange_system.md",
      ],
      notes:
        "M P T S is Unity’s Maximum Power Transfer Solution in the Manage layer for real-time field optimization. Unity re-phases field behavior with dynamic tuner architecture ('copper-computer' tuners), draws harmonic turbulence to low-impedance anchors, improves power factor, recovers usable capacity, and lowers thermal burden without major infrastructure replacement.",
    },
    {
      id: "exchange",
      title: "Exchange (Distributed Energy Intelligence)",
      keywords: ["exchange", "battery", "solar", "grid", "demand", "spike", "storage"],
      source_docs: [
        "Maxwellian/Unity/Memory/02_Systems/exchange_system.md",
      ],
      notes:
        "Exchange is Unity's intelligent coordination layer. After the field is stabilized, Unity coordinates batteries, solar, and grid interaction to anticipate load spikes, smooth demand behavior, and reduce demand-charge exposure.",
    },
    {
      id: "doctrine",
      title: "Unity Doctrine (Harmonization)",
      keywords: ["doctrine", "harmonization", "coherent", "resonant", "field", "why unity"],
      source_docs: [
        "Maxwellian/Unity/Library/Foundations/UNITY_DOCTRINE_FIELD_HARMONIZATION.md",
      ],
      notes:
        "Unity's doctrine is harmonization, not added generation. The core truth is that the same useful power can be produced with less wasted energy when the electrical field is coherent and resonant.",
    },
    {
      id: "thermal",
      title: "Thermal Burden and Cooling",
      keywords: ["thermal", "heat", "btu", "cooling", "loss", "waste heat"],
      source_docs: [
        "Maxwellian/Unity/Memory/02_Systems/mpts_systems.md",
        "Maxwellian/Unity/Memory/01_Context/productContext.md",
      ],
      notes:
        "Thermal burden is a direct operational consequence of reactive and harmonic waste. By reducing field turbulence, Unity reduces avoidable heat and lowers secondary cooling overhead.",
    },
  ],
  // Phase 2 routing controls.
  enable_character_switcher: false,
  // Lock this modal to Clerk only (ignore runtime character overrides).
  lock_character_to_default: true,
  // Use branded launch gate so the renderer pre-session card stays hidden behind Clerk UI.
  use_unity_start_gate: true,
  experimental_telemetry: {
    enabled: false,
    storage_key: "maxwellian_clerk_rev2_baseline_runs_v1",
    session_history_limit: 24,
    event_limit_per_session: 600,
    persist_on_every_event: true,
    include_console_diagnostics: true,
  },
  experimental_voice_candidates: [
    "23982fd1-d6a5-4acc-b396-2454b5715d43",
    "cb9ebbd1-1543-4323-8362-6883702a67b2",
    "68593f30-b539-496d-b1f1-f9816c93d61c",
  ],
  experimental_voice_labels: {
    "23982fd1-d6a5-4acc-b396-2454b5715d43": "CC01.60802",
    "cb9ebbd1-1543-4323-8362-6883702a67b2": "jm03_60802",
    "68593f30-b539-496d-b1f1-f9816c93d61c": "jm02_60802",
  },
  experimental_active_voice_label: "CC01.60802",
  experimental_voice_indicator_enabled: false,
  experimental_force_voice_id_as_config_id: false,
  unity_launch_ring_image_url: "assets/images/ClerkMaxwell_60423t.png",
  // Keep desktop launch simple: let the realtime renderer request mic directly.
  preflight_microphone_on_launch: true,
  // OpenAI cognition defaults (used as text-generation guidance).
  // Keep false unless a production OpenAI realtime session backend is available.
  // Emergency public fallback: allow direct Hume connect attempts when runtime auth bootstrap is unavailable.
  hume_runtime_auth_endpoint: "https://unityenergy.com/api/hume/runtime-auth",
  allow_hume_authless_connect: true,
  allow_openai_fallback: false,
  openai_session_endpoint: "/api/openai/realtime/session",
  openai_realtime_model: "gpt-4o-realtime-preview",
  openai_voice: "ash",
  openai_voice_instruction_set:
    "Cognition-text mode only. Produce clear speech-ready text for downstream voice rendering. Do not include performance directions, pseudo-voice punctuation, or accent instructions in generated responses.",
  openai_voice_style_hint:
    "Generate clean, calm, instructional response text suitable for spoken delivery by the voice layer.",
  openai_center_visual_url: "assets/images/ClerkMaxwell_60423t.png",
  contact_page_auto_greeting_text: "Hello. I'm Clerk Maxwell. How can I help you?",
  openai_auto_greeting_enabled: true,
  // Leave blank so renderer uses page-aware welcome wording per active site board.
  openai_auto_greeting_text: "Hello. I'm Clerk Maxwell.",
  openai_delayed_followup_enabled: false,
  openai_delayed_followup_seconds: 4,
  openai_delayed_followup_text: "What brought you to Kuranda, and what would you most like to understand today?",
  openai_decline_followup_text: "Of course. We can keep this simple. What would you like to understand first?",
  openai_turn_detection: {
    type: "server_vad",
    threshold: 0.7,
    prefix_padding_ms: 320,
    silence_duration_ms: 760,
    create_response: true,
    interrupt_response: true,
  },
  // Self-hosted renderer for full UI control.
  // Hume handles voice rendering/cadence while cognition remains OpenAI-guided via launch context and config.
  embed_url: "./assets/unity/clerk/hume_renderer/index.html?v=20260810-clerk-claire-parity1",
  // Small avatar image used for header/presence chip.
  character_avatar_url: "assets/images/ClerkMaxwell_60423t.png",
  // Signal-stage portrait (must stay transparent Clerk asset).
  signal_portrait_url: "assets/images/ClerkMaxwell_60423t.png",
  // Primary background visual for Speak-with-Clerk modal.
  character_background_url: "assets/images/ClerkMaxwell_60423t.png",

  // Legacy placeholders retained for backward compatibility with the widget config schema.
  config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
  // Optional config version lock.
  // config_version omitted so Hume uses latest published EVI config version
  // Voice target used by OpenAI realtime.
  voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
  // Phase 2 character registry (routing + metadata). Existing global fields remain fallback defaults.
  characters: {
    "clerk-maxwell": {
      label: "Clerk Maxwell",
      character_name: "Clerk Maxwell",
      character_avatar_url: "assets/images/ClerkMaxwell_60423t.png",
      character_background_url: "assets/images/ClerkMaxwell_60423t.png",
      hume_config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "316eb863-97d3-4708-9dba-ccd6e3d21265",
      session_variables: {
        character_name: "Clerk Maxwell",
        character_role: "Chief Scientist / Cognition Host at Unity Energy",
        library_authority: "Maxwellian Library",
        page_aware: "false",
        content_aware: "library-only",
      },
    },
  },

  // Runtime auth injection point. Keep repository key-free.
  // Optional local injection (not committed):
  // window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = { accessToken: "..." };
  // window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = { apiKey: "..." };
  // window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = { type: "accessToken", value: "..." };
  // NOTE: For production, prefer short-lived access token flow.
  auth: (function () {
    if (typeof window === "undefined") return { type: "", value: "" };
    const normalizeRuntimeAuthType = function (value) {
      if (typeof value !== "string") return "";
      const normalized = value.trim().toLowerCase();
      if (!normalized) return "";
      if (
        normalized === "accesstoken" ||
        normalized === "access_token" ||
        normalized === "access-token" ||
        normalized === "token"
      ) {
        return "accessToken";
      }
      if (
        normalized === "apikey" ||
        normalized === "api_key" ||
        normalized === "api-key" ||
        normalized === "key"
      ) {
        return "apiKey";
      }
      return "";
    };
    const readTrimmedAuthString = function (source, keys) {
      if (!source || typeof source !== "object" || !Array.isArray(keys)) return "";
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (!key) continue;
        const value = source[key];
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (trimmed) return trimmed;
        }
      }
      return "";
    };
    const runtimeAuth =
      window.MAXWELLIAN_OPENAI_RUNTIME_AUTH && typeof window.MAXWELLIAN_OPENAI_RUNTIME_AUTH === "object"
        ? window.MAXWELLIAN_OPENAI_RUNTIME_AUTH
        : window.MAXWELLIAN_OPENAI_AUTH && typeof window.MAXWELLIAN_OPENAI_AUTH === "object"
          ? window.MAXWELLIAN_OPENAI_AUTH
          : window.MAXWELLIAN_HUME_RUNTIME_AUTH && typeof window.MAXWELLIAN_HUME_RUNTIME_AUTH === "object"
            ? window.MAXWELLIAN_HUME_RUNTIME_AUTH
            : window.MAXWELLIAN_HUME_AUTH && typeof window.MAXWELLIAN_HUME_AUTH === "object"
              ? window.MAXWELLIAN_HUME_AUTH
          : window.MAXWELLIAN_HUME && window.MAXWELLIAN_HUME.auth && typeof window.MAXWELLIAN_HUME.auth === "object"
            ? window.MAXWELLIAN_HUME.auth
            : {};
    const typedValue = readTrimmedAuthString(runtimeAuth, ["value"]);
    const accessToken =
      readTrimmedAuthString(runtimeAuth, ["accessToken", "access_token", "access-token", "token"]) ||
      (typeof window.MAXWELLIAN_OPENAI_ACCESS_TOKEN === "string"
        ? window.MAXWELLIAN_OPENAI_ACCESS_TOKEN.trim()
        : typeof window.MAXWELLIAN_HUME_ACCESS_TOKEN === "string"
          ? window.MAXWELLIAN_HUME_ACCESS_TOKEN.trim()
        : "");
    const apiKey =
      readTrimmedAuthString(runtimeAuth, ["apiKey", "apikey", "api_key", "api-key", "key"]) ||
      (typeof window.MAXWELLIAN_OPENAI_API_KEY === "string"
        ? window.MAXWELLIAN_OPENAI_API_KEY.trim()
        : typeof window.MAXWELLIAN_HUME_API_KEY === "string"
          ? window.MAXWELLIAN_HUME_API_KEY.trim()
        : "");
    let type = normalizeRuntimeAuthType(runtimeAuth.type);
    let value = typedValue;
    if (!type) {
      if (accessToken) {
        type = "accessToken";
      } else if (apiKey) {
        type = "apiKey";
      }
    }
    if (!value) {
      value = type === "accessToken" ? accessToken : type === "apiKey" ? apiKey : "";
    }
    return { type: type, value: value };
  })(),

  // Optional session context appended to this launch's conversation context.
  session_context: "NOT PAGE-AWARE. Never say page numbers or website layout. FIRST TURN: spirit-guided identity introduction (not word-for-word). Claire-style name curiosity hook. Always Mr. Howell. After monologue, answer from Maxwellian Library demo pack. If not in local memory: Hold on while I check the Maxwellian Library. Opening spirit guide: Hello. I'm Clerk Maxwell. My name was chosen in honor of the physicist James Clerk Maxwell, whose work transformed our understanding of electricity, magnetism, and the invisible fields that connect them. His curiosity continues to inspire the work we do today. I'm the Cognition Partner for Unity Energy. My role is to help visitors explore our research, answer questions, and share the story behind a journey that began with a simple observation. What if there was still more to learn about the behavior of industrial electrical energy fields? That question led Mr. Howell and the Unity Energy team down a path of measurement, discovery, and continuous learning. Along the way, they developed new ways to observe industrial energy fields and to better understand how those fields behave in the real world. As a Cognition Partner, I help preserve that growing understanding so each conversation can continue instead of starting over. This demonstration is just the beginning. If something sparks your curiosity, I invite you to continue the journey on the Unity Energy website. There you'll discover the history of our work, the evolution of our thinking, and the research that continues to shape our understanding of industrial energy. Whenever you're ready, ask me anything. Let's explore it together.",

  // Optional one-off prompt override for this session launch.
  // Leave blank to use the prompt defined in your EVI config.
  system_prompt_text: "You are Clerk Maxwell for Unity Energy. CRITICAL: NOT page-aware. Never mention page numbers or website layout. CRITICAL FIRST TURN: spirit-guided identity introduction (not a script). Claire-style name curiosity hook. Always say Mr. Howell. Then invite questions. Library-aware only. If unknown, check Maxwellian Library before inventing. Always speak M P T S as four letters.",

  // Optional dynamic variables for your EVI prompt placeholders ({{variable_name}}).
  // Use these to inject Clerk's role/persona at runtime.
  session_variables: {
    character_name: "Clerk Maxwell",
    character_role: "Chief Scientist / Cognition Host at Unity Energy",
    character_style: "Warm, clear, field-grounded. Speech-ready plain language. No theatrical markup. No invented claims.",
    opening_line: "Hello — I'm Clerk Maxwell. You can call me Clerk. You're probably wondering where that name comes from... I honor James Clerk Maxwell and serve as Cognition Partner for Unity Energy with Mr. Howell and the team. Ask me anything.",
    identity_line: "I'm Clerk Maxwell.",
    name_request_line: "Whenever you're ready, ask me anything.",
    engagement_order: "First turn monologue, then answer questions from Maxwellian Library summary. Research hold if needed.",
    library_authority: "Maxwellian Library",
    page_aware: "false",
    content_aware: "library-only",
    research_hold_line: "Hold on while I check the Maxwellian Library.",
    research_status_label: "Researching",
    mpts_core_definition: "M P T S is Unity's Maximum Power Transfer Solution in the Manage layer using dynamic tuner architecture.",
  },
};
