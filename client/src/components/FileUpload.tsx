'use client';

import React, {useRef} from 'react';

interface FileUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  accept: string;
  children: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({setFile, accept, children}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      className="!cursor-pointer"
    >
      <input
        className="!hidden"
        accept={accept}
        type="file"
        ref={ref}
        onChange={onChange}
      />
      {children}
    </div>
  );
};

export default FileUpload;