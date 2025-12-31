import { useParams } from 'react-router-dom';
import NewsDetail from '../components/news/NewsDetail';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid news ID</div>;
  }

  return <NewsDetail newsId={parseInt(id)} />;
};

export default NewsDetailPage;