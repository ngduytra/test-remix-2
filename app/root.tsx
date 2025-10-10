import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { useEffect } from 'react'
import parse from 'html-react-parser'
import type { LinksFunction, MetaFunction } from '@remix-run/node'

import AppLayout from '@/components/app-layout'

import { ThirdwebProvider } from './providers/thirdweb.provider'
import { QueryClientProvider } from './providers/query-client.provider'
import ToastProvider from './providers/toast/toast.provider'
import { TokenProvider } from './providers/token.provider'
import GlobalModalProvider from './providers/global-modal.provider'

import stylesheet from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },

  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: stylesheet,
  },
]

// export const meta: MetaFunction = () => {
//   return [
//     { title: 'Dopamint | The 1st AI ' },
//     {
//       name: 'description',
//       content:
//         'Think Dopamint as CapCut meets Pump.fun. Prompt NFTs, mint and burn TOGETHER on liquid bonding curves on Base, by AncientX',
//     },
//     {
//       name: 'og:title',
//       content: 'Dopamint | The 1st AI OG',
//     },
//     {
//       name: 'og:image',
//       content: `${
//         import.meta.env.VITE_DOPAMINT_DOMAIN
//       }/images/dopamint-thumbnail.png`,
//     },
//     {
//       name: 'og:description',
//       content:
//         'Think Dopamint as CapCut meets Pump.fun. Prompt NFTs, mint and burn TOGETHER on liquid bonding curves on Base, by AncientX',
//     },
//     {
//       name: 'twitter:card',
//       content: 'summary_large_image',
//     },
//     {
//       name: 'twitter:title',
//       content: 'Dopamint | The 1st AI prompt-to-NFT Marketplace on Base',
//     },
//     {
//       name: 'twitter:description',
//       content:
//         'Think Dopamint as CapCut meets Pump.fun. Prompt NFTs, mint and burn TOGETHER on liquid bonding curves on Base, by AncientX',
//     },
//     {
//       name: 'twitter:image',
//       content: `${
//         import.meta.env.VITE_DOPAMINT_DOMAIN
//       }/images/dopamint-thumbnail.png`,
//     },
//     {
//       name: 'keywords',
//       content:
//         'Dopamint, AI, NFT, Marketplace, Base, AncientX, Prompt NFTs, Liquid bonding curves',
//     },
//   ]
// }

export async function generateMetadata() {
  return {
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: 'https://test-remix-2.vercel.app/dopamint-text-logo-dark.png',
        button: {
          title: `Dopamint AI App`,
          action: {
            type: 'launch_miniapp',
            name: 'Dopamint AI App',
            url: 'https://test-remix-2.vercel.app',
            splashImageUrl:
              'https://test-remix-2.vercel.app/dopamint-text-logo-dark.png',
            splashBackgroundColor: '#000000',
          },
        },
      }),
    },
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {parse(
          `<style>body[data-scroll-locked] { margin: 0 !important; }</style>`,
        )}
      </body>
    </html>
  )
}

export default function App() {
  useEffect(() => {
    // Only run on client side to avoid server-side import issues
    if (typeof window !== 'undefined') {
      import('@farcaster/miniapp-sdk').then((sdk) => {
        sdk.default.actions.ready()
      })
    }
  }, [])

  return (
    <QueryClientProvider>
      <ThirdwebProvider>
        <GlobalModalProvider>
          <TokenProvider />
          <ToastProvider />
          <AppLayout>
            <Outlet />
          </AppLayout>
        </GlobalModalProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  )
}
