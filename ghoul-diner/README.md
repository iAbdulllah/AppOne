# Ghoul Diner — چێشتخانەی غوول

یارییەکی **ئەسڵی** (original) بۆ ئەندرۆید: بەڕێوەبردنی چێشتخانەیەک بۆ دێو و تارماییەکان.
هەموو کۆد، وێنە (بە کۆد کێشراون)، ناو و کەسایەتییەکان نوێن و هی هیچ یارییەکی تر نین.

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

Tech: HTML5 Canvas + vanilla JS, wrapped with Capacitor.
