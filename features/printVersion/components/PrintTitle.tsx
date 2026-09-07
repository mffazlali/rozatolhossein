/**
 * PrintTitle Component
 * عنوان اصلی خبر در نسخه چاپی
 * 
 * @param title - عنوان خبر
 */

'use client';

// 1. React imports
import React from 'react';

export interface PrintTitleProps {
  title: string;
}

// Component
export const PrintTitle = ({
  title,
}: PrintTitleProps) => {
  return (
    <section className="flex flex-col items-start w-full py-4">
      <h1 className="text-[39.5px] font-medium text-light-white text-right leading-12">
        {title}
      </h1>
    </section>
  );
};