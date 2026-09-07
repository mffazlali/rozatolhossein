# Data Entry Components

کامپوننت‌های قابل استفاده مجدد برای ورودی داده در فرم‌ها

## 📋 Overview

این پوشه شامل کامپوننت‌های استاندارد برای ورودی داده در فرم‌ها است که در تمام پروژه قابل استفاده هستند.

## 📦 Components

### 1. FormButton

دکمه استاندارد برای فرم‌ها با استایل یکسان.

**Props:**
```typescript
interface FormButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Variants:**
- `primary`: آبی (پیش‌فرض) - `bg-figma-secondary-blue`
- `secondary`: خاکستری - `bg-figma-gray-medium`
- `outline`: حاشیه‌دار - `border-figma-secondary-blue`

**Sizes:**
- `sm`: 32px height
- `md`: 38px height (پیش‌فرض - مطابق Figma)
- `lg`: 44px height

**Usage:**
```tsx
import { FormButton } from '@/shared';

// Primary button (default)
<FormButton onPress={handleSubmit}>
  اعمال
</FormButton>

// Secondary button
<FormButton variant="secondary" onPress={handleCancel}>
  انصراف
</FormButton>

// Outline button
<FormButton variant="outline" size="sm" onPress={handleReset}>
  بازنشانی
</FormButton>

// Loading state
<FormButton isLoading onPress={handleSubmit}>
  در حال ارسال...
</FormButton>

// Disabled state
<FormButton isDisabled onPress={handleSubmit}>
  ارسال
</FormButton>
```

### 2. FormSelect

دراپ‌داون استاندارد برای فرم‌ها با لیبل بیرون از کنترل.

**Props:**
```typescript
interface FormSelectOption {
  key: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: FormSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  className?: string;
}
```

**Features:**
- ✅ لیبل جداگانه در بالای کنترل
- ✅ ارتفاع ثابت 38px (مطابق Figma)
- ✅ عرض پیش‌فرض 238px (قابل تغییر با className)
- ✅ RTL support
- ✅ Error message support
- ✅ Required field indicator

**Usage:**
```tsx
import { FormSelect } from '@/shared';

const [service, setService] = useState('');

const serviceOptions = [
  { key: 'news', label: 'اخبار' },
  { key: 'audio', label: 'صدا' },
  { key: 'video', label: 'تصویر' },
];

// Basic usage
<FormSelect
  label="سرویس"
  placeholder="- هر -"
  options={serviceOptions}
  value={service}
  onChange={setService}
/>

// With custom width
<FormSelect
  label="دسته‌بندی"
  options={categoryOptions}
  value={category}
  onChange={setCategory}
  className="w-full md:w-[300px]"
/>

// Required field
<FormSelect
  label="نوع محتوا"
  options={typeOptions}
  value={type}
  onChange={setType}
  isRequired
/>

// With error
<FormSelect
  label="سرویس"
  options={serviceOptions}
  value={service}
  onChange={setService}
  errorMessage="لطفاً یک سرویس انتخاب کنید"
/>

// Disabled
<FormSelect
  label="سرویس"
  options={serviceOptions}
  value={service}
  onChange={setService}
  isDisabled
/>
```

### 3. FormInput

فیلد ورودی استاندارد برای فرم‌ها با لیبل بیرون از کنترل.

**Props:**
```typescript
interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}
```

**Features:**
- ✅ لیبل جداگانه در بالای کنترل
- ✅ ارتفاع ثابت 38px (مطابق Figma)
- ✅ عرض پیش‌فرض 295px (قابل تغییر با className)
- ✅ RTL support
- ✅ Error message support
- ✅ Required field indicator
- ✅ Start/End content support (icons, etc.)

**Usage:**
```tsx
import { FormInput } from '@/shared';

const [query, setQuery] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Basic text input
<FormInput
  label="عبارت مورد نظر"
  type="text"
  value={query}
  onChange={setQuery}
/>

// With placeholder
<FormInput
  label="نام کاربری"
  type="text"
  value={username}
  onChange={setUsername}
  placeholder="نام کاربری خود را وارد کنید"
/>

// Email input
<FormInput
  label="ایمیل"
  type="email"
  value={email}
  onChange={setEmail}
  isRequired
/>

// Password input
<FormInput
  label="رمز عبور"
  type="password"
  value={password}
  onChange={setPassword}
  isRequired
/>

// With custom width
<FormInput
  label="جستجو"
  type="text"
  value={search}
  onChange={setSearch}
  className="w-full md:w-[400px]"
/>

// With error
<FormInput
  label="ایمیل"
  type="email"
  value={email}
  onChange={setEmail}
  errorMessage="فرمت ایمیل صحیح نیست"
/>

// With icon
<FormInput
  label="جستجو"
  type="text"
  value={search}
  onChange={setSearch}
  startContent={<i className="fa-light fa-search" />}
/>

// Read-only
<FormInput
  label="کد ملی"
  type="text"
  value={nationalCode}
  onChange={setNationalCode}
  isReadOnly
/>

// Disabled
<FormInput
  label="نام"
  type="text"
  value={name}
  onChange={setName}
  isDisabled
/>
```

## 🎨 Styling

### رنگ‌های استفاده شده

تمام رنگ‌ها از `app/globals.css` استفاده می‌کنند:

- **Primary Blue**: `bg-figma-secondary-blue` (#007bff)
- **Primary Blue Hover**: `bg-figma-secondary-blue-hover` (#0056b3)
- **Border**: `border-figma-border-light` (#DEE2E6)
- **Text**: `text-figma-black` (#313131)
- **Value Text**: `text-figma-gray-dark` (#474747)
- **Error**: `text-red-500`

### ابعاد استاندارد (مطابق Figma)

- **ارتفاع کنترل‌ها**: 38px
- **عرض دراپ‌داون**: 238px
- **عرض فیلد ورودی**: 295px
- **Border radius**: 6px (rounded-md)
- **فاصله لیبل تا کنترل**: 4px (gap-1)

## 📱 Responsive Design

### Mobile (< md):
- عرض کامل: `w-full`
- Stack عمودی: `flex-col`

### Desktop (>= md):
- عرض ثابت یا سفارشی
- Layout افقی: `flex-row`

## 🔄 استفاده در فرم‌ها

### نمونه فرم کامل:

```tsx
'use client';

import { useState } from 'react';
import { FormButton, FormSelect, FormInput } from '@/shared';

export const MyForm = () => {
  const [service, setService] = useState('');
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log({ service, query, email });
  };

  const serviceOptions = [
    { key: 'news', label: 'اخبار' },
    { key: 'audio', label: 'صدا' },
    { key: 'video', label: 'تصویر' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FormSelect
        label="سرویس"
        options={serviceOptions}
        value={service}
        onChange={setService}
        isRequired
      />

      <FormInput
        label="عبارت جستجو"
        type="text"
        value={query}
        onChange={setQuery}
        placeholder="جستجو کنید..."
      />

      <FormInput
        label="ایمیل"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
      />

      <FormButton onPress={handleSubmit}>
        ارسال
      </FormButton>
    </div>
  );
};
```

## ✅ قواعد استفاده

1. **همیشه از این کامپوننت‌ها استفاده کن**
   - برای تمام فرم‌های جدید
   - برای یکسان‌سازی استایل

2. **عرض را با className تنظیم کن**
   - `className="w-full md:w-[238px]"`
   - نه با inline style

3. **لیبل اجباری است**
   - همیشه label را مشخص کن
   - برای accessibility

4. **از placeholder کمتر استفاده کن**
   - فقط در موارد ضروری
   - لیبل کافی است

5. **Error handling**
   - از errorMessage برای نمایش خطا
   - با validation ترکیب کن

## 🚀 Future Enhancements

1. **FormTextarea**
   - برای متن‌های چندخطی

2. **FormCheckbox**
   - برای انتخاب‌های چندگانه

3. **FormRadio**
   - برای انتخاب تکی

4. **FormDatePicker**
   - برای انتخاب تاریخ

5. **FormFileUpload**
   - برای آپلود فایل

## 📚 Related Documentation

- [Project Standards](../../../.kiro/steering/project-standards.md)
- [HeroUI Components](https://heroui.com/docs/components)
- [Form Validation with Zod](https://zod.dev/)
