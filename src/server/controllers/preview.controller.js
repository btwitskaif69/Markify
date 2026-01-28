import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperUrl from "metascraper-url";
import keywordExtractor from "keyword-extractor";

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
  metascraperUrl(),
]);

export const fetchLinkPreview = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'URL query parameter is required.' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });

    // --- Generate Tags from Title and Description ---
    const textToAnalyze = `${metadata.title} ${metadata.description}`;
    
    const extractedKeywords = keywordExtractor.extract(textToAnalyze, {
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
