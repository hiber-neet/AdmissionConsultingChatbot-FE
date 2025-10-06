# Cấu trúc dự án Cổng thông tin Tuyển sinh

## Cấu trúc thư mục

```
project/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD workflow
├── dist/                           # Build output
├── public/                         # Static files
│   └── robots.txt                  # SEO robots file
├── src/
│   ├── assets/                     # Static assets
│   │   ├── images/                 # Images
│   │   ├── icons/                  # Icons
│   │   ├── fonts/                  # Custom fonts
│   │   └── documents/              # PDF, documents
│   ├── components/                 # React components
│   │   ├── common/                 # Shared components (Button, Card, etc.)
│   │   ├── layout/                 # Layout components (Header, Footer, Sidebar)
│   │   ├── admission/              # Admission-specific components
│   │   ├── news/                   # News components
│   │   ├── program/                # Program components
│   │   ├── contact/                # Contact components
│   │   ├── forms/                  # Form components
│   │   └── ui/                     # UI components
│   ├── pages/                      # Page components
│   │   ├── home/                   # Homepage
│   │   ├── about/                  # About page
│   │   ├── admissions/             # Admissions page
│   │   ├── programs/               # Programs page
│   │   ├── news/                   # News page
│   │   ├── contact/                # Contact page
│   │   └── admin/                  # Admin dashboard
│   ├── services/                   # API services
│   │   └── api.ts                  # Supabase API calls
│   ├── hooks/                      # Custom React hooks
│   ├── contexts/                   # React Context providers
│   ├── types/                      # TypeScript types
│   │   └── index.ts                # Type definitions
│   ├── utils/                      # Utility functions
│   │   └── format.ts               # Formatting utilities
│   ├── constants/                  # Constants
│   │   └── routes.ts               # Route definitions
│   ├── lib/                        # Library configurations
│   │   └── supabase.ts             # Supabase client setup
│   ├── App.tsx                     # Main App component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── supabase/
│   ├── functions/                  # Edge functions
│   └── migrations/                 # Database migrations
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment variables example
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── tailwind.config.js              # Tailwind CSS config
```

## Mô tả các thư mục chính

### `/src/components`
Chứa các React component tái sử dụng được, tổ chức theo chức năng:
- **common**: Components dùng chung (Button, Card, Modal, Loading, etc.)
- **layout**: Components bố cục (Header, Footer, Navigation, Sidebar)
- **admission**: Components liên quan đến tuyển sinh
- **news**: Components hiển thị tin tức
- **program**: Components chương trình đào tạo
- **contact**: Components liên hệ
- **forms**: Form components (Input, Select, Textarea, etc.)
- **ui**: UI components cơ bản

### `/src/pages`
Các trang chính của website:
- **home**: Trang chủ
- **about**: Giới thiệu trường
- **admissions**: Thông tin tuyển sinh
- **programs**: Chương trình đào tạo
- **news**: Tin tức - sự kiện
- **contact**: Liên hệ
- **admin**: Quản trị (nếu cần)

### `/src/services`
API services để tương tác với Supabase:
- Admissions API
- Programs API
- News API
- Contact API

### `/src/hooks`
Custom React hooks:
- useAuth (authentication)
- useFetch (data fetching)
- useDebounce
- useForm

### `/src/contexts`
React Context providers:
- AuthContext (authentication state)
- ThemeContext (theme management)
- NotificationContext (notifications)

### `/src/types`
TypeScript type definitions:
- AdmissionInfo
- Program
- NewsArticle
- ContactMessage

### `/src/utils`
Utility functions:
- Date formatting
- Currency formatting
- Slugify
- Validation helpers

### `/src/lib`
Library configurations:
- Supabase client setup
- Other third-party library configs

### `/supabase`
Supabase-related files:
- **migrations**: Database migration files
- **functions**: Supabase Edge Functions

### `.github/workflows`
CI/CD configuration:
- Automated testing
- Build and deployment

## Quy tắc đặt tên

- **Components**: PascalCase (e.g., `AdmissionCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)

## Môi trường phát triển

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Type check**: `npm run typecheck`
- **Lint**: `npm run lint`

## Database

Sử dụng Supabase cho:
- Authentication
- Database (PostgreSQL)
- Storage (files, images)
- Edge Functions
- Real-time subscriptions
