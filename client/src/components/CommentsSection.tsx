'use client';

import {Button, Card, Flex, Form, Input, message, Typography} from 'antd';
import {useState} from 'react';

type CommentType = {
  username: string;
  text: string;
  _id?: string;
};

type CommentsSectionProps = {
  comments: CommentType[];
  onAddComment: (values: { username: string; text: string }) => Promise<void>;
  title: string;
  placeholder?: string;
  loading?: boolean;
};

export default function CommentsSection({
                                          comments,
                                          onAddComment,
                                          title,
                                          placeholder = 'Напишите ваш комментарий...',
                                          loading = false,
                                        }: CommentsSectionProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { username: string; text: string }) => {
    try {
      setSubmitting(true);
      await onAddComment(values);
      form.resetFields();
      message.success('Комментарий добавлен');
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      message.error('Не удалось добавить комментарий');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="!w-full !max-w-[500px] !mt-[1rem]">
      {/* Секция с существующими комментариями */}
      <Card
        title={title}
        className="!w-[500px] !min-h-[300px] !max-h-[500px] !mb-5 !shadow-lg"
      >
        <Flex
          vertical
          gap="middle"
        >
          {comments.length === 0 ? (
            <Typography.Text type="secondary">
              Пока нет комментариев. Будьте первым!
            </Typography.Text>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="!py-2 !border-0 !border-b !border-gray-100 !w-full"
              >
                <Typography.Text strong>{comment.username}:</Typography.Text> {comment.text}
              </div>
            ))
          )}
        </Flex>
      </Card>

      {/* Форма для добавления комментария */}
      <Card
        className="!w-[500px] !mt-5 !shadow-lg"
      >
        <Typography.Title
          level={4}
          className="!mb-5"
        >
          Добавить комментарий
        </Typography.Title>

        <Form
          form={form}
          name="commentForm"
          onFinish={handleSubmit}
          autoComplete="off"
          disabled={loading || submitting}
        >
          <Form.Item
            label="Имя"
            name="username"
            rules={[
              {required: true, message: 'Введите ваше имя!'},
              {min: 2, message: 'Имя должно содержать минимум 2 символа'}
            ]}
          >
            <Input placeholder="Ваше имя" />
          </Form.Item>

          <Form.Item
            label="Комментарий"
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
              rows={1}
              placeholder={placeholder}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item className="!text-right">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={loading}
            >
              Отправить
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}