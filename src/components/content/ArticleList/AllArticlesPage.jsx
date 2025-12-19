import React from 'react';
import { useNavigate } from 'react-router-dom';
import AllArticles from './AllArticles';

export function AllArticlesPage() {
  const navigate = useNavigate();

  const handleNavigateToEditor = () => {
    navigate('/content/editor');
  };

  const handleNavigateToEditorWithData = (articleData) => {
    // For now, navigate to editor. Could be enhanced to pass data via state or context
    navigate('/content/editor', { state: articleData });
  };

  return (
    <AllArticles 
      onNavigateToEditor={handleNavigateToEditor} 
      onNavigateToEditorWithData={handleNavigateToEditorWithData} 
    />
  );
}