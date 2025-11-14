// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the default storefront
  redirect('/storefront')
}