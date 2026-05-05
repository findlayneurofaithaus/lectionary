# Sydney Anglican Lectionary App

A React Native app for clergy and ministry leaders following the **Sydney Anglican Diocese lectionary**. Covers all three lectionary years (A, B, C) with a liturgical calendar, scripture readings, text-to-speech player, and sermon note-taking.

---

## Features

- **Today's Readings** — Automatically detects the current liturgical season, week, and year (A/B/C). Shows all four readings with a summary and theme.
- **Liturgical Calendar** — Month-by-month calendar colour-coded by season. Tap any date to see its readings and references.
- **Reading View** — Full reading summaries with tabbed navigation (First Reading, Psalm, Second Reading, Gospel). Adjustable font size.
- **Text-to-Speech Player** — Reads passages aloud using the device's TTS engine.
- **Sermon Notes** — Save notes per date with theme, key text, and outline. Persisted locally using AsyncStorage.
- **Seasons covered** — Advent, Christmas, Epiphany, Lent, Easter, Pentecost, Ordinary Time.

---

## Lectionary Years

| Year | Church Year | Notes |
|------|-------------|-------|
| A | 2025–2026, 2028–2029 | Matthew primary gospel |
| B | 2026–2027, 2029–2030 | Mark primary gospel |
| C | 2027–2028, 2030–2031 | Luke primary gospel |

---

## Tech Stack

- **React Native 0.73** (cross-platform iOS + Android)
- **React Navigation 6** (Stack + Bottom Tabs)
- **react-native-tts** — Text-to-speech
- **AsyncStorage** — Local notes persistence
- **react-native-calendars** — Calendar component
- **date-fns** — Date calculations

---

## Project Structure

```
anglican-lectionary-app/
├── App.js                        # Entry point
├── package.json
├── babel.config.js
└── src/
    ├── data/
    │   └── lectionary.js         # All readings, season logic, date calculations
    ├── screens/
    │   ├── HomeScreen.js         # Today's readings
    │   ├── CalendarScreen.js     # Monthly calendar
    │   ├── ReadingScreen.js      # Full reading + TTS player
    │   └── NotesScreen.js        # Sermon notes
    ├── components/
    │   ├── ReadingCard.js
    │   └── SeasonBadge.js
    ├── navigation/
    │   └── AppNavigator.js
    └── utils/
        └── theme.js
```

---

## Build Instructions

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| React Native CLI | Latest |
| **Android:** Android Studio + JDK 17 | |
| **iOS:** Xcode 15+ on macOS | Apple Developer Account |

### 1. Install dependencies

```bash
cd anglican-lectionary-app
npm install
```

### 2. iOS Setup (macOS only)

```bash
cd ios && pod install && cd ..
```

### 3. Run in development

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android
```

---

## Building for Release

### Android APK / AAB (for Play Store)

```bash
cd android

# Generate a signing key (one-time):
keytool -genkey -v -keystore anglican-lectionary.keystore \
  -alias angular-lectionary -keyalg RSA -keysize 2048 -validity 10000

# Add to android/gradle.properties:
# MYAPP_UPLOAD_STORE_FILE=anglican-lectionary.keystore
# MYAPP_UPLOAD_KEY_ALIAS=anglican-lectionary
# MYAPP_UPLOAD_STORE_PASSWORD=yourpassword
# MYAPP_UPLOAD_KEY_PASSWORD=yourpassword

# Build release AAB (recommended for Play Store):
./gradlew bundleRelease

# OR build APK:
./gradlew assembleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS IPA (for App Store)

1. Open `ios/SydneyAnglicanLectionary.xcworkspace` in Xcode
2. Select **Any iOS Device** as target
3. Product → **Archive**
4. In the Organiser, click **Distribute App**
5. Follow the App Store Connect upload wizard

---

## Play Store Submission Checklist

- [ ] App ID / Package name: `au.org.sydneyanglican.lectionary`
- [ ] Version: `1.0.0` (versionCode: 1)
- [ ] Target SDK: 34
- [ ] App icon: 512×512 PNG
- [ ] Feature graphic: 1024×500 PNG
- [ ] Screenshots: Phone (min 2), Tablet (optional)
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Content rating: Everyone
- [ ] Privacy policy URL (required)
- [ ] Signed AAB uploaded to Google Play Console

## App Store Submission Checklist

- [ ] Bundle ID: `au.org.sydneyanglican.lectionary`
- [ ] Version: `1.0.0` (Build: 1)
- [ ] iOS deployment target: iOS 14.0+
- [ ] App icon: all required sizes (use Asset Catalog)
- [ ] Screenshots: 6.5" and 5.5" iPhone required
- [ ] App description
- [ ] Keywords
- [ ] Privacy policy URL
- [ ] Category: Reference / Books
- [ ] Signed IPA uploaded via Xcode or Transporter

---

## Customisation

### Adding More Readings

Edit `src/data/lectionary.js`. Each reading follows this shape:

```js
{
  week: 'Advent 1',
  title: 'Watch and Be Ready',
  firstReading: { ref: 'Isaiah 2:1–5', summary: 'Summary text...' },
  psalm: { ref: 'Psalm 122', summary: 'Summary text...' },
  secondReading: { ref: 'Romans 13:11–14', summary: 'Summary text...' },
  gospel: { ref: 'Matthew 24:36–44', summary: 'Summary text...' },
  theme: 'Alertness and readiness for Christ\'s coming',
}
```

### Changing Season Colours

Edit `LITURGICAL_SEASONS` in `src/data/lectionary.js`:

```js
ADVENT: { name: 'Advent', color: '#4A1B8C', lightColor: '#EDE0FF', textColor: '#2D0F5C' },
```

---

## Recommended App Store Metadata

**App Name:** Sydney Anglican Lectionary

**Short Description:** Daily scripture readings for Sydney Diocese clergy

**Category:** Reference

**Keywords:** lectionary, Anglican, Sydney, scripture, readings, bible, church, sermon, liturgical

**Privacy Policy:** Required — app stores local notes using AsyncStorage (on-device only, no data sent externally).

---

## Support

Built for the Sydney Anglican Diocese lectionary cycle.
For questions, contact your diocesan IT team or the app developer.
