import SubmitNewsForm from '../components/news/SubmitNewsForm';

const Submit = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Submit News for Validation
        </h1>
        <p className="text-gray-600">
          Share a news article and let AI and the community determine its credibility.
        </p>
      </div>

      <SubmitNewsForm />
    </div>
  );
};

export default Submit;