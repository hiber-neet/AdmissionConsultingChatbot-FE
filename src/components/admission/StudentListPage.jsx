import { useNavigate } from 'react-router-dom';
import { StudentList } from './StudentList';

export function StudentListPage() {
  const navigate = useNavigate();

  // Remove the handleSelectStudent function since StudentList now handles this internally
  // The StudentList component will show the detail dialog with real API data

  return (
    <StudentList onSelectStudent={null} />
  );
}