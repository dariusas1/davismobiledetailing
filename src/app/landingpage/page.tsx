import dynamic from 'next/dynamic'

const LandingPage = dynamic(() => import('../../pages/LandingPage/LandingPage'), {
  ssr: true
})

export default function Page() {
  return <LandingPage />
} 