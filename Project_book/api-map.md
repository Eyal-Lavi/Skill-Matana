# מפת API - Skill Matana

טבלת endpoints מלאה של המערכת, כולל פרמטרים, תגובות ומיקום בקוד.

| Method | Path | Description | Auth | Params/Query | Body | Response | Status | File:Line |
| ------ | ---- | ----------- | ---- | ------------ | ---- | -------- | ------ | --------- |
| **Authentication** |
| POST | `/auth/login` | התחברות משתמש | - | - | `{username/email, password}` | `{user, session}` | 200/401 | `Bacekend/routes/auth.js:13` |
| POST | `/auth/register` | רישום משתמש חדש | - | - | `{username, email, password, firstname, lastname, gender}` | `{message, user}` | 201/400 | `Bacekend/routes/auth.js:14` |
| POST | `/auth/logout` | התנתקות | Session | - | - | `{message}` | 200 | `Bacekend/routes/auth.js:16` |
| GET | `/auth/session` | קבלת סשן נוכחי | Session | - | - | `{isAuthenticated, user}` | 200/401 | `Bacekend/routes/auth.js:17` |
| POST | `/auth/update-profile` | עדכון פרופיל | Session | - | `{id, firstname, lastname, email, gender, profileImage?}` | `{message, user}` | 200/400 | `Bacekend/routes/auth.js:15` |
| POST | `/auth/forgot-password` | שליחת קישור איפוס סיסמה | - | - | `{email}` | `{message}` | 200/404 | `Bacekend/routes/auth.js:18` |
| POST | `/auth/check-link` | בדיקת תקינות קישור איפוס | - | - | `{token}` | `{valid}` | 200/400 | `Bacekend/routes/auth.js:19` |
| POST | `/auth/reset-password` | איפוס סיסמה | - | - | `{token, password}` | `{message}` | 200/400 | `Bacekend/routes/auth.js:20` |
| **Skills** |
| GET | `/skills/all` | קבלת כל המיומנויות | Session | - | - | `{skills: [...]}` | 200 | `Bacekend/routes/skills.js:6` |
| GET | `/skills` | קבלת מיומנויות של משתמש | Session | - | - | `{skills: [...]}` | 200 | `Bacekend/routes/skills.js:7` |
| POST | `/skills/new` | יצירת מיומנות חדשה | Session | - | `{name}` | `{skill}` | 201/400 | `Bacekend/routes/skills.js:8` |
| POST | `/skills/add-user-skill` | הוספת מיומנות למשתמש | Session | - | `{skillId}` | `{message}` | 200/400 | `Bacekend/routes/skills.js:9` |
| POST | `/skills/skill-requests` | בקשת הוספת מיומנות | Session | - | `{skillId}` | `{request}` | 201/400 | `Bacekend/routes/skills.js:10` |
| **Search** |
| GET | `/search` | חיפוש משתמשים | Session | `name?`, `skillId?` (comma-separated) | - | `{users: [...]}` | 200/400 | `Bacekend/routes/search.js:5` |
| **Connection Requests** |
| GET | `/connection-requests/all` | כל הבקשות של המשתמש | Session | - | - | `{requests: [...]}` | 200 | `Bacekend/routes/connection-requests.js:7` |
| GET | `/connection-requests/received` | בקשות שהתקבלו | Session | - | - | `{requests: [...]}` | 200 | `Bacekend/routes/connection-requests.js:8` |
| GET | `/connection-requests/sent` | בקשות שנשלחו | Session | - | - | `{requests: [...]}` | 200 | `Bacekend/routes/connection-requests.js:9` |
| POST | `/connection-requests` | שליחת בקשה לחיבור | Session | - | `{targetUserId}` | `{request}` | 201/400 | `Bacekend/routes/connection-requests.js:12` |
| PATCH | `/connection-requests/:id` | עדכון סטטוס בקשה | Session | `id` | `{status: 'accepted'\|'rejected'}` | `{request}` | 200/400 | `Bacekend/routes/connection-requests.js:15` |
| DELETE | `/connection-requests/:id` | מחיקת בקשה | Session | `id` | - | `{message}` | 200/404 | `Bacekend/routes/connection-requests.js:17` |
| POST | `/connection-requests/connections/disconnect` | ניתוק חיבור | Session | - | `{targetUserId}` | `{message}` | 200/400 | `Bacekend/routes/connection-requests.js:19` |
| **Availability** |
| POST | `/availability/my` | הוספת סלוטי זמינות | Session | - | `{slots: [{startTime, endTime}]}` | `{created: [...]}` | 201/400 | `Bacekend/routes/availability.js:8` |
| GET | `/availability/:userId` | רשימת זמינות של משתמש | Session | `userId`, `start?`, `end?` | - | `{availability: [...]}` | 200 | `Bacekend/routes/availability.js:11` |
| DELETE | `/availability/:id` | מחיקת סלוט | Session | `id` | - | `{message}` | 200/404 | `Bacekend/routes/availability.js:14` |
| POST | `/availability/alerts/:targetUserId` | הרשמה להתראות זמינות | Session | `targetUserId` | - | `{alert}` | 201/400 | `Bacekend/routes/availability.js:17` |
| DELETE | `/availability/alerts/:targetUserId` | ביטול התראת זמינות | Session | `targetUserId` | - | `{message}` | 200/404 | `Bacekend/routes/availability.js:18` |
| GET | `/availability/alerts/:targetUserId/status` | סטטוס התראה | Session | `targetUserId` | - | `{subscribed: boolean}` | 200 | `Bacekend/routes/availability.js:19` |
| GET | `/availability/alerts/my/subscriptions` | כל ההרשמות שלי | Session | - | - | `{subscriptions: [...]}` | 200 | `Bacekend/routes/availability.js:20` |
| POST | `/availability/recurring` | הוספת זמינות חוזרת | Session | - | `{dayOfWeek, startTime, endTime}` | `{recurring}` | 201/400 | `Bacekend/routes/availability.js:22` |
| GET | `/availability/recurring/my` | זמינות חוזרת שלי | Session | - | - | `{recurring: [...]}` | 200 | `Bacekend/routes/availability.js:23` |
| PUT | `/availability/recurring/:id` | עדכון זמינות חוזרת | Session | `id` | `{dayOfWeek?, startTime?, endTime?}` | `{recurring}` | 200/404 | `Bacekend/routes/availability.js:24` |
| DELETE | `/availability/recurring/:id` | מחיקת זמינות חוזרת | Session | `id` | - | `{message}` | 200/404 | `Bacekend/routes/availability.js:25` |
| POST | `/availability/recurring/generate` | יצירת סלוטים מזמינות חוזרת | Session | - | `{startDate, endDate}` | `{created: [...]}` | 201/400 | `Bacekend/routes/availability.js:26` |
| **Meetings** |
| POST | `/meetings/schedule` | קביעת פגישה | Session | - | `{targetUserId, availabilityId}` | `{meeting}` | 201/400 | `Bacekend/routes/meetings.js:85` |
| PATCH | `/meetings/:id/cancel` | ביטול פגישה | Session | `id` | - | `{meeting}` | 200/400 | `Bacekend/routes/meetings.js:88` |
| GET | `/meetings/my` | פגישות שלי | Session | `status?` (scheduled/completed/canceled) | - | `{meetings: [...]}` | 200 | `Bacekend/routes/meetings.js:91` |
| GET | `/meetings/:meetingId/join-token` | קבלת טוקן הצטרפות לפגישה | Session | `meetingId` | - | `{appId, token, roomId, userId, userName}` | 200/404 | `Bacekend/routes/meetings.js:66` |
| GET | `/meetings/get-meeting-id` | קבלת ID פגישה לפי משתמש אחר | Session | `otherId` | - | `{roomId}` | 200/404 | `Bacekend/routes/meetings.js:38` |
| GET | `/:meetingId/join-token` | טוקן הצטרפות (legacy route) | Session | `meetingId` | - | `{appId, token, roomId, userId, userName}` | 200/404 | `Bacekend/routes/meetingToken.js:44` |
| **Notifications** |
| GET | `/notifications` | כל ההתראות שלי | Session | `isRead?`, `limit?`, `offset?` | - | `{data: [...], unread: number}` | 200 | `Bacekend/routes/notifications.js:6` |
| GET | `/notifications/unread-count` | מספר התראות שלא נקראו | Session | - | - | `{count: number}` | 200 | `Bacekend/routes/notifications.js:7` |
| PATCH | `/notifications/:id/read` | סימון התראה כנקראה | Session | `id` | - | `{message, notification}` | 200/400 | `Bacekend/routes/notifications.js:8` |
| PATCH | `/notifications/mark-all-read` | סימון כל ההתראות כנקראו | Session | - | - | `{message, updatedCount}` | 200 | `Bacekend/routes/notifications.js:9` |
| DELETE | `/notifications/:id` | מחיקת התראה | Session | `id` | - | `{message}` | 200/400 | `Bacekend/routes/notifications.js:10` |
| **Admin** |
| POST | `/admin/add-permission` | הוספת הרשאה חדשה | Admin | - | `{permissionName}` | `{message, permission}` | 201/409 | `Bacekend/routes/admin.js:8` |
| POST | `/admin/add-permission-to-user` | הוספת הרשאה למשתמש | Admin | - | `{userId, permissionId}` | `{userPermission}` | 201/409 | `Bacekend/routes/admin.js:9` |
| POST | `/admin/skill-requests/status` | עדכון סטטוס בקשת מיומנות | Admin | - | `{requestId, status: 'approved'\|'rejected'}` | `{message, request}` | 200/400 | `Bacekend/routes/admin.js:10` |
| GET | `/admin/skill-requests/pending` | כל הבקשות הממתינות | Admin | - | - | `{requests: [...]}` | 200 | `Bacekend/routes/admin.js:11` |
| PUT | `/admin/skills/status` | עדכון סטטוס מיומנות | Admin | - | `{skillId, status: 0\|1}` | `{message, skill}` | 200/400 | `Bacekend/routes/admin.js:12` |
| GET | `/admin/users` | רשימת משתמשים | Admin | `page?`, `limit?`, `search?`, `status?` | - | `{users: [...], total, page, limit}` | 200 | `Bacekend/routes/admin.js:13` |
| PUT | `/admin/users/status` | עדכון סטטוס משתמש | Admin | - | `{userId, status}` | `{message, user}` | 200/400 | `Bacekend/routes/admin.js:14` |
| PUT | `/admin/users` | עדכון משתמש | Admin | - | `{userId, ...fields}` | `{message, user}` | 200/400 | `Bacekend/routes/admin.js:15` |
| POST | `/admin/users/login-as` | התחברות כמשתמש אחר | Admin | - | `{userId}` | `{message, session}` | 200/400 | `Bacekend/routes/admin.js:16` |
| POST | `/admin/notifications` | יצירת התראה מערכת | Admin | - | `{title, message, type?, link?, userIds?}` | `{notification}` | 201/400 | `Bacekend/routes/admin.js:17` |
| GET | `/admin/notifications` | כל התראות המערכת | Admin | `page?`, `limit?` | - | `{notifications: [...], total}` | 200 | `Bacekend/routes/admin.js:18` |
| GET | `/admin/notifications/stats` | סטטיסטיקות התראות | Admin | - | - | `{grouped: {...}}` | 200 | `Bacekend/routes/admin.js:19` |
| GET | `/admin/notifications/details` | פרטי התראה | Admin | `notificationId` | - | `{notification, recipients: [...]}` | 200/404 | `Bacekend/routes/admin.js:20` |
| **Meta Data** |
| GET | `/meta-data` | קבלת מטא-דאטה (סטטוסים, הרשאות, סוגי תמונות) | Session | - | - | `{statuses, permissions, imageTypes}` | 200 | `Bacekend/routes/meta-data.js:5` |

## הערות

- **Auth**: כל ה-endpoints מסומנים כ-"Session" דורשים סשן פעיל (middleware `isLoggedIn`). Admin endpoints דורשים הרשאות אדמין (middleware `isAdmin`).
- **Session Management**: ניהול סשן באמצעות `express-session` עם Sequelize Store (`Bacekend/app.js:26-35`).
- **Rate Limiting**: endpoints של meetings מוגנים ב-rate limiting (30 בקשות לדקה) (`Bacekend/routes/meetings.js:21`).
- **CORS**: מוגדר ב-`Bacekend/app.js:37-40` עם `credentials: true` לתמיכה ב-cookies.
- **Error Handling**: כל ה-controllers משתמשים ב-error middleware מרכזי (`Bacekend/app.js:53-58`).

