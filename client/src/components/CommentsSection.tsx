'use client';

import {Card, Form, Input, Button, Typography, Flex, message} from 'antd';
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
    <div style={{width: '100%', maxWidth: '500px'}}>
      {/* Секция с существующими комментариями */}
      <Card
        title={title}
        style={{
          width: 500,
          minHeight: 300,
          maxHeight: 500,
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
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
                style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0',
                  width: '100%'
                }}
              >
                <Typography.Text strong>{comment.username}:</Typography.Text> {comment.text}
              </div>
            ))
          )}
        </Flex>
      </Card>

      {/* Форма для добавления комментария */}
      <Card
        style={{
          width: 500,
          marginTop: 20,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography.Title
          level={4}
          style={{marginBottom: '20px'}}
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

          <Form.Item style={{textAlign: 'right'}}>
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