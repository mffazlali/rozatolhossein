# Story Feature - Testing Guide

راهنمای تست کامل فیچر Story.

## Pre-requisites

1. سرور Next.js در حال اجرا باشد:
```bash
npm run dev
```

2. به صفحه استوری‌ها بروید:
```
http://localhost:3000/fa/stories
```

## Test Cases

### 1. Story Feed Display ✓

**چک کنید:**
- [ ] لیست استوری‌ها به درستی نمایش داده می‌شود
- [ ] دکمه "استوری شما" با آیکون + نمایش داده می‌شود
- [ ] Avatar ها با gradient ring نمایش داده می‌شوند
- [ ] Username ها زیر هر avatar نمایش داده می‌شوند
- [ ] Scroll افقی برای لیست استوری‌ها کار می‌کند
- [ ] Dummy posts در پایین نمایش داده می‌شوند

### 2. Story Viewer - Opening ✓

**چک کنید:**
- [ ] کلیک روی thumbnail استوری را باز می‌کند
- [ ] Viewer به صورت full-screen نمایش داده می‌شود
- [ ] Background gradient به درستی نمایش داده می‌شود
- [ ] Progress bars در بالا نمایش داده می‌شوند
- [ ] User info (avatar, username) در بالا نمایش داده می‌شود
- [ ] Content (emoji, text, subtext) در مرکز نمایش داده می‌شود
- [ ] Reply bar در پایین نمایش داده می‌شود

### 3. Progress Bars ✓

**چک کنید:**
- [ ] Progress bar فعلی به صورت smooth پر می‌شود
- [ ] Progress bars قبلی به صورت کامل پر هستند
- [ ] Progress bars بعدی خالی هستند
- [ ] Animation smooth و بدون lag است
- [ ] در حالت pause، progress متوقف می‌شود

### 4. Navigation - Keyboard ✓

**چک کنید:**
- [ ] Arrow Right → slide/story بعدی
- [ ] Arrow Left → slide/story قبلی
- [ ] Space → pause/play toggle
- [ ] Escape → بستن viewer
- [ ] در اولین slide، Arrow Left کاری نمی‌کند
- [ ] در آخرین slide، Arrow Right viewer را می‌بندد

### 5. Navigation - Touch (Mobile) ✓

**چک کنید:**
- [ ] Swipe left → story بعدی
- [ ] Swipe right → story قبلی
- [ ] Long press → pause
- [ ] Release → resume
- [ ] Tap روی 1/3 چپ → slide قبلی
- [ ] Tap روی 2/3 راست → slide بعدی

### 6. Navigation - Click (Desktop) ✓

**چک کنید:**
- [ ] کلیک روی 1/3 چپ → slide قبلی
- [ ] کلیک روی 2/3 راست → slide بعدی
- [ ] دکمه ‹ در سمت چپ → story قبلی
- [ ] دکمه › در سمت راست → story بعدی
- [ ] دکمه × در بالا → بستن viewer

### 7. Auto-Advance ✓

**چک کنید:**
- [ ] بعد از 5 ثانیه، به slide بعدی می‌رود
- [ ] بعد از آخرین slide یک story، به story بعدی می‌رود
- [ ] بعد از آخرین story، viewer بسته می‌شود
- [ ] در حالت pause، auto-advance متوقف می‌شود

### 8. Seen State ✓

**چک کنید:**
- [ ] بعد از باز کردن استوری، ring به خاکستری تغییر می‌کند
- [ ] Username به رنگ کم‌رنگ‌تر تغییر می‌کند
- [ ] Seen state در session حفظ می‌شود
- [ ] بعد از refresh، seen state از بین می‌رود (طبیعی است)

### 9. Responsive Design ✓

**Mobile (< 768px):**
- [ ] Viewer full-screen است (بدون rounded corners)
- [ ] Side navigation arrows نمایش داده نمی‌شوند
- [ ] Touch gestures کار می‌کنند
- [ ] Reply bar به درستی نمایش داده می‌شود

**Desktop (≥ 768px):**
- [ ] Viewer با rounded corners نمایش داده می‌شود
- [ ] Side navigation arrows نمایش داده می‌شوند
- [ ] Max width 420px است
- [ ] Centered در صفحه است

### 10. Animations ✓

**چک کنید:**
- [ ] Emoji با animation float می‌کند
- [ ] Progress bars smooth animate می‌شوند
- [ ] Hover effects روی دکمه‌ها کار می‌کنند
- [ ] Transitions smooth هستند

### 11. Error Handling ✓

**چک کنید:**
- [ ] اگر stories خالی باشد، پیام مناسب نمایش داده می‌شود
- [ ] اگر avatar نباشد، placeholder نمایش داده می‌شود
- [ ] اگر API fail شود، ErrorBoundary کار می‌کند

## Performance Tests

### 1. Animation Performance
```javascript
// در DevTools Console
performance.mark('story-start');
// باز کردن استوری
performance.mark('story-end');
performance.measure('story-load', 'story-start', 'story-end');
console.log(performance.getEntriesByName('story-load'));
```

**Expected:** < 100ms

### 2. Memory Leaks
```javascript
// در DevTools Memory
// 1. Take heap snapshot
// 2. باز و بسته کردن چند استوری
// 3. Take another heap snapshot
// 4. Compare
```

**Expected:** No significant memory increase

### 3. RAF Performance
```javascript
// در DevTools Performance
// Record → باز کردن استوری → Stop
// بررسی FPS
```

**Expected:** 60 FPS

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Issues

1. **Swipe در Safari iOS**: ممکن است با scroll conflict داشته باشد
   - **Fix**: اضافه کردن `touch-action: none` به viewer

2. **RAF در Firefox**: ممکن است کمی کندتر باشد
   - **Fix**: استفاده از `will-change: width` برای progress bars

3. **Keyboard در Modal**: ممکن است با shortcuts browser conflict داشته باشد
   - **Fix**: `preventDefault()` برای Space key

## Next Steps

1. **Integration با API واقعی**
   - تغییر `storyService.ts` برای اتصال به backend
   - پیاده‌سازی `markAsSeen` در backend
   - مدیریت authentication

2. **بهبودهای Performance**
   - Lazy loading برای avatars
   - Preloading برای slides بعدی
   - Image optimization با Next.js

3. **ویژگی‌های جدید**
   - Reply functionality
   - Share story
   - Report/Block
   - Story creation
   - Image/Video support
