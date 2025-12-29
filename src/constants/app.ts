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
  DASHBOARD_BOOKS: '/dashboard/books',
  DASHBOARD_MY_BOOKS: '/dashboard/my-books',
} as const

export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  BOOKS: 'books',
  BORROWED_BOOKS: 'borrowedBooks',
} as const

export const DEFAULT_VALUES = {
  BORROW_BOOKS_LIMIT: 2,
  BOOKS_PLACEHOLDER_IMAGE: '/library-management.jpg',
} as const

export const MENU_ITEMS = [
  {
    title: "Books",
    url: APP_ROUTES.DASHBOARD_BOOKS,
  },
  {
    title: "My Books",
    url: APP_ROUTES.DASHBOARD_MY_BOOKS,
  },
] as const

export const getMenuNameByPath = (path: string): string => {
  const menuItem = MENU_ITEMS.find(item => item.url === path)
  return menuItem?.title || "Dashboard"
}
