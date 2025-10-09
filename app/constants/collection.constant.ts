export const ESTIMATED_GENERATE_NFT_DURATION = 75 * 1000 // 75 seconds

export const GENERATE_NFT_PRICE = 10000000000000n // 0.00001 ETH

export const DEPLOY_COLLECTION_PRICE = 250000000000000n // 0.00025 ETH

export const MINT_FIRST_NFT_PRICE = 100000000000000n // 0.0001 ETH

export const NFT_CREATED_TOPIC =
  '0x67d1cd8e714f3ce1835cc3191f9ea9595c4642e2137a7f18e604a6b82d59ad41'

export const GPT_IMAGE_SIZE = ['1024x1024', '1536x1024', '1024x1536']

export enum ImageModel {
  NanoBanana = 'fal-ai/nano-banana',
  ChatGPTImage = 'gpt-image-1',
  FluxKontextPro = 'black-forest-labs/flux-kontext-pro',
}

export const IMAGE_MODEL_LABEL: Record<ImageModel, string> = {
  [ImageModel.NanoBanana]: 'Nano Banana',
  [ImageModel.ChatGPTImage]: 'ChatGPT Image',
  [ImageModel.FluxKontextPro]: 'Flux Kontext Pro',
}

export const DEFAULT_GPT_IMAGE_SIZE = GPT_IMAGE_SIZE[0]

export const DEFAULT_IMAGE_MODEL = ImageModel.NanoBanana // 'fal-ai/nano-banana'

export const PROMPT_EXAMPLE = `Ultra-stylized character portrait in surreal fashion photography style.
A humanoid figure with a crocodile head wearing a red glossy puffer jacket and holding [text: Describe pet] pet.
- Headgear: [text: Describe Headgear]
- Eyewear: [text: Describe Eyewear]
Camera: chest-up, straight-on studio portrait.
Lighting: bright diffused studio lights with soft reflections on glossy fabric.
Background: solid orange backdrop 
Texture: hyper-detailed animal skin + glossy synthetic jacket surface.`

export const DEFAULT_WHITELIST_SUPPLY = 500

export const MAX_MINTABLE_PER_WALLET = 2

export const MAX_TEXT_LENGTH = 25600

export const NFT_MINTED_EVENT =
  'event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 price, uint256 protocolFee, uint256 creatorFee)'

export const NFT_BURNED_EVENT =
  'event NFTBurned(address indexed from, uint256 indexed tokenId, uint256 refund, uint256 protocolFee, uint256 creatorFee)'
