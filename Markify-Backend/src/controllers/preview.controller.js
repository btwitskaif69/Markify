const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-url')()
]);
const fetch = require('node-fetch');
const keyword_extractor = require('keyword-extractor'); // Import the new library

exports.fetchLinkPreview = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'URL query parameter is required.' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await metascraper({ html, url });

    // --- Generate Tags from Title and Description ---
    const textToAnalyze = `${metadata.title} ${metadata.description}`;
    
    const extractedKeywords = keyword_extractor.extract(textToAnalyze, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
      return_max_ngrams: 3 // Limit the number of suggested tags
    });
    
    // Add the extracted keywords to our response object as 'tags'
    metadata.tags = extractedKeywords;

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Failed to fetch link preview:', error);
    res.status(500).json({ message: 'Failed to fetch link preview.' });
  }
};