# Virtual Study Assistant 📚

A comprehensive mobile learning platform built with React Native and Expo that helps students study smarter with AI-powered document processing, interactive quizzes, and flashcards.

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Tests -->
  <img alt="Tests Passing" src="https://img.shields.io/badge/tests-200%2B%20passing-brightgreen.svg?style=flat-square" />
  <!-- Coverage -->
  <img alt="Coverage 70%+" src="https://img.shields.io/badge/coverage-70%25%2B-brightgreen.svg?style=flat-square" />
</p>

---

## ✨ Features

### � Document Management
- Upload study materials (PDF, images)
- Organize materials by groups/subjects
- AI-powered document summarization
- Rename and delete material groups
- Duplicate entry prevention

### 🎯 Interactive Quizzes
- Auto-generated quiz questions from materials
- Multiple choice questions with explanations
- 50/50 lifeline for difficult questions
- Real-time score calculation
- Streak tracking
- Attempt history with graphs

### 🃏 Flashcards
- Generate flashcards from study materials
- Swipe-based interface
- Track learning progress

### 📊 Progress Tracking
- Score history and best scores
- Performance graphs
- Attempt tracking per material
- Review previous quiz answers

### 👤 User Management
- Secure authentication
- Email verification
- Profile management
- Password change functionality

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd VirtualStudyAssistant

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Environment Setup

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.virtualstudyassistant.com
API_VERSION=v1
```

---

## 🧪 Testing

This project includes comprehensive testing infrastructure with **200+ test cases**.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose

# CI mode
npm run test:ci
```

### Test Coverage

| Category | Coverage Target | Status |
|----------|----------------|--------|
| Statements | 70% | ✅ |
| Branches | 70% | ✅ |
| Functions | 70% | ✅ |
| Lines | 70% | ✅ |

### Test Suite Includes
- ✅ **Unit Tests** - Utilities and service layer logic
- ✅ **Component Tests** - React component rendering and behavior
- ✅ **Integration Tests** - Complete user flows and API integration

**For detailed testing information, see [TESTING.md](docs/TESTING.md)**

---

## 📖 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference with examples
- **[Testing Guide](docs/TESTING.md)** - How to write and run tests
- **[Testing Summary](docs/TESTING_SUMMARY.md)** - Overview of test implementation

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native 0.81.4, React 19.1.0
- **Framework**: Expo SDK 54.0.12
- **Navigation**: React Navigation 7.x
- **Styling**: NativeWind (Tailwind CSS), React Native Paper
- **State Management**: React Hooks, AsyncStorage
- **Animations**: React Native Reanimated 4.1.1
- **Testing**: Jest, React Native Testing Library
- **HTTP Client**: Axios
- **Charts**: React Native Chart Kit

### Project Structure

```
VirtualStudyAssistant/
├── screens/              # Main screen components
│   ├── HomeScreen.js     # Material management
│   ├── QAScreen.js       # Quiz interface
│   ├── LoginScreen.js    # Authentication
│   ├── ProfileScreen.js  # User profile
│   └── components/       # Reusable components
│       ├── common/       # Shared components
│       └── QA/           # Quiz-specific components
├── services/             # Business logic layer
│   ├── DocumentService.js
│   └── QuizService.js
├── utils/               # Utility functions
│   └── storage.js       # AsyncStorage wrapper
├── config/              # Configuration
│   └── api.js           # API client setup
├── __tests__/           # Test files
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── utils/
└── docs/                # Documentation
```

### Service Layer Pattern

The app uses a service layer to separate business logic from UI:

```javascript
// services/QuizService.js
class QuizService {
  static async getQuestions(docId) { /* ... */ }
  static calculateScore(correct, total) { /* ... */ }
  static shuffleArray(array) { /* ... */ }
}

// Usage in components
const questions = await QuizService.getQuestions(docId);
const score = QuizService.calculateScore(8, 10); // 80%
```

---

## � Configuration

### Babel Configuration

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [/* ... */],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 📱 Screens

### Home Screen
- Display material groups
- Upload new materials with progress timer
- Rename/delete groups
- Navigate to material details

### QA Screen
- Take interactive quizzes
- Use 50/50 lifeline
- Track streak and score
- View attempt history
- Review answers

### Login/Signup Screen
- Secure authentication
- Email verification
- Form validation

### Profile Screen
- View user information
- Change password
- Manage account settings

### Details Screen
- View material summaries
- Access quizzes and flashcards
- See material metadata

---

## 🔒 Security

- JWT token-based authentication
- Secure token storage with AsyncStorage
- API request authentication headers
- Password hashing on backend
- Email verification for new accounts

---

## 🎨 UI/UX Features

- **Loading States**: Timer countdowns during operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on phones and tablets
- **Animations**: Smooth transitions with Reanimated
- **Accessibility**: Proper labels and contrast
- **Dark Mode**: Support for light/dark themes (configurable)

---

## 📊 Performance

- **Lazy Loading**: Documents loaded on demand
- **Memoization**: React.memo and useMemo for optimization
- **Debouncing**: Prevent rapid API calls
- **Caching**: Store frequently accessed data
- **Image Optimization**: Compressed images and lazy loading

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Worklets runtime not ready"
```bash
# Solution: Ensure Reanimated plugin is last in babel.config.js
# Clear cache: expo start -c
```

**Issue**: Tests failing
```bash
# Solution: Clear Jest cache
npm test -- --clearCache
npm test
```

**Issue**: Expo Go version incompatible
```bash
# Solution: Use development build or upgrade Expo Go
expo install
```

**Issue**: Android build fails
```bash
# Solution: Clean and rebuild
cd android
./gradlew clean
cd ..
expo run:android
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Write tests for new features
- Follow existing code style
- Add JSDoc comments to functions
- Update documentation as needed
- Ensure all tests pass before PR

---

## 📝 Scripts

```json
{
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:verbose": "jest --verbose",
  "test:ci": "jest --ci --coverage --maxWorkers=2"
}
```

---

## 📦 Dependencies

### Core Dependencies
- `expo`: ^54.0.12
- `react`: 19.1.0
- `react-native`: 0.81.4
- `react-navigation`: ^7.1.14
- `axios`: ^1.11.0

### UI Libraries
- `nativewind`: ^4.1.23
- `react-native-paper`: ^5.14.5
- `react-native-reanimated`: ~4.1.1
- `react-native-chart-kit`: ^6.12.0

### Development
- `jest`: ^29.x
- `@testing-library/react-native`: ^12.x
- `@testing-library/jest-native`: ^5.x

**For complete list, see [package.json](package.json)**

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**BSC Individual Project**  
Virtual Study Assistant

---

## 🙏 Acknowledgments

- React Native Team
- Expo Team
- Testing Library maintainers
- Open source community

---

## 📞 Support

For support and questions:
- 📧 Email: support@virtualstudyassistant.com
- 📖 Documentation: See `docs/` folder
- 🐛 Issues: GitHub Issues

---

## 🗺️ Roadmap

- [ ] Offline mode support
- [ ] Social features (study groups)
- [ ] Gamification (badges, levels)
- [ ] Voice-to-text notes
- [ ] Collaborative study sessions
- [ ] Advanced analytics dashboard
- [ ] Export study materials
- [ ] Integration with calendar apps

---

## 📈 Project Stats

- **Lines of Code**: 10,000+
- **Test Cases**: 200+
- **Test Coverage**: 70%+
- **Screens**: 6
- **Components**: 20+
- **API Endpoints**: 15+

---

**Built with ❤️ for students, by students**

Last Updated: November 8, 2025
