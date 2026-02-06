# NIHSS Tracker

A Progressive Web App (PWA) for calculating and tracking NIH Stroke Scale (NIHSS) scores.

## Features

- ✅ **Complete NIHSS Assessment** - All 15 standard items
- 📊 **Real-time Scoring** - Instant total score and severity classification
- 📱 **History Tracking** - Save and review past assessments with full breakdowns
- 💾 **Local Storage** - Data persists on device (anonymous, no login required)
- 🔒 **Privacy-First** - No server, all data stays on your device
- 📲 **PWA Support** - Install as an app on mobile/desktop

## Severity Classifications

| Score | Severity | Description |
|-------|----------|-------------|
| 0 | No Stroke | Minor/No stroke |
| 1-4 | Mild | Minor stroke |
| 5-15 | Moderate | Moderate stroke |
| 16-42 | Severe | Severe stroke |

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Deployment

### Local Development
```bash
npm run dev
# Open http://localhost:3000
```

### Static Export
```bash
npm run build
# Output in dist/ folder
```

### Firebase Hosting
See deployment instructions in project wiki.

## NIHSS Items Covered

1. Level of Consciousness
2. LOC Questions
3. LOC Commands
4. Best Gaze
5. Best Visual
6. Facial Palsy
7. Motor Arm (Left/Right)
8. Motor Leg (Left/Right)
9. Limb Ataxia
10. Sensory
11. Best Language
12. Dysarthria
13. Extinction & Inattention

## License

MIT License - Free for medical professionals and personal use.

---

**Note:** This tool is for educational and documentation purposes. Always follow institutional protocols for stroke assessment.
