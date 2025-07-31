# Connect App - Campus Marketplace MVP

A modern React-based marketplace app designed specifically for college students to buy/sell items, offer services, and find rides within their campus community.

## 🚀 Features

### Core Functionality
- **.edu Email Verification** - Only students with verified .edu emails can join
- **Home Feed** - Featured "Plug of the Day" and recent posts
- **Explore** - Categorized listings with search and filtering
- **Campus Cruze** - Ride sharing platform for students
- **Live Now** - Real-time activity feed with flash deals
- **Messages** - In-app messaging system

### Key Differentiators
- **Trust through exclusivity** - .edu-only network
- **Real-time urgency** - Live Now feed for immediate needs
- **Campus-specific categories** - Tailored to student life
- **Engagement hooks** - Plug of the Day and flash deals

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Date handling**: date-fns
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connect-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### For Students
1. **Sign Up** - Use your .edu email address
2. **Browse** - Explore items, services, and rides
3. **Post** - Sell items, offer services, or share rides
4. **Connect** - Message other students directly

### Features Overview

#### Home Tab
- Welcome message with personalized greeting
- Featured "Plug of the Day" with flash deals
- Recent posts from your campus community

#### Explore Tab
- Search functionality across all categories
- Filter by category (Electronics, Books, Services, etc.)
- Clean, card-based listing display

#### Cruze Tab
- Find available rides to destinations
- Offer rides and earn gas money
- Real-time ride availability

#### Live Now Tab
- Real-time activity feed
- Flash deals with countdown timers
- Urgent requests and time-sensitive offers

#### Messages Tab
- Conversation list with unread indicators
- Real-time chat interface
- Direct messaging with other students

## 🔧 Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main page components
├── types/         # TypeScript type definitions
├── App.tsx        # Main app component
└── index.tsx      # App entry point
```

### Key Components
- `Navigation` - Bottom tab navigation
- `Login` - .edu email verification
- `Home` - Featured content and recent posts
- `Explore` - Search and categorized listings
- `Cruze` - Ride sharing functionality
- `LiveNow` - Real-time activity feed
- `Messages` - Chat and conversation system

## 🚀 Future Enhancements

### Backend Integration
- **Authentication**: Firebase Auth or similar
- **Database**: Firebase Firestore or PostgreSQL
- **Real-time**: WebSocket connections for live updates
- **File Storage**: AWS S3 for image uploads

### Advanced Features
- **Push Notifications** - For urgent requests and flash deals
- **Location Services** - GPS integration for ride sharing
- **Payment Processing** - Stripe integration for in-app payments
- **Rating System** - User reviews and ratings
- **Verification Badges** - Enhanced trust features

### API Keys Needed (Future)
- **Firebase** - Authentication and database
- **Stripe** - Payment processing
- **AWS S3** - File storage
- **Google Maps** - Location services
- **Push Notifications** - Real-time alerts

## 📱 Mobile Optimization

The app is designed with a mobile-first approach:
- Responsive design for all screen sizes
- Touch-friendly interface
- Bottom navigation for easy thumb access
- Optimized for mobile browsers

## 🎨 Design System

- **Primary Colors**: Blue (#3B82F6) for main actions
- **Secondary Colors**: Gray scale for text and backgrounds
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable, accessible UI elements

## 🔒 Security Considerations

- .edu email validation
- User verification system
- Secure messaging
- Data privacy compliance
- Rate limiting for posts

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please contact the development team.

---

**Connect App** - Bringing campus communities together, one transaction at a time. 