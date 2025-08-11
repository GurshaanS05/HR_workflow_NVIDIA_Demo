import Providers from "./providers"

export default function Template({ children }: { children: React.ReactNode }) {
  // Wrap all pages in (app) with the TransfersProvider
  return <Providers>{children}</Providers>
}
