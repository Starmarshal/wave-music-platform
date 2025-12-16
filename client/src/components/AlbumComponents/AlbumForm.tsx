'use client';

import {Card} from 'antd';

type AlbumFormProps = {
  children: React.ReactNode;
  title?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
};

function AlbumFormActions(props: {
  onCancel: (() => void) | undefined,
  onSubmit: (() => void) | undefined,
  submitText: string | undefined,
  cancelText: string | undefined
}) {
  return null;
}

function AlbumFormHeader(props: { title: string | undefined }) {
  return null;
}

export default function AlbumForm({
                                    children,
                                    title = 'Создать альбом',
                                    onCancel,
                                    onSubmit,
                                    submitText = 'Создать',
                                    cancelText = 'Отмена'
                                  }: AlbumFormProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <AlbumFormHeader title={title} />

        {children}

        <AlbumFormActions
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitText={submitText}
          cancelText={cancelText}
        />
      </Card>
    </div>
  );
}