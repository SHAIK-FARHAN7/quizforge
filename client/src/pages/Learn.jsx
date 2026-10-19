import { useParams } from 'react-router-dom';
import PlaceholderPage from '../components/PlaceholderPage.jsx';

export default function Learn() {
  const { id } = useParams();
  return <PlaceholderPage title="Learn" message={`Learn mode is coming soon. (Quiz ID: ${id})`} />;
}