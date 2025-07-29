const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-url')()
]);
const fetch = require('node-fetch'); // <-- THIS LINE IS ESSENTIAL

exports.fetchLinkPreview = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'URL query parameter is required.' });
  }

  try {
    const response = await fetch(url); // This line needs the import from above
    const html = await response.text();
    const metadata = await metascraper({ html, url });

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Failed to fetch link preview:', error);
    res.status(500).json({ message: 'Failed to fetch link preview.', error: error.message });
  }
};