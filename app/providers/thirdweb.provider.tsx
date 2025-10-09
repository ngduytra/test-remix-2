import { PropsWithChildren } from 'react'
import { ThirdwebProvider as ThirdwebProviderComponent } from 'thirdweb/react'

export function ThirdwebProvider({ children }: PropsWithChildren) {
  return <ThirdwebProviderComponent>{children}</ThirdwebProviderComponent>
}
