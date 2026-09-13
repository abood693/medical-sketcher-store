# إعداد حساب المالك وتشغيل رفع الكتب

## لماذا تسجيل الدخول لا يعمل الآن؟

المشروع لا يحتوي رمز مالك ثابتًا داخل الكود، وهذا مقصود لأسباب أمنية. تسجيل الدخول المحلي في `/admin` يعتمد على متغيرين سريين في بيئة التشغيل:

```bash
ADMIN_USERNAME=اسم_المالك
ADMIN_PASSWORD_HASH=hash_مولد_من_كلمة_المرور
```

في بيئة الفحص الحالية، كلا المتغيرين غير موجودين، لذلك يعيد الخادم رسالة `Owner login is not configured` بدل السماح بتسجيل دخول غير آمن.

## إنشاء بيانات المالك

من داخل مجلد المشروع شغّل:

```bash
pnpm admin:hash
```

أدخل كلمة مرور طويلة لا تقل عن 12 حرفًا. انسخ السطر الناتج إلى مدير الأسرار في منصة الاستضافة:

```bash
ADMIN_PASSWORD_HASH=salt:hash
```

ثم أضف اسم المستخدم الذي اخترته:

```bash
ADMIN_USERNAME=your_owner_username
```

لا تضع كلمة المرور أو قيمة الهاش في GitHub أو داخل ملف `.env` المرفوع للمستودع. بعد حفظ الأسرار أعد تشغيل الخادم، ثم افتح `/admin`.

## المتغيرات الضرورية

بالإضافة إلى بيانات المالك، يلزم تشغيل قاعدة البيانات والجلسات:

```bash
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
JWT_SECRET=long_random_secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=your_manus_app_id
OWNER_OPEN_ID=owner_open_id_from_manus_oauth
```

ولرفع الكتب يجب إعداد أحد الخيارين:

```bash
# الخيار الموصى به خارج Manus
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server_side_key
SUPABASE_STORAGE_BUCKET=products
```

أو إعداد التخزين المدمج:

```bash
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=server_side_key
```

## ما تم إصلاحه

- إصلاح استيراد `node:crypto` في `server/storage.ts`؛ كان `crypto.randomUUID()` يسبب فشل رفع الملف.
- التحقق من أن الملف PDF حقيقي وألا يتجاوز 100 MB.
- مدير الكتب يعرض حالة الرفع، ويرفض النوع والحجم غير الصحيحين، ويدعم استبدال PDF عند تعديل كتاب.
- تحسين رسالة الخطأ عند غياب إعدادات المالك بدل عرض رسالة عامة.
- ضبط كوكي الجلسة ليستخدم `SameSite=None` مع HTTPS ليتوافق مع OAuth، و`Lax` محليًا عبر HTTP.
- تحديث الهوية البصرية إلى كحلي/سماوي طبي، مع بطاقات أحدث وحركة انتقالية محترمة ودعم الوضع الداكن واللغات الموجودة.

## التحقق

تم التحقق محليًا من:

- `pnpm check` — ناجح.
- `pnpm test` — 19 اختبارًا ناجحًا، واختبار واحد متروك عمدًا.
- `pnpm build` — ناجح.
- الصفحة الرئيسية — HTTP 200.
