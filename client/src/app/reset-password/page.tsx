'use client';

import {Suspense, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Button, Form, Input, message, Result} from 'antd';
import AuthCard from '@/src/components/Auth/AuthCard';
import {api, apiError} from '@/src/shared/api';

const PASSWORD_RULE = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,128}$/;

function ResetPassword() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (values: { password: string }) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {token, password: values.password});
      setDone(true);
    } catch (error) {
      message.error(apiError(error, 'Не удалось сменить пароль'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Пароль изменён">
        <Result
          status="success"
          title="Готово"
          subTitle="Все прежние сессии завершены. Войдите с новым паролем."
          extra={<Link href="/login">Войти</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Новый пароль">
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label={<span className="dark:!text-gray-300">Новый пароль</span>}
          name="password"
          extra="От 8 символов, хотя бы одна буква и одна цифра"
          rules={[{required: true, pattern: PASSWORD_RULE, message: 'От 8 символов, буква и цифра'}]}
        >
          <Input.Password size="large" autoComplete="new-password" autoFocus />
        </Form.Item>
        <Form.Item
          label={<span className="dark:!text-gray-300">Повторите пароль</span>}
          name="confirm"
          dependencies={['password']}
          rules={[
            {required: true, message: 'Повторите пароль'},
            ({getFieldValue}) => ({
              validator: (_, value) => value === getFieldValue('password')
                ? Promise.resolve()
                : Promise.reject(new Error('Пароли не совпадают')),
            }),
          ]}
        >
          <Input.Password size="large" autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
          Сохранить пароль
        </Button>
      </Form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
