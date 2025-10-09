import { useEffect, useState } from 'react'
import { isAddress } from 'thirdweb'
import dayjs from 'dayjs'

import { EditIcon } from 'lucide-react'
import { RadioGroup } from 'radix-ui'

import WarningIcon from './icons/warning-icon'
import Textarea from './textarea'
import CSVUploadButton from './upload-csv'
import Input from './input'
import { PublishCollectionInfo } from '@/views/create-collection/publish-collection-modal'
import Button from './button'
import { AsteriskIcon, DownloadIcon } from './icons'

import { useToast } from '@/hooks/system/useToast'

import { cn, formatToBreakline } from '@/utils'

import { DATE_TIME_FORMAT_HH_MM_A_YYYY_MM_DD, MS, ONE_HOUR } from '@/constants'

type WhitelistProps = {
  publishInfo: PublishCollectionInfo
  onChange: React.Dispatch<React.SetStateAction<PublishCollectionInfo>>
  onAddressError: (addresses: string[]) => void
  fieldErrors: PublishCollectionInfo
}
export enum DurationOption {
  OneHour = ONE_HOUR,
  TwoHours = 2 * ONE_HOUR,
  ThreeHours = 3 * ONE_HOUR,
  FourHours = 4 * ONE_HOUR,
  FiveHours = 5 * ONE_HOUR,
}

const DURATION_OPTIONS = [
  { label: '1 hour', value: DurationOption.OneHour },
  { label: '2 hours', value: DurationOption.TwoHours },
  { label: '3 hours', value: DurationOption.ThreeHours },
  { label: '4 hours', value: DurationOption.FourHours },
  { label: '5 hours', value: DurationOption.FiveHours },
]

const DURATION_HOURS_MAP: Record<DurationOption, number> = {
  [DurationOption.OneHour]: 1,
  [DurationOption.TwoHours]: 2,
  [DurationOption.ThreeHours]: 3,
  [DurationOption.FourHours]: 4,
  [DurationOption.FiveHours]: 5,
}

function Whitelist({
  publishInfo,
  onChange: setPublishInfo,
  onAddressError,
  fieldErrors,
}: WhitelistProps) {
  const { notifyError } = useToast()

  const [addressesText, setAddressesText] = useState<string>(
    publishInfo.whitelist.addresses.join(',\n'),
  )

  const onUploadWhitelist = (headers: string[], rows: string[][]) => {
    onAddressError([])
    if (headers[0].toLowerCase() !== 'address') {
      notifyError('Invalid format file')
      throw new Error('Invalid format file')
    }

    const addresses = rows.map((row) => {
      const trimmed = row[0].trim()
      if (!isAddress(trimmed)) onAddressError(['Addresses are invalid'])
      return trimmed
    })
    setPublishInfo({
      ...publishInfo,
      whitelist: { ...publishInfo.whitelist, addresses },
    })
  }

  const handleAddressesBlur = () => {
    // Parse the addresses from the text (split by comma and trim whitespace)
    const addresses = addressesText
      .split(',\n')
      .map((addr) => {
        const trimmed = addr.trim()
        if (!isAddress(trimmed)) onAddressError(['Addresses are invalid'])
        return trimmed
      })
      .filter((addr) => addr.length > 0) // Remove empty strings

    // Update the publishInfo with the parsed addresses
    setPublishInfo({
      ...publishInfo,
      whitelist: {
        ...publishInfo.whitelist,
        addresses,
      },
    })
  }

  const handleDownloadWhitelistTemplate = (
    fileName: string,
    displayName = fileName,
  ) => {
    const link = document.createElement('a')
    link.href = `/${fileName}` // File path relative to public folder
    link.download = displayName // Name for downloaded file
    link.click()
  }

  useEffect(() => {
    setAddressesText(publishInfo.whitelist.addresses.join(',\n'))
  }, [publishInfo.whitelist.addresses])

  return (
    <div className="space-y-5 w-full">
      <label
        htmlFor="collection-whitelist"
        className="text-neutral-900 text-lg font-bold"
      >
        Whitelist settings
      </label>
      <RadioGroup.Root
        id="collection-whitelist"
        className="flex flex-row space-x-3"
        value={publishInfo.whitelist.enabled ? 'enabled' : 'disabled'}
        aria-label="Select an option"
        onValueChange={(value) => {
          setPublishInfo({
            ...publishInfo,
            whitelist: {
              ...publishInfo.whitelist,
              enabled: value === 'enabled',
            },
          })
        }}
      >
        {/* Option 1 */}
        <div
          className={cn(
            'flex flex-1 items-center space-x-1 border rounded-lg justify-center p-2 ',
            !publishInfo.whitelist.enabled && 'border-primary bg-primary/10 ',
          )}
          onClick={() =>
            setPublishInfo({
              ...publishInfo,
              whitelist: { ...publishInfo.whitelist, enabled: false },
            })
          }
        >
          <RadioGroup.Item
            value="disabled"
            id="r1"
            className="h-5 w-5 rounded-full border border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary flex items-center justify-center"
          >
            <RadioGroup.Indicator className="h-2.5 w-2.5 rounded-full bg-white" />
          </RadioGroup.Item>
          <label htmlFor="r1" className="text-gray-700 h-[18px]">
            None whitelist
          </label>
        </div>

        {/* Option 2 */}
        <div
          className={cn(
            'flex flex-1 items-center justify-center space-x-1 border rounded-lg p-2',
            publishInfo.whitelist.enabled && 'border-primary bg-primary/10',
          )}
          onClick={() =>
            setPublishInfo({
              ...publishInfo,
              whitelist: { ...publishInfo.whitelist, enabled: true },
            })
          }
        >
          <RadioGroup.Item
            value="enabled"
            id="r2"
            className="h-5 w-5 rounded-full border border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary flex items-center justify-center"
          >
            <RadioGroup.Indicator className="h-2.5 w-2.5 rounded-full bg-white" />
          </RadioGroup.Item>
          <label htmlFor="r2" className="text-gray-700 h-[18px]">
            Whitelist
          </label>
        </div>
      </RadioGroup.Root>
      {publishInfo.whitelist.enabled && (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="w-full flex flex-row justify-between items-center">
              <label
                htmlFor="collection-whitelist-addresses"
                className="text-neutral-900 flex flex-nowrap items-center gap-1"
              >
                <EditIcon />
                <span className="text-sm font-medium">Whitelist addresses</span>
                {publishInfo.whitelist.enabled && <AsteriskIcon />}
              </label>
              <Button
                className="text-primary hover:text-primary bg-transparent hover:bg-transparent border-none hover:underline sm:px-1 sm:gap-1"
                variant="neutral"
                size="sm"
                onClick={() =>
                  handleDownloadWhitelistTemplate('whitelist-template.csv')
                }
              >
                <DownloadIcon />
                Download template
              </Button>
            </div>
            <div className="relative">
              <Textarea
                id="collection-whitelist-addresses"
                className="w-full pb-12 resize-none"
                placeholder="Add whitelist addresses, split by comma"
                value={addressesText}
                onChange={(e) => {
                  onAddressError([])
                  e.target.value = formatToBreakline(e.target.value)
                  setAddressesText(e.target.value)
                }}
                onBlur={handleAddressesBlur}
                disabled={!publishInfo.whitelist.enabled}
              />
              <CSVUploadButton
                onUpload={onUploadWhitelist}
                wrapClassName="absolute bottom-[7.5px] right-[1px] left-[1px] "
                uploadButtonClassName="rounded-[15px] rounded-t-none w-full"
                resetButtonClassName="rounded-[15px] rounded-t-none w-full "
              />
            </div>
            {fieldErrors.whitelist.addresses.length > 0 && (
              <p className="text-red-500 text-sm">
                {fieldErrors.whitelist.addresses[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-neutral-900 ">Supply</label>
            <Input
              min={0}
              id="collection-supply"
              className="w-full"
              placeholder="Add a supply"
              value={publishInfo.whitelist.supply}
              type="number"
              onChange={(e) => {
                const supply = parseInt(e.target.value)
                if (isNaN(supply) || supply < 0) {
                  setPublishInfo({
                    ...publishInfo,
                    whitelist: {
                      ...publishInfo.whitelist,
                      supply: 0,
                    },
                  })
                  return
                }

                setPublishInfo({
                  ...publishInfo,
                  whitelist: {
                    ...publishInfo.whitelist,
                    supply,
                  },
                })
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-neutral-900 ">End time</label>
            <RadioGroup.Root
              id="whitelist-end-time"
              className="flex flex-col space-y-3"
              defaultValue={DurationOption.OneHour.toString()}
              aria-label="Select an end time option"
            >
              <div className="flex flex-wrap gap-3">
                {DURATION_OPTIONS.map((value) => (
                  <div
                    key={value.value}
                    className={cn(
                      'w-[94px] flex items-center justify-center border-[2px] rounded-full py-2 px-5',
                      publishInfo.whitelist.duration === value.value &&
                        'border-primary bg-primary/10',
                    )}
                    onClick={() =>
                      setPublishInfo({
                        ...publishInfo,
                        whitelist: {
                          ...publishInfo.whitelist,
                          enabled: true,
                          duration: value.value,
                        },
                      })
                    }
                  >
                    <label className="text-gray-700 font-bold">
                      {value.label}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup.Root>
          </div>
          <div className="space-y-2">
            <span className="text-neutral-400">Ends time estimate</span> &nbsp;
            <span className="text-neutral-700">
              {dayjs(
                Date.now() +
                  DURATION_HOURS_MAP[
                    publishInfo.whitelist.duration || DurationOption.OneHour
                  ] *
                    ONE_HOUR *
                    MS,
              ).format(DATE_TIME_FORMAT_HH_MM_A_YYYY_MM_DD)}
            </span>
          </div>
          <div className="bg-neutral-25 text-neutral-900 flex flex-nowrap rounded-lg p-2 ">
            <WarningIcon /> &nbsp; Whitelisting phase will start immediately
            when you click button publish.
          </div>
        </div>
      )}
    </div>
  )
}

export default Whitelist
