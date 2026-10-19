import { useParams } from 'react-router-dom';
import PlaceholderPage from '../components/PlaceholderPage.jsx';

export default function Quiz() {
  const { id } = useParams();
  return <PlaceholderPage title="Quiz" message={`Test mode is coming soon. (Quiz ID: ${id})`} />;
}