const normalizePayload = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  return [data];
};

const StructuredData = ({ data }) => {
  const payloads = normalizePayload(data);
  if (!payloads.length) return null;

  return payloads.map((payload, index) => (
    <script
      key={`structured-data-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  ));
};

export default StructuredData;
