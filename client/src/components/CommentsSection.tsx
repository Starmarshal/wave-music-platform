'use client';

import {Avatar, Button, Card, Flex, Form, Input, message, Popconfirm, Tag, Typography} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {useId, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {apiError} from '@/src/shared/api';
import {IComment} from '@/src/types/track';
import {staticUrl} from '@/src/shared/config';

type CommentsSectionProps = {
  comments: IComment[];
  onAddComment: (values: { text: string }) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  title: string;
  placeholder?: string;
  loading?: boolean;
};

export default function CommentsSection({
                                          comments,
                                          onAddComment,
                                          onDeleteComment,
                                          title,
                                          placeholder = 'Напишите ваш комментарий...',
                                          loading = false,
                                        }: CommentsSectionProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const uniqueId = useId();
  const {user, hasRole} = useAuth();
  const pathname = usePathname();

  const handleSubmit = async (values: { text: string }) => {
    try {
      setSubmitting(true);
      await onAddComment(values);
      form.resetFields();
      message.success('Комментарий добавлен');
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      message.error(apiError(error, 'Не удалось добавить комментарий'));
    } finally {
      setSubmitting(false);
    }
  };

  const canDelete = (comment: IComment) =>
    !!onDeleteComment && !!user && (comment.userId === user._id || hasRole('admin'));

  return (
    <div className="!w-full !max-w-full md:!max-w-[600px] !mt-[1rem]">
      <Card
        title={
          <span className="!text-base sm:!text-lg dark:!text-gray-200">{title}</span>}
        className="!w-full md:!w-[600px] !min-h-[200px] sm:!min-h-[300px] !max-h-[400px] sm:!max-h-[500px] !overflow-y-auto !mb-4 sm:!mb-5 !shadow-lg !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
      >
        <Flex
          vertical
          gap="middle"
        >
          {comments.length === 0 ? (
            <Typography.Text
              type="secondary"
              className="!text-sm sm:!text-base dark:!text-gray-400"
            >
              Пока нет комментариев. Будьте первым!
            </Typography.Text>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="!py-2 !border-0 !border-b !border-gray-100 dark:!border-gray-700 !w-full !flex !items-start !gap-2"
              >
                <Avatar
                  size={28}
                  src={comment.avatar ? staticUrl(comment.avatar) : undefined}
                  className="!flex-shrink-0 !bg-gradient-to-br !from-[#32c4d0] !to-blue-500 !text-xs"
                >
                  {comment.username?.slice(0, 1).toUpperCase()}
                </Avatar>
                <div className="!flex-1 !min-w-0">
                  <Typography.Text
                    strong
                    className="!text-sm sm:!text-base dark:!text-gray-200"
                  >{comment.username}</Typography.Text>
                  {comment.guest && <Tag className="!ml-2 !text-[10px]">гость</Tag>}
                  <span className="!text-sm sm:!text-base dark:!text-gray-300">: {comment.text}</span>
                </div>
                {canDelete(comment) && (
                  <Popconfirm
                    title="Удалить комментарий?"
                    okText="Удалить"
                    cancelText="Отмена"
                    onConfirm={async () => {
                      try {
                        await onDeleteComment!(comment._id);
                      } catch (error) {
                        message.error(apiError(error, 'Не удалось удалить'));
                      }
                    }}
                  >
                    <Button type="text" size="small" icon={<DeleteOutlined />} className="!text-gray-400 hover:!text-red-500" />
                  </Popconfirm>
                )}
              </div>
            ))
          )}
        </Flex>
      </Card>

      <Card
        className="!w-full !mt-4 sm:!mt-5 !shadow-lg !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
      >
        <Typography.Title
          level={4}
          className="!mb-4 sm:!mb-5 !text-base sm:!text-lg md:!text-xl dark:!text-gray-200"
        >
          Добавить комментарий
        </Typography.Title>

        {!user ? (
          <Typography.Text className="dark:!text-gray-300">
            <Link href={`/login?next=${encodeURIComponent(pathname)}`}>Войдите</Link>, чтобы оставить комментарий
          </Typography.Text>
        ) : !user.emailVerified ? (
          <Typography.Text className="dark:!text-gray-300">
            Подтвердите почту, чтобы оставлять комментарии
          </Typography.Text>
        ) : (
          <Form
            form={form}
            name={`commentForm-${uniqueId}`}
            onFinish={handleSubmit}
            autoComplete="off"
            disabled={loading || submitting}
          >
            <Typography.Paragraph type="secondary" className="!text-sm dark:!text-gray-400">
              Вы пишете как <strong className="dark:!text-gray-200">{user.displayName}</strong>
            </Typography.Paragraph>
            <Form.Item
              name="text"
              rules={[
                {required: true, message: 'Введите ваш комментарий!'},
                {
                  min: 3,
                  message: 'Комментарий должен содержать минимум 3 символа'
                }
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder={placeholder}
                maxLength={1000}
                className="!text-sm sm:!text-base dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
              />
            </Form.Item>

            <Form.Item className="!text-right">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={loading}
                size="large"
                className="!h-[40px] sm:!h-[45px] dark:!bg-blue-600 dark:!border-blue-600"
              >
                Отправить
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
