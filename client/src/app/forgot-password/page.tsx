'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button, Form, Input, message, Result} from 'antd';
import AuthCard from '@/src/components/Auth/AuthCard';
import {api, apiError} from '@/src/shared/api';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', values);
      setSentTo(values.email);
    } catch (error) {
      message.error(apiError(error, 'Не удалось отправить письмо'));
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <AuthCard title="Проверьте почту">
        <Result
          status="info"
          title="Письмо отправлено"
          subTitle={`Если аккаунт с адресом ${sentTo} существует, на него придёт ссылка для сброса пароля. Она действует 1 час.`}
          extra={<Link href="/login">Вернуться ко входу</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Сброс пароля"
      subtitle="Укажите почту, на которую зарегистрирован аккаунт"
      footer={<Link href="/login">Вернуться ко входу</Link>}
    >
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name="email"
          rules={[{required: true, type: 'email', message: 'Введите почту'}]}
        >
          <Input size="large" placeholder="Почта" autoComplete="email" autoFocus />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Отправить ссылку
        </Button>
      </Form>
    </AuthCard>
  );
}
