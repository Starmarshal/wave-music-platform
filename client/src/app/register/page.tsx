'use client';

import {Suspense, useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button, Form, Input, message} from 'antd';
import AuthCard from '@/src/components/Auth/AuthCard';
import {api, apiError} from '@/src/shared/api';
import {useAuth} from '@/src/shared/auth/AuthProvider';

const PASSWORD_RULE = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,128}$/;

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/';
  const {setUser} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string; displayName: string }) => {
    setLoading(true);
    try {
      const {data} = await api.post('/auth/register', values);
      setUser(data.user);
      message.success('Аккаунт создан. Проверьте почту — мы отправили ссылку для подтверждения');
      router.replace(next.startsWith('/') && !next.startsWith('//') ? next : '/');
    } catch (error) {
      message.error(apiError(error, 'Не удалось зарегистрироваться'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Регистрация"
      footer={<>Уже есть аккаунт? <Link href={`/login?next=${encodeURIComponent(next)}`}>Войти</Link></>}
    >
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label={<span className="dark:!text-gray-300">Имя</span>}
          name="displayName"
          rules={[{required: true, min: 2, max: 64, message: 'От 2 до 64 символов'}]}
        >
          <Input size="large" autoComplete="nickname" autoFocus />
        </Form.Item>
        <Form.Item
          label={<span className="dark:!text-gray-300">Почта</span>}
          name="email"
          rules={[{required: true, type: 'email', message: 'Введите корректную почту'}]}
        >
          <Input size="large" autoComplete="email" />
        </Form.Item>
        <Form.Item
          label={<span className="dark:!text-gray-300">Пароль</span>}
          name="password"
          extra="От 8 символов, хотя бы одна буква и одна цифра"
          rules={[{required: true, pattern: PASSWORD_RULE, message: 'От 8 символов, буква и цифра'}]}
        >
          <Input.Password size="large" autoComplete="new-password" />
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
          Зарегистрироваться
        </Button>
      </Form>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
