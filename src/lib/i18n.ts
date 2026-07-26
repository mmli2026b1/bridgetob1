// ─── Types ──────────────────────────────────────────────────────────

export type Language = "en" | "ar";

// ─── Translation Dictionary ────────────────────────────────────────

const translations: Record<string, Record<Language, string>> = {
  // ─── Header ───────────────────────────────────────────────────────
  "header.logo": {
    en: "Success Bridge",
    ar: "جسر النجاح",
  },
  "header.home": {
    en: "Home",
    ar: "الرئيسية",
  },
  "header.topics": {
    en: "Topics",
    ar: "المواضيع",
  },
  "header.aiTutor": {
    en: "AI Tutor",
    ar: "المعلم الذكي",
  },
  "header.account": {
    en: "Account",
    ar: "الحساب",
  },
  "header.signOut": {
    en: "Sign Out",
    ar: "تسجيل الخروج",
  },
  "header.signIn": {
    en: "Sign In",
    ar: "تسجيل الدخول",
  },
  "header.getStarted": {
    en: "Get Started",
    ar: "ابدأ الآن",
  },

  // ─── Hero ─────────────────────────────────────────────────────────
  "hero.badge": {
    en: "B1 Speaking & Citizenship Exam Prep",
    ar: "تحضير اختبار B1 للمحادثة والجنسية البريطانية",
  },
  "hero.title1": {
    en: "Your Bridge to",
    ar: "جسرك نحو",
  },
  "hero.title2": {
    en: "Exam Success",
    ar: "النجاح في الامتحان",
  },
  "hero.subtitle": {
    en: "Master your B1 Speaking exam with structured topics, model answers, key vocabulary, and an AI tutor that gives you real-time feedback.",
    ar: "أتقن اختبار المحادثة B1 مع مواضيع منظمة، إجابات نموذجية، مفردات أساسية، ومعلم ذكي يقدم لك ملاحظات فورية.",
  },
  "hero.tryFree": {
    en: "Try Free Preview",
    ar: "جرب المعاينة المجانية",
  },
  "hero.getFullAccess": {
    en: "Get Full Access",
    ar: "احصل على الوصول الكامل",
  },

  // ─── Audio Section ────────────────────────────────────────────────
  "audio.title": {
    en: "Listen to Real Exam Practice",
    ar: "اسرار اجتياز اختبار للجنسية البرطانية",
  },
  "audio.subtitle": {
    en: "Hear model answers and pronunciation guidance — free for everyone",
    ar: "استمع إلى إجابات نموذجية وتوجيهات النطق — مجاناً للجميع",
  },
  "audio.caption": {
    en: "Sample audio — practice listening and repeating to improve your pronunciation",
    ar: "نموذج صوتي — تدرب على الاستماع والتكرار لتحسين نطقك",
  },

  // ─── Ebook Section ────────────────────────────────────────────────
  "ebook.title": {
    en: "Get the Complete Ebook",
    ar: "احصل على الكتاب الإلكتروني الكامل",
  },
  "ebook.description": {
    en: "The full Success Bridge B1 Speaking & Citizenship exam prep guide as a downloadable ebook. Includes all 12 topics, grammar chapter, rescue sentences, and test-day tips — everything you need to pass with confidence.",
    ar: "دليل تحضير اختبار B1 للمحادثة والجنسية البريطانية الكامل من جسر النجاح ككتاب إلكتروني قابل للتحميل. يشمل جميع المواضيع الـ12، فصل القواعد، جمل الإنقاذ، ونصائح يوم الاختبار — كل ما تحتاجه لاجتياز الامتحان بثقة.",
  },
  "ebook.feature1": {
    en: "12 exam topics with full vocabulary and model answers",
    ar: "12 موضوعاً للامتحان مع مفردات كاملة وإجابات نموذجية",
  },
  "ebook.feature2": {
    en: "Grammar chapter with key B1 structures",
    ar: "فصل القواعد مع الهياكل الأساسية للمستوى B1",
  },
  "ebook.feature3": {
    en: "Rescue sentences for when you get stuck",
    ar: "جمل إنقاذ عندما تتوقف عن الكلام",
  },
  "ebook.feature4": {
    en: "Test-day tips and strategies",
    ar: "نصائح واستراتيجيات يوم الاختبار",
  },
  "ebook.feature5": {
    en: "Downloadable .docx format — study anywhere",
    ar: "صيغة .docx قابلة للتحميل — ادرس في أي مكان",
  },
  "ebook.oneTimeTitle": {
    en: "One-Time Purchase",
    ar: "شراء لمرة واحدة",
  },
  "ebook.oneTimeDesc": {
    en: "Buy once, download forever. No subscription needed.",
    ar: "اشترِ مرة، حمل للأبد. لا حاجة للاشتراك.",
  },
  "ebook.buyCta": {
    en: "Buy the Ebook — £9.99",
    ar: "اشتر الكتاب — £9.99",
  },
  "ebook.signupNote": {
    en: "Sign up first, then purchase. Instant download after payment.",
    ar: "سجل أولاً، ثم اشتر. تحميل فوري بعد الدفع.",
  },

  // ─── Features Section ─────────────────────────────────────────────
  "features.title": {
    en: "Everything You Need to Pass",
    ar: "كل ما تحتاجه لاجتياز الامتحان",
  },
  "features.12Topics": {
    en: "12 Exam Topics",
    ar: "12 موضوعاً للامتحان",
  },
  "features.12TopicsDesc": {
    en: "Full vocabulary lists, model Q&As, and useful phrases for every common B1 topic.",
    ar: "قوائم مفردات كاملة، أسئلة وأجوبة نموذجية، وعبارات مفيدة لكل موضوع شائع في B1.",
  },
  "features.aiTutor": {
    en: "AI Tutor Coach",
    ar: "المعلم الذكي",
  },
  "features.aiTutorDesc": {
    en: "Practice with Claude-powered AI that gives encouraging, structured feedback on every answer.",
    ar: "تدرب مع الذكاء الاصطناعي المدعوم من كلود الذي يقدم ملاحظات مشجعة ومنظمة على كل إجابة.",
  },
  "features.grammar": {
    en: "Grammar & Tips",
    ar: "القواعد والنصائح",
  },
  "features.grammarDesc": {
    en: "Key grammar points, rescue sentences for when you get stuck, and test-day strategies.",
    ar: "نقاط قواعد رئيسية، جمل إنقاذ عندما تتوقف، واستراتيجيات يوم الاختبار.",
  },
  "features.modelAnswers": {
    en: "Model Answers",
    ar: "إجابات نموذجية",
  },
  "features.modelAnswersDesc": {
    en: "See high-scoring example answers so you know exactly what the examiner wants.",
    ar: "شاهد إجابات نموذجية عالية الدرجات لتعرف بالضبط ما يريده الممتحن.",
  },
  "features.audio": {
    en: "Audio Practice",
    ar: "تدريب صوتي",
  },
  "features.audioDesc": {
    en: "Listen to model answers and practice your pronunciation with real audio samples.",
    ar: "استمع إلى إجابات نموذجية وتدرب على نطقك مع عينات صوتية حقيقية.",
  },
  "features.ebook": {
    en: "Downloadable Ebook",
    ar: "كتاب إلكتروني قابل للتحميل",
  },
  "features.ebookDesc": {
    en: "Get the complete Success Bridge ebook — study offline, anytime, anywhere.",
    ar: "احصل على كتاب جسر النجاح الإلكتروني الكامل — ادرس بدون إنترنت، في أي وقت، في أي مكان.",
  },

  // ─── Free Preview Section ─────────────────────────────────────────
  "freePreview.title": {
    en: "Try It Free — No Signup Needed",
    ar: "جربه مجاناً — لا حاجة للتسجيل",
  },
  "freePreview.subtitle": {
    en: "Get started with the Family topic, completely free.",
    ar: "ابدأ بموضوع العائلة، مجاناً تماماً.",
  },

  // ─── Premium Library Section ──────────────────────────────────────
  "premium.title": {
    en: "Full Premium Library",
    ar: "المكتبة الممتازة الكاملة",
  },
  "premium.subtitle": {
    en: "Unlock all topics, grammar, rescue sentences, test-day tips, and the AI tutor.",
    ar: "افتح جميع المواضيع، القواعد، جمل الإنقاذ، نصائح يوم الاختبار، والمعلم الذكي.",
  },
  "premium.cta": {
    en: "Get Full Access — £9.99/month",
    ar: "احصل على الوصول الكامل — £9.99/شهر",
  },

  // ─── Topic Card ───────────────────────────────────────────────────
  "topicCard.free": {
    en: "Free",
    ar: "مجاني",
  },
  "topicCard.premium": {
    en: "Premium",
    ar: "ممتاز",
  },
  "topicCard.unlocked": {
    en: "Unlocked",
    ar: "مفتوح",
  },
  "topicCard.upgradeToUnlock": {
    en: "Upgrade to Unlock",
    ar: "ترقية للفتح",
  },
  "topicCard.words": {
    en: "words",
    ar: "كلمة",
  },
  "topicCard.qas": {
    en: "Q&As",
    ar: "أسئلة وأجوبة",
  },
  "topicCard.phrases": {
    en: "phrases",
    ar: "عبارة",
  },

  // ─── Topic Page ───────────────────────────────────────────────────
  "topic.keyQuestions": {
    en: "Key Questions to Expect",
    ar: "الأسئلة الرئيسية المتوقعة",
  },
  "topic.keyVocabulary": {
    en: "Key Vocabulary",
    ar: "المفردات الأساسية",
  },
  "topic.modelQas": {
    en: "Model Questions & Answers",
    ar: "أسئلة وأجوبة نموذجية",
  },
  "topic.usefulPhrases": {
    en: "Useful Phrases",
    ar: "عبارات مفيدة",
  },
  "topic.tips": {
    en: "Tips",
    ar: "نصائح",
  },
  "topic.backToHome": {
    en: "Back to Home",
    ar: "العودة للرئيسية",
  },

  // ─── Payment Gate ─────────────────────────────────────────────────
  "payment.premiumContent": {
    en: "Premium Content",
    ar: "محتوى ممتاز",
  },
  "payment.description": {
    en: 'Unlock "{{topic}}" and all other topics, grammar resources, test-day tips, rescue sentences, and the AI tutor chat with a Premium membership.',
    ar: 'افتح "{{topic}}" وجميع المواضيع الأخرى، موارد القواعد، نصائح يوم الاختبار، جمل الإنقاذ، ومحادثة المعلم الذكي باشتراك ممتاز.',
  },
  "payment.feature1": {
    en: "12+ exam topics with full vocabulary & model answers",
    ar: "12+ موضوعاً للامتحان مع مفردات كاملة وإجابات نموذجية",
  },
  "payment.feature2": {
    en: "Grammar chapter, rescue sentences & test-day tips",
    ar: "فصل القواعد، جمل الإنقاذ، ونصائح يوم الاختبار",
  },
  "payment.feature3": {
    en: "AI tutor chat — practice anytime with personalized feedback",
    ar: "محادثة المعلم الذكي — تدرب في أي وقت مع ملاحظات مخصصة",
  },
  "payment.cta": {
    en: "Unlock Full Access — £9.99/month",
    ar: "افتح الوصول الكامل — £9.99/شهر",
  },
  "payment.footer": {
    en: "Cancel anytime. Secure payment via Stripe.",
    ar: "ألغِ في أي وقت. دفع آمن عبر Stripe.",
  },
  "payment.redirecting": {
    en: "Redirecting…",
    ar: "جارٍ إعادة التوجيه…",
  },

  // ─── Auth Pages ──────────────────────────────────────────────────
  "auth.signInTitle": {
    en: "Welcome Back",
    ar: "مرحباً بعودتك",
  },
  "auth.signInSubtitle": {
    en: "Sign in to your account",
    ar: "سجل الدخول إلى حسابك",
  },
  "auth.signInButton": {
    en: "Sign In",
    ar: "تسجيل الدخول",
  },
  "auth.signingIn": {
    en: "Signing in…",
    ar: "جارٍ تسجيل الدخول…",
  },
  "auth.noAccount": {
    en: "Don't have an account?",
    ar: "ليس لديك حساب؟",
  },
  "auth.signUpLink": {
    en: "Sign up",
    ar: "سجل الآن",
  },
  "auth.signUpTitle": {
    en: "Create Account",
    ar: "إنشاء حساب",
  },
  "auth.signUpSubtitle": {
    en: "Start your journey to exam success",
    ar: "ابدأ رحلتك نحو النجاح في الامتحان",
  },
  "auth.createAccount": {
    en: "Create Account",
    ar: "إنشاء حساب",
  },
  "auth.creatingAccount": {
    en: "Creating account…",
    ar: "جارٍ إنشاء الحساب…",
  },
  "auth.haveAccount": {
    en: "Already have an account?",
    ar: "هل لديك حساب بالفعل؟",
  },
  "auth.signInLink": {
    en: "Sign in",
    ar: "تسجيل الدخول",
  },
  "auth.email": {
    en: "Email",
    ar: "البريد الإلكتروني",
  },
  "auth.password": {
    en: "Password",
    ar: "كلمة المرور",
  },
  "auth.orContinueWith": {
    en: "or continue with",
    ar: "أو تابع باستخدام",
  },
  "auth.google": {
    en: "Google",
    ar: "جوجل",
  },
  "auth.emailPlaceholder": {
    en: "you@example.com",
    ar: "you@example.com",
  },
  "auth.passwordPlaceholder": {
    en: "At least 6 characters",
    ar: "6 أحرف على الأقل",
  },
  "auth.signupSuccess": {
    en: "Account created! Check your email for a confirmation link, or try signing in.",
    ar: "تم إنشاء الحساب! تحقق من بريدك الإلكتروني للحصول على رابط التأكيد، أو حاول تسجيل الدخول.",
  },
  "auth.signinSuccess": {
    en: "Signed in successfully!",
    ar: "تم تسجيل الدخول بنجاح!",
  },
  "auth.passwordLengthError": {
    en: "Password must be at least 6 characters.",
    ar: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
  },

  // ─── Account Page ────────────────────────────────────────────────
  "account.title": {
    en: "Your Account",
    ar: "حسابك",
  },
  "account.profile": {
    en: "Profile",
    ar: "الملف الشخصي",
  },
  "account.membership": {
    en: "Membership",
    ar: "العضوية",
  },
  "account.premiumActive": {
    en: "Premium Active",
    ar: "ممتاز نشط",
  },
  "account.cancelled": {
    en: "Cancelled",
    ar: "ملغي",
  },
  "account.free": {
    en: "Free",
    ar: "مجاني",
  },
  "account.premiumActiveDesc": {
    en: "✅ You have full access to all premium content and the AI tutor chat.",
    ar: "✅ لديك وصول كامل إلى جميع المحتويات الممتازة ومحادثة المعلم الذكي.",
  },
  "account.manageSubscription": {
    en: "Manage Subscription (Cancel / Update Payment)",
    ar: "إدارة الاشتراك (إلغاء / تحديث الدفع)",
  },
  "account.freePlanDesc": {
    en: "You are on the Free plan. Upgrade to unlock all topics, grammar resources, rescue sentences, test-day tips, and the AI tutor chat.",
    ar: "أنت على الخطة المجانية. قم بالترقية لفتح جميع المواضيع، موارد القواعد، جمل الإنقاذ، نصائح يوم الاختبار، ومحادثة المعلم الذكي.",
  },
  "account.upgradeCta": {
    en: "Upgrade to Premium — £9.99/month",
    ar: "ترقية إلى الممتاز — £9.99/شهر",
  },
  "account.ebookTitle": {
    en: "Success Bridge Ebook",
    ar: "كتاب جسر النجاح الإلكتروني",
  },
  "account.ebookPurchased": {
    en: "Purchased",
    ar: "تم الشراء",
  },
  "account.ebookNotPurchased": {
    en: "Not Purchased",
    ar: "لم يتم الشراء",
  },
  "account.ebookOwned": {
    en: "✅ You own the ebook! Click below to download your copy.",
    ar: "✅ أنت تملك الكتاب! اضغط أدناه لتحميل نسختك.",
  },
  "account.downloadEbook": {
    en: "Download Ebook",
    ar: "تحميل الكتاب الإلكتروني",
  },
  "account.ebookDesc": {
    en: "Get the complete Success Bridge B1 exam prep ebook — all 12 topics, grammar, rescue sentences, and test-day tips in one downloadable .docx file.",
    ar: "احصل على كتاب جسر النجاح الإلكتروني الكامل للتحضير لامتحان B1 — جميع المواضيع الـ12، القواعد، جمل الإنقاذ، ونصائح يوم الاختبار في ملف .docx واحد قابل للتحميل.",
  },
  "account.buyEbook": {
    en: "Buy Ebook — £9.99",
    ar: "اشتر الكتاب — £9.99",
  },
  "account.processing": {
    en: "Processing…",
    ar: "جارٍ المعالجة…",
  },
  "account.loading": {
    en: "Loading…",
    ar: "جارٍ التحميل…",
  },
  "account.quickLinks": {
    en: "Quick Links",
    ar: "روابط سريعة",
  },
  "account.browseTopics": {
    en: "Browse Topics",
    ar: "تصفح المواضيع",
  },
  "account.aiTutorChat": {
    en: "AI Tutor Chat",
    ar: "محادثة المعلم الذكي",
  },
  "account.downloadStarted": {
    en: "Download started!",
    ar: "بدأ التحميل!",
  },
  "account.error": {
    en: "Something went wrong.",
    ar: "حدث خطأ ما.",
  },

  // ─── Chat Page ──────────────────────────────────────────────────
  "chat.signInTitle": {
    en: "Sign In to Access AI Tutor",
    ar: "سجل الدخول للوصول إلى المعلم الذكي",
  },
  "chat.signInDesc": {
    en: "Create a free account to get started, then upgrade to unlock the AI tutor chat.",
    ar: "أنشئ حساباً مجانياً للبدء، ثم قم بالترقية لفتح محادثة المعلم الذكي.",
  },
  "chat.signInButton": {
    en: "Sign In",
    ar: "تسجيل الدخول",
  },
  "chat.premiumTitle": {
    en: "Premium Feature",
    ar: "ميزة ممتازة",
  },
  "chat.premiumDesc": {
    en: "The AI tutor chat is a premium feature. Upgrade to get personalized speaking practice with instant feedback.",
    ar: "محادثة المعلم الذكي هي ميزة ممتازة. قم بالترقية للحصول على تدريب محادثة مخصص مع ملاحظات فورية.",
  },
  "chat.upgradeButton": {
    en: "Upgrade to Premium",
    ar: "ترقية إلى الممتاز",
  },
  "chat.pageTitle": {
    en: "AI Tutor Chat",
    ar: "محادثة المعلم الذكي",
  },
  "chat.pageSubtitle": {
    en: "Practice your speaking with Claude — get a question, answer it, and receive encouraging feedback.",
    ar: "تدرب على المحادثة مع كلود — احصل على سؤال، أجب عليه، وتلقى ملاحظات مشجعة.",
  },

  // ─── Chat UI ──────────────────────────────────────────────────────
  "chatui.selectTopic": {
    en: "Select Topic",
    ar: "اختر موضوعاً",
  },
  "chatui.newSession": {
    en: "New Session",
    ar: "جلسة جديدة",
  },
  "chatui.messagesRemaining": {
    en: "messages remaining today",
    ar: "رسالة متبقية اليوم",
  },
  "chatui.practicing": {
    en: "Practicing:",
    ar: "التدرب على:",
  },
  "chatui.placeholder": {
    en: "Type your answer or ask a question…",
    ar: "اكتب إجابتك أو اسأل سؤالاً…",
  },
  "chatui.thinking": {
    en: "Thinking…",
    ar: "يفكر…",
  },
  "chatui.emptyState": {
    en: 'Select a topic and send a message, or click "New Session" to get a practice question.',
    ar: 'اختر موضوعاً وأرسل رسالة، أو اضغط "جلسة جديدة" للحصول على سؤال تدريبي.',
  },
  "chatui.error": {
    en: "Sorry, something went wrong. Please try again.",
    ar: "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },

  // ─── Footer ──────────────────────────────────────────────────────
  "footer.copyright": {
    en: "Success Bridge. All rights reserved.",
    ar: "جسر النجاح. جميع الحقوق محفوظة.",
  },

  // ─── Language Toggle ─────────────────────────────────────────────
  "language.switchToArabic": {
    en: "العربية",
    ar: "English",
  },
  "language.switchLabel": {
    en: "Language",
    ar: "اللغة",
  },
};

// ─── Hook ──────────────────────────────────────────────────────────

export function t(key: string, lang: Language, vars?: Record<string, string>): string {
  const entry = translations[key];
  if (!entry) return key;

  let text = entry[lang] ?? entry["en"] ?? key;

  // Replace variables like {{topic}} with values
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
    }
  }

  return text;
}

export default translations;
