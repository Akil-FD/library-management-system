import { APP_ROUTES } from '@/constants/app';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect(APP_ROUTES.LOGIN);
}
