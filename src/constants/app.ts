export const CONFIG = {
  APP_NAME: 'Library Management System',
  APP_DESCRIPTION: 'Manage your library efficiently with our comprehensive system.',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const


export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
} as const