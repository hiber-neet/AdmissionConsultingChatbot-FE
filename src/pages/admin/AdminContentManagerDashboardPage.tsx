import { useState } from 'react';
import ContentManagerDashboard from '../../components/content/ContentManagerDashboard';
import { useNavigate } from 'react-router-dom';

export function AdminContentManagerDashboardPage() {
  const navigate = useNavigate();
  
  const goToEditor = () => navigate('/admin/editor');
  
  return <ContentManagerDashboard onCreate={goToEditor} />;
}