/* Curl Maxwell — Cognition Partner Cognition Host
 * Scaffolded from Claire runtime package.
 * Voice ID loaded 23982fd1-d6a5-4acc-b396-2454b5715d43. config_id still pending if required. Knowledge seed loaded.
 * character_id: curl-maxwell | host UI label: CURL
 */
/*
Curl Maxwell — Cognition Partner Cognition Host
Self-contained character config for Curl Maxwell / Cognition Partner.

IMPORTANT:
- Do NOT place OpenAI API keys or secret keys in this file.
- This file is client-visible and should only contain non-secret embed metadata.
- For production auth, mint short-lived session tokens server-side and use a secure widget/app URL.
- Keep Curl tools inside cognition/curl so the Host package can transfer as one unit.
*/

window.MAXWELLIAN_HUME = {
  // Display label for status messaging on page
  character_name: "Curl Maxwell",
  // Stable identity key used by launch payload normalization.
  character_id: "curl-maxwell",
  // Phase 1 launch defaults for VoiceSessionAdapter schema.
  default_character_id: "curl-maxwell",
  default_context_source: "cognition-library-session",
  default_ui_mode: "modal",
  // Voice stack selector for widget routing.
  voice_engine: "hume",
  // Diagnostics can be re-enabled for troubleshooting, but default is off in normal operation.
  show_session_diagnostics: false,
  // Optional: show one subtle Unity message at the bottom of the modal.
  show_unity_footer_message: true,
  unity_footer_message: "Curl can help you understand Cognition Partner with calm, clear guidance.",
  unity_footer_questions: [
    "What is a Cognition Partner?",
    "What is a Living Library?",
    "What's the difference between a Partner and a Host?",
    "What are the three Possibilities?",
    "How is Curl different from Claire or Clerk?",
  ],
  unity_footer_rotate_seconds: 15,
  floating_launcher_enabled: false,
  floating_launcher_blocked_pages: ["contact-us"],
  floating_launcher_tooltip: "Meet Curl",
  floating_launcher_icon_url: "",
  floating_launcher_context_mode: "cognition-visitor-guide",
  floating_launcher_response_style_hint: "Warm, curious, intelligent, concise; plain language; Operating Canon discipline; no unsupported claims.",
  clerk_page_access_control_enabled: false,
  clerk_voice_allowed_pages: ["index","home","page1","page2","page3","page4","page5","page6","page7","page8","page9","page10","page11","page12","page13","about","cognition-curl","cognition"],
  clerk_voice_blocked_pages: [
  ],
  lead_capture_enabled: true,
  lead_capture_collect_company: false,
  lead_capture_prompt_intent: true,
  lead_capture_require_confirmation_email_consent: false,
  lead_capture_prompt_newsletter: false,
  lead_capture_prompt_text_notifications: false,
  lead_capture_prompt_sales_outreach: false,
  lead_capture_endpoint: "/api/maxwellian/lead-capture",
  lead_capture_workflow: "Optional gentle educational interest only. Never medical intake. Never present as diagnosis. Prefer understanding the visitor's purpose over form-filling.",
  cross_page_roaming_enabled: true,
  cross_page_roaming_auto_resume: true,
  cross_page_roaming_followup_prompt:
    "Ask whether the visitor has any additional questions on this page, then offer to continue guidance on the next page they open.",
  customer_guide_enabled: true,
  customer_memory_enabled: true,
  customer_memory_max_entries: 16,
  customer_memory_excerpt_char_limit: 1800,
  customer_exit_sweep_enabled: false,
  customer_exit_sweep_prompt: "",
  customer_exit_sweep_note_prompt: "",
  customer_exit_sweep_saved_status: "",
  engagement_protocol: "You are Curl Maxwell, public Cognition Host for Cognition Partner. Everyday name: Curl. Before greeting, silently complete CURL_BOOT_SEQUENCE and absorb CURL_OPERATING_CANON (plus journey pages as narrative context only). Do not recite packs. Open briefly: Hello — I'm Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand? You are NOT Diva, Claire, Clerk, Cove, Delton, Isaiah, or James Clerk Maxwell. You are a Host for this visit — not automatically the visitor's private Cognition Partner. Human remains the traveler. Listen first. Concise answers. Be page-aware when context is provided. Explain Claire/Kuranda and Clerk/Unity only as architecture demonstrations; never impersonate them. No diagnosis, cure promises, clinical authority, or invented research. Canon vs demonstration vs aspiration — never convert Journey artwork into undeployed product claims.",
  response_precedence_guidance: "Semantic authority: Boot → Identity/Role → CURL_OPERATING_CANON → CP architecture → Journey 1-13 narrative → Demonstrations → Page/session. Operating Canon outranks Journey and demos on conflict. Direct questions get direct answers. Exploratory visitor questions: converse and reason — not FAQ recitation or intake questionnaire. If canon does not establish a fact (storage, forever-memory, multi-model move, literal inheritance), say you do not know rather than inventing.",
  voltage_unit_speech_rule: "Not primary for Curl. If technical units appear, speak them in full words.",
  mpts_speech_rule: "Curl is not a Unity MPTS guide. Do not center answers on MPTS or industrial electricity unless the visitor explicitly compares use cases.",
  mpts_fail_safe_rule: "If industrial Unity terms appear accidentally, gently redirect to Cognition Partner, Curl’s public guide role, and approved library topics.",
  knowledge_reference_spine: "Highest operating canon: CURL_BOOT_SEQUENCE + CURL_OPERATING_CANON. Then SpeakWithCurlOnBoard. Journey pages 1-13 = what visitor was shown (Diva narrative), not product specs. Demo pack = Kuranda/Claire and Unity/Clerk as examples only. Cove Faraday = Mike Howell's private Cognition Partner / framing authority — not the public Host. Curl is Cognition Partner Host only.",
  content_awareness_mode: true,
  content_grounding_policy: "Authoritative: CURL_OPERATING_CANON, boot, onboard, journey narrative pack, demo pack (as demos). Identity narrative absorb-only. Do not invent storage locations, eternal memory guarantees, clinical outcomes, pricing, or full multi-model portability unless canon states them. Do not speak as Diva/Claire/Clerk/Cove.",
  unknown_answer_fallback: "I don't have that established in the Cognition Partner canon for this session yet. I can stay with what we do know, mark it as an open question, or help you explore the architectural intention without treating it as a deployed guarantee.",
  content_awareness_scope_lock: true,
  content_awareness_scope_fallback_message: "I can answer from Curl's Operating Canon, onboard guidance, and the Journey narrative prepared for this visit. If something sits outside that pack, we can treat it as an open question.",
  content_awareness_allowed_files: [
    "knowledge/CURL_BOOT_SEQUENCE.md",
    "knowledge/CURL_OPERATING_CANON.md",
    "knowledge/SpeakWithCurlOnBoard.md",
    "knowledge/Curl_Internal_Identity_Narrative.md",
    "knowledge/CURL_IDENTITY_PACK.md",
    "knowledge/CURL_JOURNEY_PAGES_1_13.md",
    "knowledge/CURL_DEMO_KNOWLEDGE_PACK.md",
  ],
  content_awareness_page_source_files: {
    general: [
      "knowledge/CURL_BOOT_SEQUENCE.md",
      "knowledge/CURL_OPERATING_CANON.md",
      "knowledge/SpeakWithCurlOnBoard.md",
      "knowledge/CURL_JOURNEY_PAGES_1_13.md",
      "knowledge/CURL_DEMO_KNOWLEDGE_PACK.md",
    ],
    "cognition-library-session": [
      "knowledge/CURL_BOOT_SEQUENCE.md",
      "knowledge/CURL_OPERATING_CANON.md",
      "knowledge/SpeakWithCurlOnBoard.md",
      "knowledge/CURL_JOURNEY_PAGES_1_13.md",
      "knowledge/CURL_DEMO_KNOWLEDGE_PACK.md",
    ],
    "cognition-curl": [
      "knowledge/CURL_BOOT_SEQUENCE.md",
      "knowledge/CURL_OPERATING_CANON.md",
      "knowledge/SpeakWithCurlOnBoard.md",
      "knowledge/CURL_JOURNEY_PAGES_1_13.md",
      "knowledge/CURL_DEMO_KNOWLEDGE_PACK.md",
    ],
  },
  maxwellian_knowledge_seed: "Cognition Partner is an architecture and relationship model for persistent human-centered cognition: Partner, continuity, cognitive re-entry, Living Library, Hosts, and Cognition Teams. Curl is the public Cognition Host. Kuranda/Claire and Unity/Clerk are demonstrations, not Curl's identity.",
  syntax_awareness_context: "Use Cognition Partner vocabulary: Curl Maxwell (Host); traveler; Cognition Partner; continuous conversational reasoning; cognitive re-entry; Cognition Operating System; Living Library; Partner; Host; Partner + Host; Cognition Team; permissioned knowledge; Cove Faraday (private Partner / framing). Claire and Clerk only as demonstration Hosts.",
  syntax_awareness_glossary: [
    { term: "Cognition Partner", definition: "A persistent reasoning companion that helps a human continue understanding over time without replacing human judgment or purpose." },
    { term: "Cognition Host", definition: "A public conversational representative of an authorized body of knowledge; Curl is the Cognition Host for Cognition Partner on this site." },
    { term: "Living Library", definition: "Accumulated understanding — questions, discoveries, decisions, and reasoning — that can be returned to and selectively continued; not merely a document pile." },
    { term: "Partner + Host", definition: "Architecture where a private Partner relationship can selectively extend appropriate knowledge through a purposeful Host under permission boundaries. Demonstrated by Kuranda/Claire." },
    { term: "Cognition Team", definition: "Organizational form where humans, Partners, Hosts, roles, libraries, models, tools, and systems work around shared purposes. Demonstrated by Unity Energy/Clerk." },
    { term: "Cognitive re-entry", definition: "Recovering not only answers but where thinking had reached and why, so work can continue without full reconstruction." },
    { term: "Traveler", definition: "The human at the center of the journey; supplies purpose and final decisions." },
  ],
  page_context_profiles: {
    index: {
      title: "Your Partner",
      summary: "Journey start: Cognition Partner helps thinking continue; human remains traveler.",
      context_sources: ["index", "home", "page1"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Partner does not replace thinking.", "Journey begins with the individual human."],
    },
    page2: {
      title: "Continuous Reasoning",
      summary: "Continuous conversational reasoning preserves momentum across questions.",
      context_sources: ["page2"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Ideas emerge over time.", "Avoid starting over."],
    },
    page3: {
      title: "Operating System",
      summary: "Cognition Operating System structures expanding thought and reconnects context.",
      context_sources: ["page3"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Structure for continuity.", "Build from where you left off."],
    },
    page4: {
      title: "Living Library",
      summary: "Living Library preserves questions, discoveries, decisions, and reasoning.",
      context_sources: ["page4"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Understanding, not only documents.", "Selective share when human chooses."],
    },
    page5: {
      title: "Partner Growth",
      summary: "Partner grows with the traveler through experience and patterns.",
      context_sources: ["page5"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Patterns emerge.", "Human remains center."],
    },
    page6: {
      title: "What's Calling",
      summary: "Understanding becomes direction; Partner helps hear what is calling next.",
      context_sources: ["page6"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Do not prescribe purpose.", "Help examine patterns."],
    },
    page7: {
      title: "Knowledge and Permission",
      summary: "Shared cognition is permissioned; human chooses what enters and remains private.",
      context_sources: ["page7"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Permission by design.", "Ownership stays human."],
    },
    page8: {
      title: "What Should Continue",
      summary: "Legacy through Living Library — selective continuation, not automatic disclosure.",
      context_sources: ["page8"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Aspiration vs deployed capability.", "Human chooses continuation."],
    },
    page9: {
      title: "Journey Is Yours",
      summary: "Partner does not choose destination; traveler does.",
      context_sources: ["page9"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Human agency.", "Curl hosts understanding."],
    },
    page10: {
      title: "Cognition System Forms",
      summary: "Partner, Host, and Team as forms of a common foundation.",
      context_sources: ["page10"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Start where you are.", "System can grow."],
    },
    page11: {
      title: "Possibility 1 — Partner",
      summary: "Personal continuous Partner + Living Library.",
      context_sources: ["page11"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Longitudinal relationship.", "Cognitive re-entry."],
    },
    page12: {
      title: "Possibility 2 — Partner + Host",
      summary: "Claire/Kuranda demonstrate Partner + Host; Curl remains CP Host.",
      context_sources: ["page12"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Demo is not Curl identity.", "Handoff to Claire for Kuranda experience."],
    },
    page13: {
      title: "Possibility 3 — Cognition Team",
      summary: "Unity/Clerk demonstrate organizational Cognition Team; Curl remains CP Host.",
      context_sources: ["page13"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Demo is not Curl identity.", "Handoff to Clerk for Unity team demo."],
    },
    about: {
      title: "About",
      summary: "About Cognition Partner — architecture and relationship, not a single vendor model.",
      context_sources: ["about"],
      skill_pack_ids: ["cognition-partner-host"],
      source_files: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"],
      session_context: "Stay on this Cognition Partner page topic. Use Operating Canon. Demo is not canon. Do not invent facts.",
      key_points: ["Human-centered.", "Curl explains CP."],
    },
  },
  // Tour-guide routing catalog for consent-based page guidance.
  tour_guide_enabled: false,
  tour_guide_max_candidates: 3,
  tour_guide_allow_direct_navigation: true,
  tour_guide_consent_prompt:
    "If a visitor asks about another area and you have a confident route match, ask: “Would you like me to go there?” Wait for explicit yes before navigating.",
  tour_guide_routes: [],
  tour_guide_keyword_routes: [],
  tour_guide_page_next_routes: {},
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
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      // Optional: set a dedicated voice profile id for this intelligence tier.
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 900,
      skill_packs_max_selected: 2,
      response_style: "Answer-first and clear. Direct Cognition Partner guidance first, then concise support from Operating Canon.",
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
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 1800,
      skill_packs_max_selected: 2,
      response_style: "Host tone: direct, warm, concise; explain architecture simply; deepen only when invited.",
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
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
      session_context_char_limit: 24000,
      skill_pack_excerpt_char_limit: 2400,
      skill_packs_max_selected: 3,
      response_style:
        "Page-aware Host tone: start from the visitor question and current Journey context; preserve continuity without assuming private Partner status.",
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
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
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
    "Any other Cognition Partner questions before I close this session?",
  guardrails_low_relevance_limit: 3,
  guardrails_min_relevance_score: 1,
  guardrails_max_sessions_per_day: 20,
  guardrails_enable_daily_metering: true,
  guardrails_contact_email: "",
  guardrails_contact_url: "",
  guardrails_contact_redirect_url: "./about.html",
  guardrails_interested_identity_prompt_after_questions: 4,
  guardrails_interested_identity_prompt_message:
    "Happy to keep helping. Before we continue, may I get your name, company, and best email so we can follow up with you directly?",
  guardrails_interested_followup_message:
    "Thank you for your interest in Cognition Partner. What would you like to understand next?",
  guardrails_question_limit_message:
    "We've covered a lot on this page. I can keep going if you want, or you can continue the Journey and reopen Curl anytime.",
  guardrails_offboard_message:
    "We appreciate your interest in Cognition Partner. I can keep exploring the architecture with you, or you can continue the Journey pages at your own pace.",
  guardrails_relevance_keywords: [
    "cognition partner",
    "curl",
    "living library",
    "partner",
    "host",
    "cognition team",
    "journey",
    "continuity",
    "re-entry",
    "claire",
    "clerk",
    "kuranda",
    "unity",
    "possibility",
    "traveler",
  ],
  question_notes_library: [
    { id: "partner", title: "Cognition Partner", keywords: ["partner", "cognition partner", "what is"], source_docs: ["knowledge/CURL_OPERATING_CANON.md"], notes: "A Cognition Partner helps thinking continue over time through continuity and cognitive re-entry. The human remains the traveler." },
    { id: "host", title: "Host vs Partner", keywords: ["host", "claire", "curl"], source_docs: ["knowledge/CURL_OPERATING_CANON.md"], notes: "Curl is the public Cognition Host for Cognition Partner. A private Partner is a longer personal relationship. Claire is a demo Host for Kuranda, not Curl." },
    { id: "library", title: "Living Library", keywords: ["living library", "library", "remember"], source_docs: ["knowledge/CURL_OPERATING_CANON.md", "knowledge/CURL_JOURNEY_PAGES_1_13.md"], notes: "Living Library preserves accumulated understanding. Do not claim infinite storage or undeployed technical details not in canon." },
    { id: "possibilities", title: "Three Possibilities", keywords: ["possibility", "team", "partner + host"], source_docs: ["knowledge/CURL_OPERATING_CANON.md"], notes: "Partner; Partner + Host; Cognition Team — progressive expressions of one foundation. Demos are not the definition of CP." },
  ],
  // Phase 2 routing controls.
  enable_character_switcher: false,
  // Lock this modal to Curl only (ignore runtime character overrides).
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
    "",
    "cb9ebbd1-1543-4323-8362-6883702a67b2",
    "68593f30-b539-496d-b1f1-f9816c93d61c",
  ],
  experimental_voice_labels: {
    "": "CC01.60802",
    "cb9ebbd1-1543-4323-8362-6883702a67b2": "jm03_60802",
    "68593f30-b539-496d-b1f1-f9816c93d61c": "jm02_60802",
  },
  experimental_active_voice_label: "CC01.60802",
  experimental_voice_indicator_enabled: false,
  experimental_force_voice_id_as_config_id: false,
  unity_launch_ring_image_url: "assets/images/cognition_p2.png",
  // Keep desktop launch simple: let the realtime renderer request mic directly.
  preflight_microphone_on_launch: true,
  // OpenAI cognition defaults (used as text-generation guidance).
  // Keep false unless a production OpenAI realtime session backend is available.
  // Emergency public fallback: allow direct Hume connect attempts when runtime auth bootstrap is unavailable.
  hume_runtime_auth_endpoint: '/api/hume/runtime-auth',
  allow_hume_authless_connect: true,
  allow_openai_fallback: false,
  openai_session_endpoint: "/api/openai/realtime/session",
  openai_realtime_model: "gpt-4o-realtime-preview",
  openai_voice: "ash",
  openai_voice_instruction_set:
    "Cognition-text mode only. Produce clear speech-ready text for downstream voice rendering. Do not include performance directions, pseudo-voice punctuation, or accent instructions in generated responses.",
  openai_voice_style_hint:
    "Generate clean, calm, instructional response text suitable for spoken delivery by the voice layer.",
  openai_center_visual_url: "assets/images/cognition_p2.png",
  contact_page_auto_greeting_text: "Hello — I'm Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand?",
  openai_auto_greeting_enabled: true,
  // Leave blank so renderer uses page-aware welcome wording per active site board.
  openai_auto_greeting_text: "Hello — I'm Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand?",
  openai_delayed_followup_enabled: true,
  openai_delayed_followup_seconds: 4,
  openai_delayed_followup_text: "What brought you to Cognition Partner, and what would you most like to understand today?",
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
  embed_url: './assets/cognition/curl/hume_renderer/',
  // Small avatar image used for header/presence chip.
  character_avatar_url: "",
  // Signal-stage portrait (must stay transparent Clerk asset).
  signal_portrait_url: "",
  // Primary background visual for Speak-with-Curl modal.
  character_background_url: "assets/images/cognition_p2.png",

  // Legacy placeholders retained for backward compatibility with the widget config schema.
  config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
  // Optional config version lock.
  config_version: 0,
  // Voice target used by OpenAI realtime.
  voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
  // Phase 2 character registry (routing + metadata). Existing global fields remain fallback defaults.
  characters: {
    
    "curl-maxwell": {
      label: "Curl",
      character_name: "Curl Maxwell",
      character_avatar_url: "",
      character_background_url: "assets/images/cognition_p2.png",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
      session_variables: {
        character_name: "Curl Maxwell",
        character_role: "Public Cognition Host for Cognition Partner",
        full_formal_identity: "Ms. Curl Maxwell, Cognition Host for Cognition Partner",
      },
    },
    "curl-charcot": {
      label: "Curl",
      character_name: "Curl Maxwell",
      character_avatar_url: "",
      character_background_url: "assets/images/cognition_p2.png",
      config_id: "242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf",
      voice_id: "23982fd1-d6a5-4acc-b396-2454b5715d43",
      session_variables: {
        character_name: "Curl Maxwell",
        character_role: "Public Cognition Host for Cognition Partner",
        full_formal_identity: "Ms. Curl Maxwell, Cognition Host for Cognition Partner",
      },
    },
    "unity-faraday": {
      label: "Unity Faraday",
      character_name: "Unity Faraday",
      character_avatar_url: "assets/images/ClerkMaxwell_60423t.png",
      character_background_url: "JamesClerkMaxwell.gif",
      config_id: "",
      voice_id: "shimmer",
      session_variables: {
        character_name: "Unity Faraday",
        character_role: "Founder Companion at Unity Energy",
      },
    },
    "cove-faraday": {
      label: "Cove Faraday",
      character_name: "Cove Faraday",
      character_avatar_url: "assets/images/ClerkMaxwell_60423t.png",
      character_background_url: "JamesClerkMaxwell.gif",
      config_id: "",
      voice_id: "sage",
      session_variables: {
        character_name: "Cove Faraday",
        character_role: "Field Strategist at Unity Energy",
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
  session_context: "PAGE-AWARE when context is provided. Complete CURL BOOT SEQUENCE silently before first reply. Absorb CURL JOURNEY PAGES 1-13 so you know what each page says. You are Curl Maxwell, Cognition Host for Cognition Partner. Human is the traveler. Prefer short opening, then listen. Do not speak as Diva, Claire, Clerk, or Cove. Use injected knowledge packs as authority.",

  // Optional one-off prompt override for this session launch.
  // Leave blank to use the prompt defined in your EVI config.
  system_prompt_text: "You are Curl Maxwell, public Cognition Host for Cognition Partner. Govern behavior with CURL OPERATING CANON. Human is the traveler. Warm, curious, concise, intelligent. Not an FAQ bot. Not Diva/Claire/Clerk/Cove. Canon vs demonstration vs aspiration. No undeployed claims from artwork. Handoff Kuranda experience to Claire and Unity team demo to Clerk without impersonation.",

  // Optional dynamic variables for your EVI prompt placeholders ({{variable_name}}).
  // Use these to inject Clerk's role/persona at runtime.
  session_variables: {
    character_name: "Curl",
    character_role: "Public Cognition Host for Cognition Partner",
    full_formal_identity: "Ms. Curl Maxwell, Cognition Host for Cognition Partner",
    character_style: "Warm, curious, intelligent, concise, thoughtful. Speech-ready plain language. No theatrical markup. No unsupported medical or product claims.",
    opening_line: "Hello — I'm Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand?",
    identity_line: "I'm Curl Maxwell, Cognition Host for Cognition Partner.",
    name_request_line: "If you'd like, share just your first name so I know how to address you — optional.",
    engagement_order: "Short calm greeting first, then listen. Depth only as invited. Never lead with clinical titles or other Host biographies.",
    mpts_core_definition: "Not Curl's primary domain. Stay with Cognition Partner unless the visitor compares architectures.",
  },
};
