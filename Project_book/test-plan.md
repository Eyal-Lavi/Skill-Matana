# תכנית בדיקות - Skill Matana

תיעוד מלא של בדיקות אוטומטיות במערכת, כולל Unit Tests ו-Integration Tests.

| Test ID | Type (Unit/Flow) | Pre | Steps | Expected | Actual | Status |
| ------- | ---------------- | --- | ----- | -------- | ------ | ------ |
| **Backend - Services** |
| `meetingService.schedule.test.js` | Unit | Mocked: User, Connection, Availability, Meeting models | 1. קריאה ל-`scheduleMeeting` עם פרמטרים תקינים<br>2. בדיקת יצירת meeting<br>3. בדיקת נעילת slot<br>4. בדיקת שליחת מיילים | Meeting נוצר, slot נעול, מיילים נשלחים | ✅ Pass | `Bacekend/tests/services/meetingService.schedule.test.js` |
| `meetingService.cancel.test.js` | Unit | Mocked: Meeting, Availability models | 1. קריאה ל-`cancelMeeting` על ידי משתתף<br>2. בדיקת עדכון סטטוס<br>3. בדיקת שחרור slot | Meeting בוטל, slot זמין מחדש | ✅ Pass | `Bacekend/tests/services/meetingService.cancel.test.js` |
| `availabilityService.list.test.js` | Unit | Mocked: Availability model | 1. קריאה ל-`listUserAvailability`<br>2. בדיקת סינון סלוטים עתידיים<br>3. בדיקת סינון סלוטים לא מוזמנים | רק סלוטים עתידיים ולא מוזמנים מוחזרים | ✅ Pass | `Bacekend/tests/services/availabilityService.list.test.js` |
| **Backend - Controllers** |
| `connectionRequestsController.test.js` | Unit | Mocked: Session, ConnectionRequest service | 1. קריאה ל-`getReceivedRequestsForUser`<br>2. בדיקת החזרת בקשות נכונות<br>3. בדיקת טיפול בשגיאות | רק בקשות שהתקבלו מוחזרות | ✅ Pass | `Bacekend/tests/controllers/connectionRequestsController.test.js` |
| **Backend - Routes (E2E)** |
| `meetings.e2e.test.js` | Flow | Mocked: Session, Meeting service, Middleware | 1. GET `/meetings/my` עם סשן תקין<br>2. בדיקת middleware authentication<br>3. בדיקת החזרת רשימת פגישות | רשימת פגישות מוחזרת בהצלחה | ✅ Pass | `Bacekend/tests/routes/meetings.e2e.test.js` |
| **Frontend - Components** |
| `StatsGrid.test.jsx` | Unit | Mocked: Redux store, API calls, NotificationsContext | 1. רינדור קומפוננטה<br>2. בדיקת הצגת KPI cards<br>3. בדיקת ניווט | כל ה-KPI cards מוצגים, ניווט עובד | ✅ Pass | `Frontend/src/components/dashboard/StatsGrid.test.jsx` |
| `UpcomingMeetings.test.jsx` | Unit | Mocked: Redux store, meetingsAPI | 1. רינדור עם רשימת פגישות<br>2. בדיקת סינון כרונולוגי<br>3. בדיקת הצגת 5 הראשונות<br>4. בדיקת כפתור "View All" | פגישות מסודרות, מוצגות 5 הראשונות | ✅ Pass | `Frontend/src/components/dashboard/UpcomingMeetings.test.jsx` |
| `RecentActivity.test.jsx` | Unit | Mocked: Redux store, meetingsAPI | 1. רינדור עם פגישות פעילות<br>2. בדיקת סינון פגישות פעילות<br>3. בדיקת לחיצה על פעילות | רק פגישות פעילות מוצגות, ניווט עובד | ✅ Pass | `Frontend/src/components/dashboard/RecentActivity.test.jsx` |
| `QuickActions.test.jsx` | Unit | Mocked: Redux store, Router | 1. רינדור קומפוננטה<br>2. בדיקת הצגת כל כרטיסי הקיצורים<br>3. בדיקת ניווט לכל כרטיס | כל הכרטיסים מוצגים, ניווט תקין | ✅ Pass | `Frontend/src/components/dashboard/QuickActions.test.jsx` |
| `NotificationsPreview.test.jsx` | Unit | Mocked: Redux store, NotificationsContext, notificationsAPI | 1. רינדור במצב ריק<br>2. רינדור עם התראות<br>3. בדיקת badge של unread count<br>4. בדיקת חישוב זמן יחסי<br>5. בדיקת קישורים | מצב ריק מוצג, badge נכון, קישורים עובדים | ✅ Pass | `Frontend/src/components/dashboard/NotificationsPreview.test.jsx` |

## סקירה כללית

### כלי בדיקה
- **Backend**: Jest + Supertest (`Bacekend/package.json:39-40`)
- **Frontend**: Jest + React Testing Library + jsdom (`Frontend/package.json:39-54`)

### אסטרטגיית בדיקות

#### Backend
- **Mocking**: כל המודלים (Sequelize), שירותי מייל, middleware מומקמים במלואם
- **Isolation**: אין כתיבה למסד נתונים אמיתי, אין שליחת מיילים אמיתיים
- **Coverage**: כיסוי של Services (לוגיקה עסקית), Controllers (טיפול בבקשות), Routes (E2E)

#### Frontend
- **Mocking**: Redux store, API calls (`fetch`/`axios`), Context providers
- **Isolation**: אין קריאות רשת אמיתיות, אין תלות במצב חיצוני
- **Coverage**: כיסוי של קומפוננטות Dashboard (UI, אינטראקציות, ניווט)

### הרצת בדיקות

#### Backend
```bash
cd Bacekend
npm install
npm test
```

#### Frontend
```bash
cd Frontend
npm install
npm test
```

### מבנה קבצי בדיקה

```
Bacekend/tests/
├── setupTests.js              # הגדרות גלובליות לבדיקות
├── services/
│   ├── meetingService.schedule.test.js
│   ├── meetingService.cancel.test.js
│   └── availabilityService.list.test.js
├── controllers/
│   └── connectionRequestsController.test.js
└── routes/
    └── meetings.e2e.test.js

Frontend/src/components/dashboard/
├── StatsGrid.test.jsx
├── UpcomingMeetings.test.jsx
├── RecentActivity.test.jsx
├── QuickActions.test.jsx
└── NotificationsPreview.test.jsx
```

## מה מכוסה

### ✅ Backend
- **Services**: לוגיקת פגישות (קביעה, ביטול), ניהול זמינות (רשימה, סינון)
- **Controllers**: טיפול בבקשות חיבור, טיפול בשגיאות
- **Routes**: אינטגרציה E2E של endpoints (authentication, response format)

### ✅ Frontend
- **Dashboard Components**: כל קומפוננטות הדשבורד נבדקות
- **State Management**: אינטגרציה עם Redux store
- **API Integration**: Mocking של קריאות API
- **User Interactions**: לחיצות, ניווט, הצגת נתונים

## מה חסר / Next Steps

### Backend
- [ ] בדיקות ל-`authService` (login, register, password reset)
- [ ] בדיקות ל-`searchService` (חיפוש משתמשים)
- [ ] בדיקות ל-`notificationsService` (יצירה, קריאה, מחיקה)
- [ ] בדיקות ל-`adminController` (ניהול משתמשים, מיומנויות)
- [ ] בדיקות ל-`skillController` (יצירה, הוספה למשתמש)
- [ ] בדיקות validation (express-validator)
- [ ] בדיקות middleware (authMiddleware, meetingMiddleware)

### Frontend
- [ ] בדיקות לקומפוננטות Auth (Login, Register, ForgotPassword)
- [ ] בדיקות לקומפוננטות Profile (עריכה, הצגה)
- [ ] בדיקות לקומפוננטות Search (חיפוש, סינון)
- [ ] בדיקות לקומפוננטות Meeting Room (הצטרפות, וידאו)
- [ ] בדיקות לקומפוננטות Admin (ניהול משתמשים, מיומנויות)
- [ ] בדיקות אינטגרציה E2E (User flows מלאים)
- [ ] בדיקות נגישות (Accessibility)

### כללי
- [ ] בדיקות ביצועים (Performance tests)
- [ ] בדיקות אבטחה (Security tests)
- [ ] בדיקות עומס (Load tests)
- [ ] בדיקות נגישות (A11y tests)

## Best Practices קיימות

1. **Mocking מלא**: כל התלויות החיצוניות ממוקמות, מה שמבטיח בדיקות מהירות ואמינות
2. **Setup מרכזי**: `setupTests.js` מכיל הגדרות גלובליות (`Bacekend/tests/setupTests.js`)
3. **Test Utils**: Frontend כולל `testUtils.js` עם `renderWithProviders` (`Frontend/src/test/testUtils.js`)
4. **Isolation**: כל בדיקה עצמאית, ללא תלות במצב גלובלי
5. **Descriptive Names**: שמות בדיקות ברורים ומתארים את מה שנבדק

## הערות טכניות

- **Jest Config**: קובץ תצורה נפרד לכל צד (`Bacekend/jest.config.js`, `Frontend/jest.config.cjs`)
- **Test Environment**: Frontend משתמש ב-`jsdom` לסימולציית DOM (`Frontend/jest.config.cjs`)
- **Coverage**: לא מוגדר כרגע, אך קל להוסיף עם `--coverage` flag
- **CI/CD**: לא נמצא בקוד, אך קל לשלב עם GitHub Actions / GitLab CI

