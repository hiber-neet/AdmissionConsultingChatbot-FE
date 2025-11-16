import { useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList';

export function StudentListPage() {
  const navigate = useNavigate();

  const handleSelectStudent = (studentId) => {
    // Navigate to student profile with the student ID
    navigate(`/admission/students/${studentId}`);
  };

  return (
    <StudentList onSelectStudent={handleSelectStudent} />
  );
}