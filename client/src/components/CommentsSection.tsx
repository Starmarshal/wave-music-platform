'use client';

import {Button, Card, Flex, Form, Input, message, Typography} from 'antd';
import {useId, useState} from 'react';

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
  const uniqueId = useId();

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
    <div className="!w-full !max-w-full md:!max-w-[600px] !mt-[1rem]">
      <Card
        title={
          <span className="!text-base sm:!text-lg dark:!text-gray-200">{title}</span>}
        className="!w-full md:!w-[600px] !min-h-[200px] sm:!min-h-[300px] !max-h-[400px] sm:!max-h-[500px] !mb-4 sm:!mb-5 !shadow-lg !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
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
                className="!py-2 !border-0 !border-b !border-gray-100 dark:!border-gray-700 !w-full"
              >
                <Typography.Text
                  strong
                  className="!text-sm sm:!text-base dark:!text-gray-200"
                >{comment.username}:</Typography.Text>
                <span className="!text-sm sm:!text-base dark:!text-gray-300"> {comment.text}</span>
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

        <Form
          form={form}
          name={`commentForm-${uniqueId}`}
          onFinish={handleSubmit}
          autoComplete="off"
          disabled={loading || submitting}
        >
          <Form.Item
            label={
              <span className="!text-sm sm:!text-base dark:!text-gray-300">Имя</span>}
            name="username"
            rules={[
              {required: true, message: 'Введите ваше имя!'},
              {min: 2, message: 'Имя должно содержать минимум 2 символа'}
            ]}
          >
            <Input
              placeholder="Ваше имя"
              size="large"
              className="
                !text-sm sm:!text-base
                dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200
                placeholder:!text-gray-500
                dark:[&::placeholder]:!text-gray-400
                dark:[&::-webkit-input-placeholder]:!text-gray-400
                dark:[&::-moz-placeholder]:!text-gray-400
                dark:[&:-ms-input-placeholder]:!text-gray-400
                dark:[&:-moz-placeholder]:!text-gray-400
              "
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="!text-sm sm:!text-base dark:!text-gray-300">Комментарий</span>}
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
              maxLength={500}
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
      </Card>
    </div>
  );
}