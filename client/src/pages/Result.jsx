import { useParams } from 'react-router-dom';
import PlaceholderPage from '../components/PlaceholderPage.jsx';

export default function Result() {
  const { id } = useParams();
  return <PlaceholderPage title="Result" message={`Your result will be shown here soon. (Result ID: ${id})`} />;
}