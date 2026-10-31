'use client';

import {Card, Typography} from 'antd';
import React from 'react';
import Header from '@/src/components/Header';

type AuthCardProps = {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

// Общая обёртка страниц входа, регистрации и восстановления пароля
export default function AuthCard({title, subtitle, children, footer}: AuthCardProps) {
  return (
    <>
      <Header />
      <div className="!flex !justify-center !py-8 sm:!py-14 !px-3 !min-h-[calc(100vh-200px)]">
        <Card
          className="!w-full !max-w-[440px] !h-fit !rounded-2xl !shadow-xl dark:!bg-gray-800 dark:!border-gray-700"
        >
          <Typography.Title
            level={2}
            className="!text-center !text-2xl !mb-2 !text-[#32c2ce] dark:!text-cyan-400"
          >
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Paragraph
              type="secondary"
              className="!text-center !mb-6 dark:!text-gray-400"
            >
              {subtitle}
            </Typography.Paragraph>
          )}
          {children}
          {footer && (
            <div className="!mt-4 !text-center !text-sm dark:!text-gray-300">{footer}</div>
          )}
        </Card>
      </div>
    </>
  );
}
