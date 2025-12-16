'use client';

import {useState} from 'react';
import {api} from '@/src/shared/api';
import {message} from 'antd';

export default function useTrackForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!name.trim()) {
          message.warning('Введите название трека');
          return false;
        }
        if (!artist.trim()) {
          message.warning('Введите имя исполнителя');
          return false;
        }
        return true;
      case 1:
        if (!picture) {
          message.warning('Загрузите изображение');
          return false;
        }
        return true;
      case 2:
        if (!audio) {
          message.warning('Загрузите аудиофайл');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateStep(activeStep)) {
      return false;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('artist', artist);
      formData.append('text', text);
      if (picture) formData.append('picture', picture);
      if (audio) formData.append('audio', audio);

      await api.post('/tracks', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });

      message.success('Трек успешно создан');
      return true;
    } catch (error) {
      console.error('Ошибка создания трека:', error);
      message.error('Не удалось создать трек');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setArtist('');
    setText('');
    setPicture(null);
    setAudio(null);
    setActiveStep(0);
  };

  return {
    // Form values
    activeStep,
    name,
    artist,
    text,
    picture,
    audio,
    loading,

    // Setters
    setName,
    setArtist,
    setText,
    setPicture,
    setAudio,
    setActiveStep,

    // Methods
    nextStep,
    prevStep,
    submitForm,
    resetForm,
    validateStep,
  };
}