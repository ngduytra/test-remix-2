import Image from '@/components/image'

type ImageLayoutProps = {
  images: string[]
}
function ImageLayout({ images }: ImageLayoutProps) {
  switch (images.length) {
    case 1:
      return <OneImageLayout image={images[0]} />
    case 2:
      return <TwoImageLayout images={images} />
    case 3:
      return <ThreeImageLayout images={images} />
    case 4:
      return <FourImageLayout images={images} />
    default:
      return (
        <div className="w-full aspect-[4/3]">
          <Image
            src={'/bg-gradient-error.png'}
            alt="collection-card-image"
            imageClassName="w-full object-cover rounded-[20px]"
            className="w-full h-full"
          />
        </div>
      )
  }
}

function OneImageLayout({ image }: { image: string }) {
  return (
    <div className="w-full aspect-[4/3]">
      <Image
        src={image}
        alt="collection-card-image"
        imageClassName="w-full object-cover rounded-[20px]"
        className="w-full h-full"
      />
    </div>
  )
}

function TwoImageLayout({ images }: { images: string[] }) {
  return (
    <div className="w-full flex justify-between items-start self-stretch gap-x-[1px] rounded-2xl overflow-hidden">
      <div className="w-1/2 aspect-[2/3]">
        <Image
          src={images[0]}
          alt="collection-card-image"
          imageClassName="object-cover"
          className="w-full h-full"
        />
      </div>
      <div className="w-1/2 aspect-[2/3]">
        <Image
          src={images[1]}
          alt="collection-card-image"
          imageClassName="object-cover"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

function ThreeImageLayout({ images }: { images: string[] }) {
  return (
    <div className="w-full flex justify-between items-start self-stretch gap-x-[1px] rounded-2xl overflow-hidden">
      <div className="w-[calc(60%+1px)] aspect-[4/5] ">
        <Image
          src={images[0]}
          alt="collection-card-image"
          imageClassName="w-full object-cover"
          className="w-full h-full"
        />
      </div>
      <div className="w-2/5 flex flex-col gap-y-[1px] ">
        <Image
          src={images[1]}
          alt="collection-card-image"
          imageClassName="w-full h-full object-cover aspect-[4/3.75]"
        />
        <Image
          src={images[1]}
          alt="collection-card-image"
          imageClassName="w-full h-full object-cover aspect-[4/3.75]"
        />
      </div>
    </div>
  )
}

function FourImageLayout({ images }: { images: string[] }) {
  return (
    <div className="w-full flex justify-between items-start self-stretch gap-x-[1px] rounded-2xl overflow-hidden">
      <div className="w-[calc(75%+2px)] aspect-square">
        <Image
          src={images[0]}
          alt="collection-card-image"
          imageClassName="w-full object-cover"
          className="w-full h-full"
        />
      </div>
      <div className="w-1/4 flex flex-col gap-y-[1px]">
        <Image
          src={images[1]}
          alt="collection-card-image"
          imageClassName="w-full h-full object-cover"
          className="h-1/3"
        />
        <Image
          src={images[1]}
          alt="collection-card-image"
          imageClassName="w-full h-full object-cover"
          className="h-1/3"
        />
        <Image
          src={images[2]}
          alt="collection-card-image"
          imageClassName="w-full h-full object-cover"
          className="h-1/3"
        />
      </div>
    </div>
  )
}

export default ImageLayout
