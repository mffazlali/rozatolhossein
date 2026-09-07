/**
 * SearchInput Component
 * کامپوننت ورودی متن برای جستجو
 */
'use client'

import { Input, Button } from '@heroui/react'
import { useState, useEffect, FormEventHandler } from 'react'

interface SearchInputProps {
  label: string
  value: string
  onChange?: (value: string) => void
  onInput?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showClearButton?: boolean
}

export const SearchInput = ({
  label,
  value,
  onChange,
  onInput,
  placeholder = 'جستجو...',
  className = '',
  disabled = false,
  showClearButton = true,
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    // فقط state محلی را تغییر می‌دهیم، onChange فراخوانی نمی‌شود
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onChange) onChange(localValue)
  }

  const handleBlur = () => {
    // وقتی input از focus خارج می‌شود، مقدار را به parent ارسال می‌کنیم
    if (onChange) onChange(localValue)
  }

  const handleClear = () => {
    setLocalValue('')
    if (onChange) onChange('')
      if (onInput) {
      onInput('')
    }
  }

  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    setLocalValue(e.currentTarget.value)
    if (onInput) {
      onInput(e.currentTarget.value)
    }
  }

  const showClear = showClearButton && localValue && !disabled

  return (
    <div className="relative">
      <Input
        label={label}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onInput={handleInput}
        placeholder={placeholder}
        className={className}
        isDisabled={disabled}
        classNames={{
          input: 'text-theme-white',
          label: 'text-theme-gray',
          inputWrapper: 'bg-theme-gray-dark border-theme-border',
        }}
        dir="rtl"
      />
      {showClear && (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="absolute left-2 top-1/2 -translate-y-1/2 min-w-6 w-6 h-6 text-theme-gray hover:text-theme-white z-10"
          onPress={handleClear}>
          <i className="fa-light fa-times" />
        </Button>
      )}
    </div>
  )
}
