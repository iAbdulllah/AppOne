# Ghoul Diner — چێشتخانەی غوول

یارییەکی **ئەسڵی** (original) ـی ئیزۆمەتریکی 3D بۆ ئەندرۆید (Three.js): بەڕێوەبردنی چێشتخانەیەک بۆ دێو و تارماییەکان، لەگەڵ مۆڵتی پلەیەر.
هەموو کۆد، مۆدێلە 3D ـەکان (بە کۆد دروستکراون)، ناو و کەسایەتییەکان نوێن و هی هیچ یارییەکی تر نین.

## یاریکردن
- لەسەر **تەباخ** دابگرە → خواردنێک هەڵبژێرە → چاوەڕێ بکە.
- کاتێک ئامادە بوو، دووبارە دابگرە بۆ دانانی لەسەر **پێشخان**.
- گارسۆنە ئێسکەپەیکەرەکان خواردن بۆ میوانەکان دەبەن → پارە و XP وەردەگریت.
- ئاست بەرزبکەرەوە بۆ کردنەوەی خواردنی نوێ، کەلوپەل، گارسۆن و فراوانکردنی چێشتخانە.
- ڕازاندنەوە ناوبانگ (⭐) زیاد دەکات → میوانی زیاتر و پارەی زیاتر.
- خواردن کاتێک یارییەکە داخراوە بەردەوام دەبێت لە لێنان، بەڵام ئەگەر زۆر بمێنێتەوە خراپ دەبێت!
- زمان: کوردی (سۆرانی) و ئینگلیزی.

## وەرگرتنی APK
هەر push ـێک GitHub Actions ـی `Build Ghoul Diner APK` کار پێدەکات.
بڕۆ بۆ **Actions** → دوایین run → **Artifacts** → `ghoul-diner-apk` دابەزێنە، zip ـەکە بکەرەوە و `app-debug.apk` لەسەر مۆبایلەکەت دابمەزرێنە.

## Build locally
```bash
npm install
npx cap sync android
cd android && ./gradlew assembleDebug   # needs Android SDK (or open android/ in Android Studio)
```
Quick browser test: `npm run serve` then open http://localhost:8080.

## مۆڵتی پلەیەر (Online)
- 🌍 **ئۆنلاین**: ناوی چێشتخانەکەت دابنێ، ڕیزبەندی یاریزانان ببینە، سەردانی چێشتخانەی یاریزانانی تر بکە.
- لە کاتی سەردان: **بەخشیش 💰** بدە (ڕۆژانە جارێک بۆ هەر چێشتخانەیەک) → خاوەنەکەی ٢٥ پارە وەردەگرێت، تۆش ‎+5 XP.
- ژمارەی یاریزانانی ئۆنلاین بە شێوەی ڕاستەوخۆ دەردەکەوێت، و کاتێک کەسێک بەخشیشت پێدەدات ئاگادار دەکرێیتەوە.

### ڕێکخستنی Supabase (یەکجار)
1. پرۆژەیەکی Supabase دروست بکە.
2. `supabase/schema.sql` لە SQL Editor ـدا ڕەن بکە.
3. Authentication → Sign In / Providers → **Allow anonymous sign-ins** چالاک بکە.
4. Project URL و anon/publishable key لە `www/js/config.js` دابنێ.

## Tech
Three.js (orthographic isometric camera, toon shading, outlines, shadows) + vanilla JS modules, Supabase for multiplayer, wrapped with Capacitor for Android.
All 3D models are built from primitives in `www/js/models.js` — no external art assets.
