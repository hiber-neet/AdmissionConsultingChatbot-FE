import { useState } from 'react';
import AllArticles from '../../components/content/AllArticles';
import { useNavigate } from 'react-router-dom';

export function AdminAllArticlesPage() {
  const navigate = useNavigate();
  
  const goToEditor = () => navigate('/admin/editor');
  
  return <AllArticles onCreate={goToEditor} />;
}