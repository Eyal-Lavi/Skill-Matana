# טבלת משתני סביבה - Skill Matana

רשימה מלאה של משתני סביבה (Environment Variables) המשמשים במערכת.

| Variable | Required | Default | Used In (path) | Notes |
| -------- | -------- | ------- | -------------- | ----- |
| **Database (Development)** |
| `DB_USER_LOCAL` | כן | - | `Bacekend/config/config.js:6` | שם משתמש MySQL לסביבת פיתוח |
| `DB_PASS_LOCAL` | כן | - | `Bacekend/config/config.js:7` | סיסמת MySQL לסביבת פיתוח |
| `DB_NAME_LOCAL` | כן | - | `Bacekend/config/config.js:8` | שם מסד הנתונים לסביבת פיתוח |
| `DB_HOST_LOCAL` | כן | - | `Bacekend/config/config.js:9` | כתובת שרת MySQL לסביבת פיתוח |
| **Database (Test)** |
| `DB_USER_DEV` | כן | - | `Bacekend/config/config.js:14` | שם משתמש MySQL לסביבת בדיקות |
| `DB_PASS_DEV` | כן | - | `Bacekend/config/config.js:15` | סיסמת MySQL לסביבת בדיקות |
| `DB_NAME_DEV` | כן | - | `Bacekend/config/config.js:16` | שם מסד הנתונים לסביבת בדיקות |
| `DB_HOST_DEV` | כן | - | `Bacekend/config/config.js:17` | כתובת שרת MySQL לסביבת בדיקות |
| **Database (Production)** |
| `DB_USER_PROD` | כן | - | `Bacekend/config/config.js:22` | שם משתמש MySQL לסביבת ייצור |
| `DB_PASS_PROD` | כן | - | `Bacekend/config/config.js:23` | סיסמת MySQL לסביבת ייצור |
| `DB_NAME_PROD` | כן | - | `Bacekend/config/config.js:24` | שם מסד הנתונים לסביבת ייצור |
| `DB_HOST_PROD` | כן | - | `Bacekend/config/config.js:25` | כתובת שרת MySQL לסביבת ייצור |
| **Application** |
| `NODE_ENV` | לא | `development` | `Bacekend/utils/database.js:3`, `Bacekend/app.js:42` | סביבת הרצה: development/test/production |
| `CLIENT_URL` | כן | - | `Bacekend/app.js:38`, `Bacekend/services/meetingService.js:72`, `Bacekend/services/meetingReminderService.js:35`, `Bacekend/services/authService.js:319` | כתובת URL של הלקוח (Frontend) |
| `SESSION_SECRET_KEY` | כן | - | `Bacekend/app.js:27` | מפתח סודי לחתימת cookies של סשן |
| **Email (SMTP)** |
| `SMTP_HOST` | כן | - | `Bacekend/services/emailService.js:4` | כתובת שרת SMTP |
| `SMTP_PORT` | כן | - | `Bacekend/services/emailService.js:5` | פורט שרת SMTP |
| `SMTP_USER` | כן | - | `Bacekend/services/emailService.js:8`, `Bacekend/services/emailService.js:19`, `Bacekend/services/authService.js:327` | שם משתמש SMTP |
| `SMTP_PASS` | כן | - | `Bacekend/services/emailService.js:9` | סיסמת SMTP |
| **Cloudinary (Image Storage)** |
| `CLOUDINARY_CLOUD_NAME` | כן | - | `Bacekend/config/cloudinary.js:4` | שם הענן ב-Cloudinary |
| `CLOUDINARY_API_KEY` | כן | - | `Bacekend/config/cloudinary.js:5` | מפתח API של Cloudinary |
| `CLOUDINARY_API_SECRET` | כן | - | `Bacekend/config/cloudinary.js:6` | סוד API של Cloudinary |
| **Zego (Video Conferencing)** |
| `ZEGO_APP_ID` | כן | - | `Bacekend/routes/meetings.js:68`, `Bacekend/routes/meetingToken.js:46` | מזהה אפליקציה של Zego Cloud |
| `ZEGO_SERVER_SECRET` | כן | - | `Bacekend/routes/meetings.js:69`, `Bacekend/routes/meetingToken.js:47` | סוד שרת ליצירת טוקנים של Zego |
| `TOKEN_TTL_SECONDS` | לא | `3600` | `Bacekend/routes/meetings.js:70`, `Bacekend/routes/meetingToken.js:48` | זמן תוקף טוקן Zego בשניות (ברירת מחדל: שעה) |
| **Frontend** |
| `VITE_API_URL` | כן | - | `Frontend/src/config/env.js:1`, כל קבצי ה-API ב-Frontend | כתובת URL של שרת ה-API (Backend) |

## הערות חשובות

1. **סביבות נתונים**: המערכת תומכת בשלוש סביבות נפרדות (development, test, production) עם פרטי התחברות נפרדים לכל סביבה.

2. **אבטחה**: 
   - `SESSION_SECRET_KEY` חייב להיות מחרוזת אקראית חזקה (מומלץ לפחות 32 תווים).
   - כל הסודות (DB passwords, SMTP, Cloudinary, Zego) חייבים להישמר בסביבה מאובטחת ולא להיכלל בקוד.

3. **CLIENT_URL**: משמש ליצירת קישורים במיילים (איפוס סיסמה, תזכורות פגישות) ו-CORS. חייב להתאים לכתובת ה-Frontend המדויקת.

4. **Zego Configuration**: 
   - `ZEGO_APP_ID` הוא מספר (לא מחרוזת).
   - `ZEGO_SERVER_SECRET` חייב להיות באורך 16, 24 או 32 בתים (UTF-8).
   - `TOKEN_TTL_SECONDS` מגדיר כמה זמן טוקן הצטרפות לפגישה תקף.

5. **Frontend**: משתנה `VITE_API_URL` נדרש ב-Frontend ומשמש בכל קריאות ה-API. ב-Vite, משתנים עם קידומת `VITE_` נחשפים ללקוח.

6. **Email Service**: שירות המייל משתמש ב-SMTP סטנדרטי. `SMTP_PORT` בדרך כלל 587 (TLS) או 465 (SSL).

7. **לא נמצא בקוד**: 
   - משתני סביבה נוספים שעשויים להיות נדרשים לפריסה (כגון `PORT` - מוגדר כ-3000 בקוד, `LOG_LEVEL`).
   - משתנים לניטור/observability (כגון Sentry DSN, DataDog API key).

## דוגמה לקובץ .env

```env
# Database (Development)
DB_USER_LOCAL=root
DB_PASS_LOCAL=password
DB_NAME_LOCAL=skill_matana_dev
DB_HOST_LOCAL=localhost

# Application
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SESSION_SECRET_KEY=your-super-secret-key-here-min-32-chars

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Zego
ZEGO_APP_ID=1234567890
ZEGO_SERVER_SECRET=your-16-24-or-32-byte-secret
TOKEN_TTL_SECONDS=3600
```

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

