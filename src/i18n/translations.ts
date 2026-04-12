// ─── Translation Dictionary ────────────────────────────────────────────────────
// Tips & Steps Admin Panel — Arabic / English
// All UI strings are here. Components import `useT()` and look up a key.

export type Lang = "en" | "ar";

export const translations = {
  // ─── Common ────────────────────────────────────────────────────────────────
  search: { en: "Search...", ar: "بحث..." },
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  delete: { en: "Delete", ar: "حذف" },
  edit: { en: "Edit", ar: "تعديل" },
  add: { en: "Add", ar: "إضافة" },
  create: { en: "Create", ar: "إنشاء" },
  back: { en: "Back", ar: "رجوع" },
  next: { en: "Next", ar: "التالي" },
  yes: { en: "Yes", ar: "نعم" },
  no: { en: "No", ar: "لا" },
  status: { en: "Status", ar: "الحالة" },
  actions: { en: "Actions", ar: "إجراءات" },
  name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  role: { en: "Role", ar: "الدور" },
  date: { en: "Date", ar: "التاريخ" },
  all: { en: "All", ar: "الكل" },
  loading: { en: "Loading...", ar: "جار التحميل..." },
  noResults: { en: "No results found", ar: "لا توجد نتائج" },
  export: { en: "Export", ar: "تصدير" },
  filter: { en: "Filter", ar: "تصفية" },
  view: { en: "View", ar: "عرض" },
  close: { en: "Close", ar: "إغلاق" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  updated: { en: "Updated", ar: "تم التحديث" },
  created: { en: "Created", ar: "تم الإنشاء" },
  deleted: { en: "Deleted", ar: "تم الحذف" },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav_dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  nav_users: { en: "Users", ar: "المستخدمون" },
  nav_questions: { en: "Questions", ar: "الأسئلة" },
  nav_growthMatrix: { en: "Growth Matrix", ar: "مصفوفة النمو" },
  nav_content: { en: "Content", ar: "المحتوى" },
  nav_analytics: { en: "Analytics", ar: "التحليلات" },
  nav_doctors: { en: "Doctors", ar: "الأطباء" },
  nav_marketing: { en: "Marketing", ar: "التسويق" },
  nav_itSupport: { en: "IT Support", ar: "الدعم التقني" },
  nav_auditLogs: { en: "Audit Logs", ar: "سجلات المراجعة" },
  nav_support: { en: "Support", ar: "الدعم" },
  nav_settings: { en: "Settings", ar: "الإعدادات" },
  nav_main: { en: "Main", ar: "الرئيسية" },
  nav_management: { en: "Management", ar: "الإدارة" },
  nav_system: { en: "System", ar: "النظام" },

  // ─── Header ─────────────────────────────────────────────────────────────────
  header_search: { en: "Search...", ar: "بحث في النظام..." },
  header_notifications: { en: "Notifications", ar: "الإشعارات" },
  header_superAdmin: { en: "Super Admin", ar: "المدير العام" },
  language_toggle: { en: "عربي", ar: "English" },

  // ─── Dashboard ──────────────────────────────────────────────────────────────
  dashboard_title: { en: "Dashboard", ar: "لوحة التحكم" },
  dashboard_welcome: { en: "Welcome back! Here's what's happening with Tips & Steps.", ar: "مرحباً بعودتك! إليك آخر مستجدات Tips & Steps." },
  dashboard_totalUsers: { en: "Total Users", ar: "إجمالي المستخدمين" },
  dashboard_activeToday: { en: "Active Today", ar: "نشطون اليوم" },
  dashboard_publishedContent: { en: "Published Content", ar: "المحتوى المنشور" },
  dashboard_pageViews: { en: "Page Views", ar: "مشاهدات الصفحة" },
  dashboard_userGrowth: { en: "User Growth", ar: "نمو المستخدمين" },
  dashboard_contentDist: { en: "Content Distribution", ar: "توزيع المحتوى" },
  dashboard_weeklyActivity: { en: "Weekly Activity", ar: "النشاط الأسبوعي" },
  dashboard_recentActivity: { en: "Recent Activity", ar: "النشاط الأخير" },

  // ─── Users ──────────────────────────────────────────────────────────────────
  users_title: { en: "User Management", ar: "إدارة المستخدمين" },
  users_subtitle: { en: "Manage all registered app users.", ar: "إدارة جميع مستخدمي التطبيق المسجلين." },
  users_addUser: { en: "Add User", ar: "إضافة مستخدم" },
  users_totalUsers: { en: "Total Users", ar: "إجمالي المستخدمين" },
  users_activeUsers: { en: "Active Users", ar: "المستخدمون النشطون" },
  users_suspended: { en: "Suspended", ar: "موقوفون" },
  users_newThisMonth: { en: "New This Month", ar: "الجدد هذا الشهر" },
  users_searchPlaceholder: { en: "Search users...", ar: "البحث عن مستخدم..." },
  users_allRoles: { en: "All Roles", ar: "جميع الأدوار" },
  users_allStatuses: { en: "All Statuses", ar: "جميع الحالات" },
  users_active: { en: "Active", ar: "نشط" },
  users_inactive: { en: "Inactive", ar: "غير نشط" },
  users_joinDate: { en: "Join Date", ar: "تاريخ الانضمام" },
  users_lastActive: { en: "Last Active", ar: "آخر نشاط" },

  // ─── Content Management ──────────────────────────────────────────────────────
  cms_title: { en: "Content Management", ar: "إدارة المحتوى" },
  cms_subtitle: { en: "8 sections powering the mobile app", ar: "٨ أقسام تغذي التطبيق المحمول" },
  cms_totalContent: { en: "Total Content", ar: "إجمالي المحتوى" },
  cms_published: { en: "Published", ar: "منشور" },
  cms_inReview: { en: "In Review", ar: "قيد المراجعة" },
  cms_drafts: { en: "Drafts", ar: "المسودات" },
  cms_approved: { en: "Approved", ar: "معتمد" },
  cms_archived: { en: "Archived", ar: "مؤرشف" },
  cms_addContent: { en: "Add Content", ar: "إضافة محتوى" },
  cms_exportJson: { en: "Export JSON", ar: "تصدير JSON" },
  cms_searchPlaceholder: { en: "Search in Arabic or English...", ar: "ابحث بالعربية أو الإنجليزية..." },
  cms_manageSection: { en: "Manage Section", ar: "إدارة القسم" },
  cms_noContent: { en: "No content found", ar: "لا يوجد محتوى" },
  cms_noContentHint: { en: "Try adjusting filters or add new content", ar: "جرب تغيير التصفية أو أضف محتوى جديداً" },
  cms_requiresApproval: { en: "Approval Required", ar: "يلزم الموافقة" },
  cms_doctorApproval: { en: "Doctor must approve before publishing", ar: "يجب أن يوافق الطبيب قبل النشر" },
  cms_adminApproval: { en: "Admin must approve before publishing", ar: "يجب أن يوافق المدير قبل النشر" },
  cms_moveToReview: { en: "Move to Review", ar: "إرسال للمراجعة" },
  cms_moveToApproved: { en: "Approve", ar: "اعتماد" },
  cms_moveToPublished: { en: "Publish", ar: "نشر" },

  // ─── Growth Matrix ────────────────────────────────────────────────────────────
  matrix_title: { en: "Growth Matrix", ar: "مصفوفة النمو" },
  matrix_subtitle: { en: "Configure the child development evaluation engine", ar: "ضبط محرك تقييم نمو الطفل" },
  matrix_overview: { en: "Overview", ar: "نظرة عامة" },
  matrix_ageGroups: { en: "Age Groups", ar: "الفئات العمرية" },
  matrix_categories: { en: "Categories", ar: "الفئات" },
  matrix_skills: { en: "Skills", ar: "المهارات" },
  matrix_rulesEditor: { en: "Rules Editor", ar: "محرر القواعد" },
  matrix_scoringPreview: { en: "Scoring Preview", ar: "معاينة التقييم" },
  matrix_addSkill: { en: "Add Skill", ar: "إضافة مهارة" },
  matrix_addAgeGroup: { en: "Add Age Group", ar: "إضافة فئة عمرية" },
  matrix_addCategory: { en: "Add Category", ar: "إضافة فئة" },

  // ─── Analytics ────────────────────────────────────────────────────────────────
  analytics_title: { en: "Analytics", ar: "التحليلات" },
  analytics_subtitle: { en: "Monitor app performance and user engagement.", ar: "راقب أداء التطبيق وتفاعل المستخدمين." },

  // ─── Audit Logs ───────────────────────────────────────────────────────────────
  auditLogs_title: { en: "Audit Logs", ar: "سجلات المراجعة" },
  auditLogs_subtitle: { en: "Complete record of all admin actions.", ar: "سجل كامل لجميع إجراءات المدير." },
  auditLogs_searchPlaceholder: { en: "Search logs...", ar: "البحث في السجلات..." },
  auditLogs_allModules: { en: "All Modules", ar: "جميع الوحدات" },
  auditLogs_allActions: { en: "All Actions", ar: "جميع الإجراءات" },

  // ─── Settings ─────────────────────────────────────────────────────────────────
  settings_title: { en: "Settings", ar: "الإعدادات" },
  settings_subtitle: { en: "System configuration and preferences.", ar: "إعدادات النظام والتفضيلات." },
  settings_language: { en: "Language", ar: "اللغة" },
  settings_languageDesc: { en: "Choose the admin panel display language", ar: "اختر لغة عرض لوحة التحكم" },
  settings_arabic: { en: "Arabic (عربي)", ar: "العربية (Arabic)" },
  settings_english: { en: "English", ar: "الإنجليزية" },

  // ─── Questions ─────────────────────────────────────────────────────────────
  questions_title: { en: "Questions", ar: "الأسئلة" },
  questions_subtitle: { en: "Manage frequently asked questions for the app.", ar: "إدارة الأسئلة الشائعة للتطبيق." },
  questions_addQuestion: { en: "Add Question", ar: "إضافة سؤال" },

  // ─── Login ────────────────────────────────────────────────────────────────
  login_title: { en: "Admin Login", ar: "تسجيل دخول المدير" },
  login_subtitle: { en: "Sign in to access the admin panel", ar: "سجّل الدخول للوصول إلى لوحة التحكم" },
  login_email: { en: "Email", ar: "البريد الإلكتروني" },
  login_password: { en: "Password", ar: "كلمة المرور" },
  login_signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  login_signingIn: { en: "Signing in...", ar: "جار تسجيل الدخول..." },

  // ─── Roles & Permissions ─────────────────────────────────────────────────
  roles_title: { en: "Roles & Permissions", ar: "الأدوار والصلاحيات" },
  roles_subtitle: { en: "Manage access control and role assignments.", ar: "إدارة التحكم في الوصول وتعيين الأدوار." },
} as const;

export type TranslationKey = keyof typeof translations;
