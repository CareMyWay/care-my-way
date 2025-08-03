# Provider Dashboard Documentation

## Overview
The `provider-dashboard` folder contains the complete healthcare provider interface for the Care My Way application. This dashboard allows healthcare providers to manage their practice, including scheduling, patient management, appointments, and communication.

## Architecture

### Layout Structure
The dashboard uses a consistent layout pattern defined in `layout.tsx`:

```tsx
- Fixed sidebar navigation (w-64, left-aligned)
- Top navigation bar with notifications
- Main content area with padding and scroll capability
- Responsive design with proper z-indexing
```

**Key Features:**
- **Sidebar Navigation**: Fixed 256px width sidebar with navigation links
- **Header**: Full-width navigation bar with user controls
- **Main Content**: Flexible content area with overflow handling
- **Theming**: Custom dashboard background and typography via `font-manrope`

## Page Components

### 1. Dashboard Home (`page.tsx`)
**Purpose**: Main landing page for providers
**Component**: `HomeDashPage`
**Technical Architecture**:
- **Server-Side Rendering**: Uses Next.js App Router with async component pattern
- **Component Composition**: Delegates rendering to `HomeDashPage` component
- **Route Protection**: Inherits authentication from layout.tsx

**Code Pattern**:
```tsx
export default async function ProviderDashboardPage() {
  return (
    <>
      <HomeDashPage />
    </>
  );
}
```

**Functionality**: 
- Overview of practice statistics
- Quick access to recent activities
- Navigation to other dashboard sections

### 2. Appointments (`appointments/page.tsx`)
**Purpose**: Comprehensive appointment management system
**Technical Implementation**:
- **State Management**: Uses React `useState` hook for local state
- **Type Safety**: Strict TypeScript interfaces for all data structures
- **Component Architecture**: Modular UI components with consistent props
- **Event Handling**: Client-side interactivity with "use client" directive

**Key Features**:
- **Tab-based Interface**: Upcoming, Today, Completed appointments
- **Appointment Types**: One-time and recurring appointments
- **Status Management**: Confirmed, Pending, Completed, Cancelled
- **Real-time Updates**: Dynamic appointment status changes

**Data Structure**:
```typescript
interface Appointment {
  id: string
  patientName: string
  patientAvatar?: string
  service: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  type: "one-time" | "recurring"
  location: string
  notes?: string
}
```

**Technical Features**:
- **Mock Data**: Static array with useState for development
- **Component Props**: Typed interfaces for all UI components
- **Conditional Rendering**: Dynamic UI based on appointment status
- **CSS-in-JS**: Tailwind utility classes with custom dashboard themes

**Components Used**:
- Custom dashboard UI components (Card, Button, Badge, Avatar)
- Lucide icons for visual enhancement
- Tabs for organized content display

### 3. Schedule Management (`schedule/`)
**Purpose**: Advanced availability and scheduling system
**Architecture**: Multi-page setup with nested routing
**Technical Stack**: AWS Amplify + GraphQL + TypeScript

#### Main Schedule View (`schedule/page.tsx`)
**Technical Architecture**:
- **Client-Side Rendering**: "use client" directive for interactive features
- **React Hooks**: useState, useEffect, useCallback for state management
- **Type Safety**: TypeScript interfaces for all data structures
- **Error Boundaries**: Try-catch blocks with graceful error handling

**Core Algorithms**:
```typescript
// Week calculation algorithm
const getWeekDays = (date: Date) => {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday-first
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

// Time formatting with 12-hour conversion
const formatTimeSlot = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};
```

**Functionality**:
- **Weekly View**: Monday-Sunday grid display
- **Navigation**: Previous/Next week controls
- **Time Slots**: Individual hour blocks with formatted display
- **Availability Status**: Visual indicators for available/unavailable times
- **Setup Flow**: Redirects new users to setup process

**Data Management**:
- **AWS Amplify Integration**: Uses `generateClient<Schema>()` for type-safe API calls
- **Real-time Loading**: Async data fetching with loading states
- **Time Formatting**: 12-hour format display with AM/PM
- **Data Parsing**: Handles both legacy ("YYYY-MM-DD:HH") and ISO format strings

**Performance Optimizations**:
- **useCallback**: Memoizes async functions to prevent unnecessary re-renders
- **Conditional Rendering**: Early returns for loading and error states
- **Data Deduplication**: Set-based approach for removing duplicate time slots

#### Schedule Editor (`schedule/edit/page.tsx`)
**Purpose**: Interactive availability editing interface
**Technical Implementation**:
- **State Pattern**: Record<string, boolean> for grid state management
- **Batch Operations**: 52-week generation in single transaction
- **Data Transformation**: Multiple format conversions for different storage needs

**Algorithm Implementation**:
```typescript
// Weekly pattern generation for 52 weeks
const saveSchedule = async () => {
  const availabilitySet = new Set<string>();
  const startDate = getNextMonday(new Date());
  const weeksToSave = 52;

  for (let week = 0; week < weeksToSave; week++) {
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() + week * 7);

    DAYS_OF_WEEK.forEach((day, dayIndex) => {
      TIME_OPTIONS.forEach((time) => {
        const key = `${day}-${time.split(":")[0]}`;
        if (availabilityMap[key]) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + dayIndex);
          const dateStr = date.toISOString().split("T")[0];
          availabilitySet.add(`${dateStr}:${time.split(":")[0]}`);
        }
      });
    });
  }
};
```

**Key Features**:
- **52-Week Scheduling**: Automatically applies template to future weeks
- **Grid Interface**: Click-to-toggle time slot selection
- **Visual Feedback**: Orange theme for selected slots
- **Data Persistence**: Saves to both ProviderProfile and ProviderAvailability tables

**Technical Implementation**:
```typescript
// Time slot generation
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6; // 6 AM to 11 PM
  return `${hour.toString().padStart(2, "0")}:00`;
});

// Weekly pattern mapping
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
```

**Data Processing**:
- **Legacy Support**: Handles both old ("YYYY-MM-DD:HH") and new (ISO) formats
- **Pattern Recognition**: Extracts weekly patterns from historical data
- **Validation**: Date object validation with isNaN checks
- **Error Recovery**: Graceful handling of malformed data

**User Experience Engineering**:
- **Loading States**: Visual feedback during save operations
- **Error Handling**: User-friendly error messages with retry options
- **Optimistic Updates**: Immediate UI feedback before server confirmation

**Data Format**: Stores availability as ISO strings for precise timing
**User Experience**: Loading states, saving feedback, and error handling

### 4. Patient Management (`patients/page.tsx`)
**Purpose**: Patient roster and quick access interface
**Technical Architecture**:
- **Static Data Pattern**: Mock data array for development/demo
- **Component Mapping**: Array.map() with proper React key handling
- **CSS Grid System**: Responsive design with Tailwind utilities

**Implementation Details**:
```typescript
export default function PatientsPage() {
  const patients = ["Emma Wilson", "Robert Davis", "Lisa Martinez", "Sarah Johnson"];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patientName, index) => (
        <Card key={index} className="border-gray-400 dashboard-bg-primary rounded-2xl">
          {/* Patient card content */}
        </Card>
      ))}
    </div>
  );
}
```

**Features**:
- **Patient Cards**: Avatar, name, and status display
- **Quick Actions**: View details buttons for each patient
- **Responsive Grid**: 1-3 columns based on screen size
- **Visual Design**: Teal accent colors for patient avatars

**Technical Patterns**:
- **Initials Generation**: String manipulation for avatar fallbacks
- **Responsive Design**: Breakpoint-based grid layouts
- **Component Composition**: Modular card components with consistent styling

**UI Components**:
- Avatar with fallback initials
- Dashboard-themed cards with custom styling
- Consistent button styling across the interface

### 5. Messaging System (`messages/page.tsx`)
**Purpose**: Patient communication hub
**Technical Implementation**:
- **State Management**: React useState for message list
- **Search Functionality**: Client-side filtering capabilities
- **Event Handling**: Interactive message selection

**Data Architecture**:
```typescript
interface Message {
  id: string
  patientName: string
  patientAvatar?: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

// Component state management
const [messages] = useState<Message[]>([
  // Mock data for development
]);
```

**Features**:
- **Message List**: Chronological patient conversations
- **Unread Indicators**: Visual badges for new messages
- **Search Functionality**: Quick patient/message search
- **Patient Avatars**: Visual identification system

**Technical Features**:
- **TypeScript Interfaces**: Strict typing for all message data
- **Component Composition**: Reusable UI components
- **Conditional Rendering**: Dynamic display based on message status
- **Mock Data Integration**: Development-ready with realistic sample data

### 6. Settings (`settings/page.tsx`)
**Purpose**: Provider preferences and configuration
**Technical Architecture**:
- **Form Management**: HTML form elements with controlled components
- **Grid Layout**: CSS Grid for responsive two-column design
- **Component Structure**: Card-based organization for settings groups

**Implementation Pattern**:
```typescript
export default function SettingsPage() {
  return (
    <>
      <TopNav title="Settings" notificationCount={2} />
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings cards with form controls */}
        </div>
      </div>
    </>
  );
}
```

**Categories**:
- **Account Settings**: Language and timezone preferences
- **Notification Preferences**: Email and SMS controls
- **Service Pricing**: Rate and fee management
- **Privacy Settings**: Data sharing and visibility controls

**Technical Details**:
- **Form Controls**: Select dropdowns, toggles, and input fields
- **Validation**: Client-side form validation patterns
- **Responsive Layout**: Two-column grid that collapses on mobile
- **Accessibility**: Proper labeling and keyboard navigation

**UI Layout**: Two-column responsive grid with organized setting sections

## Technical Stack

### Frontend Framework
- **Next.js 14**: App Router with TypeScript
- **React 18**: Latest hooks and concurrent features
- **Tailwind CSS**: Utility-first styling approach

### Backend Integration
- **AWS Amplify**: Type-safe data layer with auto-generated client
- **GraphQL**: Automated API layer with real-time capabilities
- **TypeScript**: Full type safety across the application

### UI Components
- **Custom Dashboard Components**: Consistent design system
- **Lucide Icons**: Modern icon library
- **Responsive Design**: Mobile-first approach

## Data Flow

### Authentication & Authorization
**Technical Implementation**:
- **Route Protection**: Amplify Auth guards all dashboard routes
- **Session Management**: Automatic token refresh and validation
- **Role-Based Access**: Provider-specific data filtering at API level
- **Security Headers**: CSRF protection and secure cookie handling

**Code Pattern**:
```typescript
// AWS Amplify client with type safety
const provider = generateClient<Schema>();

// Authenticated API calls
const { data: profiles } = await provider.models.ProviderProfile.list();
```

### State Management
**Architecture Patterns**:
- **React State**: Local component state with hooks (useState, useEffect)
- **Data Fetching**: Async operations with loading states and error boundaries
- **Error Handling**: Try-catch blocks with user feedback mechanisms
- **Memory Management**: Proper cleanup with useEffect dependencies

**State Patterns**:
```typescript
// Loading state pattern
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState<DataType[]>([]);
const [error, setError] = useState<string | null>(null);

// useCallback for performance optimization
const loadData = useCallback(async () => {
  try {
    setIsLoading(true);
    const result = await apiCall();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, [dependencies]);
```

### API Integration
**Technical Stack**:
- **GraphQL Auto-Generation**: Amplify generates typed APIs from schema
- **Type Safety**: Full TypeScript integration with generated types
- **Real-time Subscriptions**: WebSocket-based live data updates
- **Optimistic Updates**: Client-side state updates before server confirmation

**Data Layer Architecture**:
```typescript
// Example: Type-safe API operations
interface ProviderProfile {
  id: string;
  availability: string[];
  setupComplete: boolean;
}

// Generated client with full type safety
const updateProfile = async (id: string, data: Partial<ProviderProfile>) => {
  return await provider.models.ProviderProfile.update({
    id,
    ...data
  } as Parameters<typeof provider.models.ProviderProfile.update>[0]);
};
```

**Error Handling Patterns**:
```typescript
// Robust error handling with user feedback
try {
  const result = await apiOperation();
  showSuccessMessage("Operation completed successfully");
} catch (error) {
  console.error("API Error:", error);
  showErrorMessage("Operation failed. Please try again.");
} finally {
  setLoading(false);
}
```

## Styling System

### Custom CSS Classes
- `dashboard-bg-primary`: Main background colors
- `dashboard-text-primary/secondary`: Text color hierarchy
- `dashboard-button-*`: Consistent button styling
- `dashboard-card`: Card component theming

### Color Scheme
- **Primary**: Blue tones for main actions
- **Secondary**: Orange for scheduling and availability
- **Accent**: Teal for patient-related elements
- **Neutral**: Gray scale for backgrounds and text

## File Structure
```
provider-dashboard/
├── layout.tsx              # Main dashboard layout
├── page.tsx               # Dashboard home page
├── loading.tsx            # Global loading component
├── appointments/
│   └── page.tsx          # Appointment management
├── messages/
│   └── page.tsx          # Patient messaging
├── patients/
│   └── page.tsx          # Patient roster
├── schedule/
│   ├── page.tsx          # Schedule overview
│   └── edit/
│       └── page.tsx      # Schedule editor
├── settings/
│   └── page.tsx          # Provider settings
└── to-dos/
    └── complete-profile/ # Profile completion flow
```

## Development Guidelines

### Component Patterns
**Technical Standards**:
1. **Consistent Imports**: Always import dashboard UI components from designated paths
2. **TypeScript**: Define interfaces for all data structures with strict typing
3. **Error Handling**: Wrap async operations in try-catch with proper error boundaries
4. **Loading States**: Provide feedback during data operations with loading spinners
5. **Responsive Design**: Use Tailwind's responsive utilities with mobile-first approach

**Code Organization**:
```typescript
// Standard component structure
"use client"; // For client-side interactivity

import { useState, useEffect, useCallback } from "react";
import { ComponentName } from "@/components/provider-dashboard-ui/component";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";

const client = generateClient<Schema>();

interface DataInterface {
  // Type definitions
}

export default function PageComponent() {
  // State declarations
  // Effect hooks
  // Event handlers
  // Render logic
}
```

### Data Fetching
**Best Practices**:
1. **useCallback**: Memoize async functions to prevent unnecessary re-renders
2. **Loading States**: Implement proper loading and error states for UX
3. **Cleanup**: Clean up effects and subscriptions to prevent memory leaks
4. **Type Safety**: Type all API responses with generated TypeScript interfaces

**Performance Patterns**:
```typescript
// Optimized data fetching pattern
const loadData = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { data } = await client.models.ModelName.list({
      filter: { /* filters */ },
      limit: 50 // Pagination for performance
    });
    
    setData(data);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
}, [/* dependencies */]);

useEffect(() => {
  loadData();
}, [loadData]);
```

### UI/UX Best Practices
**Technical Implementation**:
1. **Navigation Patterns**: Consistent routing with Next.js App Router
2. **Visual Hierarchy**: Structured component composition with proper nesting
3. **Form Controls**: Accessible form elements with proper labeling and validation
4. **Responsive Layouts**: Mobile-first design with Tailwind breakpoints
5. **Color Contrast**: WCAG compliance with custom dashboard color tokens

**Accessibility Standards**:
```typescript
// Accessible component patterns
<Button
  aria-label="Edit availability schedule"
  disabled={isLoading}
  onClick={handleAction}
  className="focus:outline-none focus:ring-2 focus:ring-orange-500"
>
  {isLoading ? <LoadingSpinner /> : "Edit Schedule"}
</Button>
```

**Performance Optimizations**:
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component for avatars
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Conditional imports for heavy components

## Future Enhancements

### Planned Features
**Technical Roadmap**:
- **Real-time Notifications**: WebSocket integration with push notification API
- **Advanced Calendar Integrations**: Google Calendar, Outlook, and iCal sync
- **Patient Portal Integration**: Bidirectional data sync with patient applications
- **Analytics and Reporting**: Data visualization with Chart.js/D3.js integration
- **Mobile App Companion**: React Native app with shared business logic

**Implementation Details**:
```typescript
// Planned WebSocket integration
const useRealTimeNotifications = () => {
  useEffect(() => {
    const subscription = client.models.Notification.observeQuery().subscribe({
      next: ({ items }) => {
        // Handle real-time notifications
        setNotifications(items);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
};

// Calendar API integration pattern
const syncWithGoogleCalendar = async (availability: TimeSlot[]) => {
  const calendarAPI = new GoogleCalendarAPI();
  return await calendarAPI.batchUpdateEvents(availability);
};
```

### Technical Improvements
**Performance & Architecture**:
- **Performance Optimization**: Bundle splitting, lazy loading, and code optimization
- **Offline Capability**: Service Worker implementation with local data caching
- **Progressive Web App**: PWA features with app-like experience
- **Enhanced Accessibility**: WCAG 2.1 AA compliance with screen reader support
- **Automated Testing**: Jest, React Testing Library, and E2E testing with Playwright

**Infrastructure Enhancements**:
```typescript
// Planned offline-first architecture
const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<SyncOperation[]>([]);
  
  useEffect(() => {
    const handleOnline = async () => {
      if (pendingSync.length > 0) {
        await batchSyncOperations(pendingSync);
        setPendingSync([]);
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingSync]);
};

// Testing infrastructure
describe('ProviderDashboard', () => {
  it('should handle schedule updates correctly', async () => {
    render(<SchedulePage />);
    
    const editButton = screen.getByRole('button', { name: /edit availability/i });
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByText(/weekly schedule grid/i)).toBeInTheDocument();
    });
  });
});
```

**Monitoring & Analytics**:
- **Error Tracking**: Sentry integration for production error monitoring
- **Performance Metrics**: Core Web Vitals tracking and optimization
- **User Analytics**: Privacy-compliant usage analytics for UX improvements
- **A/B Testing**: Feature flag system for gradual rollouts

---

This dashboard provides a comprehensive healthcare provider management system with modern web technologies, robust technical architecture, and user-centered design principles. The codebase follows industry best practices for maintainability, scalability, and performance optimization.
