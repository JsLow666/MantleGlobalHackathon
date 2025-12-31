import NewsList from '../components/news/NewsList';

const Home = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ProofFeed
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A decentralized platform for news validation using AI and community consensus on the Mantle Network.
        </p>
      </div>

      <NewsList key="news-list" />
    </div>
  );
};

export default Home;