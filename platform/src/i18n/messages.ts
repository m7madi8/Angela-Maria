import type { Locale } from '@/i18n/locales';

type Messages = {
  kicker: string;
  lede: string;
  payments: string;
  catalog: (count: number) => string;
  admin: string;
  language: string;
  english: string;
  arabic: string;
  closedTitle: string;
  closedBody: string;
  readyTitle: string;
  readyBody: string;
  signedIn: string;
  skip: string;
  signInTitle: string;
  signInBody: string;
  emailLabel: string;
  sendLink: string;
  linkSent: string;
  linkError: string;
  sendFailed: string;
  signOut: string;
  productsTitle: string;
  emptyProducts: string;
  databaseError: string;
  notSet: string;
  price: string;
  stock: string;
  category: string;
  fulfillment: string;
  modeUnknown: string;
  modeMadeToOrder: string;
  modeTracked: string;
  sourceListed: string;
  sourceUnlisted: string;
  edit: string;
  save: string;
  saving: string;
  saved: string;
  back: string;
  missingArabic: string;
  invalidPrice: string;
  invalidStock: string;
  stockHint: string;
  priceHint: string;
  unavailable: string;
  localBody: string;
  localContinue: string;
};

export const messages: Record<Locale, Messages> = {
  en: {
    kicker: 'Development foundation',
    lede: 'This is a private technical foundation. It is not the public website.',
    payments: 'Payments are not enabled. There is no checkout.',
    catalog: (count) => `The handmade catalog source lists ${count} pieces.`,
    admin: 'Administration',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    closedTitle: 'Administration is closed',
    closedBody: 'Sign-in is not configured. This page does not accept a password.',
    readyTitle: 'Handmade pieces',
    readyBody: 'Enter a price or a stock count only when you know it. Empty means not set.',
    signedIn: 'Signed in as',
    skip: 'Skip to content',
    signInTitle: 'Administration sign-in',
    signInBody: 'Enter an approved address. A one-time link will be sent there.',
    emailLabel: 'Email',
    sendLink: 'Send sign-in link',
    linkSent: 'If this address is approved, the link is on its way.',
    linkError: 'That sign-in link is no longer valid.',
    sendFailed: 'The sign-in message could not be sent.',
    signOut: 'Sign out',
    productsTitle: 'Handmade pieces',
    emptyProducts: 'No handmade pieces are in the database.',
    databaseError: 'The product list could not be loaded.',
    notSet: 'Not set',
    price: 'Price (ILS)',
    stock: 'Stock',
    category: 'Category',
    fulfillment: 'Fulfillment',
    modeUnknown: 'Not set',
    modeMadeToOrder: 'Made to order',
    modeTracked: 'Counted stock',
    sourceListed: 'Listed in the source catalog',
    sourceUnlisted: 'Not listed in the source catalog',
    edit: 'Edit',
    save: 'Save',
    saving: 'Saving',
    saved: 'Saved',
    back: 'All pieces',
    missingArabic: 'No Arabic name is stored. The English name is shown.',
    invalidPrice: 'Enter a price in shekels, such as 12.50, or leave it empty.',
    invalidStock: 'Enter a whole number of pieces, or leave stock empty.',
    stockHint: 'Empty means the count is not set. Zero means none are available.',
    priceHint: 'Empty means the price is not set. Zero is a free price, not an unknown one.',
    unavailable: 'The change could not be saved.',
    localBody: 'Email delivery is not set up. This computer can open administration for the approved address.',
    localContinue: 'Continue on this computer',
  },
  ar: {
    kicker: 'أساس تقني',
    lede: 'هذا أساس تقني خاص. ليس الموقع العام.',
    payments: 'الدفع الإلكتروني غير مفعّل. لا توجد عملية شراء.',
    catalog: (count) => `مصدر القطع اليدوية يضم ${count} قطعة.`,
    admin: 'الإدارة',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    closedTitle: 'الإدارة مغلقة',
    closedBody: 'تسجيل الدخول غير مُعد. هذه الصفحة لا تقبل كلمة مرور.',
    readyTitle: 'القطع اليدوية',
    readyBody: 'أدخلي السعر أو كمية المخزون فقط عندما تكون معروفة. الفراغ يعني أنها غير محددة.',
    signedIn: 'الدخول باسم',
    skip: 'تخطي إلى المحتوى',
    signInTitle: 'دخول الإدارة',
    signInBody: 'أدخلي عنوانًا معتمدًا. سيصلك رابط يُستخدم مرة واحدة.',
    emailLabel: 'البريد',
    sendLink: 'إرسال رابط الدخول',
    linkSent: 'إذا كان هذا العنوان معتمدًا، فالرابط في الطريق.',
    linkError: 'رابط الدخول لم يعد صالحًا.',
    sendFailed: 'تعذر إرسال رسالة الدخول.',
    signOut: 'خروج',
    productsTitle: 'القطع اليدوية',
    emptyProducts: 'لا توجد قطع يدوية في قاعدة البيانات.',
    databaseError: 'تعذر تحميل قائمة القطع.',
    notSet: 'غير محدد',
    price: 'السعر (شيكل)',
    stock: 'المخزون',
    category: 'التصنيف',
    fulfillment: 'التجهيز',
    modeUnknown: 'غير محدد',
    modeMadeToOrder: 'يُصنع عند الطلب',
    modeTracked: 'مخزون معدود',
    sourceListed: 'مدرجة في الكتالوج المصدر',
    sourceUnlisted: 'غير مدرجة في الكتالوج المصدر',
    edit: 'تعديل',
    save: 'حفظ',
    saving: 'جارٍ الحفظ',
    saved: 'تم الحفظ',
    back: 'كل القطع',
    missingArabic: 'لا يوجد اسم عربي محفوظ. يظهر الاسم الإنجليزي.',
    invalidPrice: 'أدخلي السعر بالشيكل، مثل 12.50، أو اتركيه فارغًا.',
    invalidStock: 'أدخلي عددًا صحيحًا، أو اتركي المخزون فارغًا.',
    stockHint: 'الفراغ يعني أن الكمية غير محددة. الصفر يعني أنه لا تتوفر قطع.',
    priceHint: 'الفراغ يعني أن السعر غير محدد. الصفر سعر مجاني وليس سعرًا مجهولًا.',
    unavailable: 'تعذر حفظ التغيير.',
    localBody: 'إرسال البريد غير مُعد. يمكن لهذا الجهاز فتح الإدارة للعنوان المعتمد.',
    localContinue: 'المتابعة على هذا الجهاز',
  },
};
