import { PropsWithChildren } from 'react'
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  // desktop
  default: 5,

  // mobile
  700: 4,
  500: 3,
  400: 2,
  300: 1,
}

type MasonryLayoutProps = {
  breakpointCols?: {
    default: number
    [key: number]: number
  }
}
const MasonryLayout = ({
  children,
  breakpointCols,
}: PropsWithChildren<MasonryLayoutProps>) => {
  return (
    <Masonry
      breakpointCols={breakpointCols ?? breakpointColumnsObj}
      className="my-masonry-grid flex -ml-2 w-auto"
      columnClassName="my-masonry-grid_column pl-2 bg-clip-padding"
    >
      {children}
    </Masonry>
  )
}

export default MasonryLayout
