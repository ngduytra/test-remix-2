import { Address, shortenAddress } from 'thirdweb/utils'
import { Link, useNavigate } from '@remix-run/react'

import Button from './button'
import Countdown from './countdown'
import FixedProgress from './fixed-progress'
import NftCardSkeleton from './nft-card-skeleton'
import Image from './image'

import { useGetCollectionStats } from '@/hooks/nft/useCollectionStats'
import { useNftMetadataByBaseUri } from '@/hooks/nft/useNftMetadataByBaseUri'

import { formatToken } from '@/utils'
import { Collection } from '@/services/nft/type'

type WhitelistCardProps = {
  collection: Collection
}

function WhitelistCard({ collection }: WhitelistCardProps) {
  const navigate = useNavigate()

  const { data: collectionStats } = useGetCollectionStats(
    collection.contractAddress as Address,
  )
  const { data: nftMetadata, isLoading: fetchingNftMetadata } =
    useNftMetadataByBaseUri(collection.baseURI!, '0')

  return (
    <div className="flex flex-row sm:flex-col gap-8 sm:gap-3">
      <div className="size-[315px] sm:size-[313px]">
        {fetchingNftMetadata ? (
          <NftCardSkeleton displayInfo={false} />
        ) : (
          <Image
            src={nftMetadata?.image}
            alt={'No thumbnail'}
            className="w-full h-full object-cover rounded-[20px]"
          />
        )}
      </div>

      <div className="flex flex-col justify-between gap-5  sm:gap-y-[14px] max-w-[383px] sm:max-w-[313px]">
        <div className="flex flex-col gap-y-[14px]">
          <div className="flex flex-col gap-3">
            <div className="leading-[23px] text-lg font-bold sm:text-base line-clamp-1">
              {collection.name}
            </div>
            <div className="text-neutral-600 text-sm leading-[18px]">
              Created by{' '}
              <span
                className="text-neutral-0 cursor-pointer"
                onClick={() => navigate(`/profile/${collection.owner}`)}
              >
                {shortenAddress(collection.owner)}
              </span>
            </div>
          </div>
          <div className="w-[383px] flex flex-col gap-6 py-3 px-4 sm:w-[313px] whitelist-card ">
            <div className="flex flex-row w-full justify-between text-sm sm:flex-col sm:gap-2 sm:items-center">
              <div className="text-neutral-100 sm:text-[13px]">
                WHITELIST ENDS IN
              </div>
              <Countdown endTime={collection.whitelistConfigs.endTime} />
            </div>
            <div className="w-full mb-[22px] ">
              <FixedProgress
                progress={
                  ((Number(collectionStats?.totalSupply) || 0) /
                    collection.whitelistConfigs.maxNFTForWhitelist) *
                  100
                }
                label={
                  <>
                    {Number(collectionStats?.totalSupply) || 0}/
                    <span className="text-neutral-0/[0.5]">
                      {collection.whitelistConfigs.maxNFTForWhitelist}
                    </span>
                  </>
                }
                indicatorClassName="luminosity-progress-bar"
                rootClassName="h-3 border border-neutral-0/[0.12] rounded-2xl"
                labelClassName="top-3 text-[13px] font-vipnagorgialla"
              />
            </div>
            <div className=" flex flex-col">
              <div className="text-sm text-neutral-600 sm:text-xs">PRICE</div>
              <div className="text-xl font-bold sm:text-base">
                {formatToken(collectionStats?.mintPrice ?? 0n)} ETH
              </div>
            </div>
          </div>
        </div>

        <Link
          to={`/collections/${collection.contractAddress}`}
          className="w-full"
        >
          <Button variant="primary" className="w-full">
            Mint
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default WhitelistCard
