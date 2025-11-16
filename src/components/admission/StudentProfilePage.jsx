import { useNavigate, useParams } from 'react-router-dom';
import { StudentProfile } from './StudentProfiles';

export function StudentProfilePage() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const handleBack = () => {
    // Navigate back to student list
    navigate('/admission/students');
  };

  return (
    <StudentProfile 
      studentId={studentId} 
      onBack={handleBack} 
    />
  );
}