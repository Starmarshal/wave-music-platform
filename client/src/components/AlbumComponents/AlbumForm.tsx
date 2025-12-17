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
    <div className="!flex !justify-center !py-6 sm:!py-10 !px-2 sm:!px-4 md:!px-5 !min-h-[calc(100vh-200px)]">
      <Card
        className="!w-full !max-w-[600px] !rounded-xl md:!rounded-2xl !shadow-xl !p-4 sm:!p-6 dark:!bg-gray-800 dark:!border-gray-700"
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