'use client'

import * as Icons from '@gravity-ui/icons'
import React from 'react'
import clsx from 'clsx'

export type ShowMoreProps = {
  onClick: () => void
  disabled?: boolean
}

const ShowMore = ({ onClick, disabled = false }: ShowMoreProps) => {
  return (
    <div className="!w-full px-2 sm:px-4 md:px-0 !mt-5">
      <button
        type="button"
        onClick={onClick}
        aria-disabled={disabled}
        disabled={disabled}
        className={clsx(
          // base layout
          '!w-full !sm:w-auto !min-h-[40px] !sm:min-h-[44px] !px-4 !sm:px-6 !md:px-8 !rounded-lg !md:rounded-xl',
          '!flex !items-center !justify-center gap-2',
          // colors (light / dark)
          '!bg-[#32c4d0] !text-white shadow-lg',
          'hover:!bg-[#28a5b0] hover:!shadow-xl',
          'dark:!bg-cyan-600 dark:hover:!bg-cyan-500',
          // borders & transitions
          '!border-none !transition-all !duration-200 !ease-out',
          // typography
          '!text-sm !sm:text-base !font-semibold',
          // states
          disabled
            ? '!opacity-60 !cursor-not-allowed hover:!shadow-lg hover:!bg-[#32c4d0] dark:!hover:bg-cyan-600'
            : '!cursor-pointer',
          // responsive width for mobile
          '!max-w-full sm:!max-w-xs !mx-auto',
        )}
      >
        <Icons.ChevronDown
          width={18}
          height={18}
          aria-hidden
          className="text-white"
        />
        <span className="whitespace-nowrap">Показать ещё</span>
      </button>
    </div>
  )
}

export default ShowMore
