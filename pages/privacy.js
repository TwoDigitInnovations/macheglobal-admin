import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Privacy() {
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrivacyPolicy();
  }, []);

  const getPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.macheglobal.com/api/user/getContent');
      
      if (response?.data?.status && response?.data?.data[0]) {
        setPrivacyContent(response.data.data[0].policy || '');
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-custom-orange px-6 py-8">
            <h1 className="text-3xl font-bold text-black text-center">
              Privacy Policy
            </h1>
          </div>

          <div className="px-6 py-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-orange"></div>
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: privacyContent }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
