/* eslint-disable react/prop-types */
const normalizePayload = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  return [data];
};

const StructuredData = ({ data }) => {
  const payloads = normalizePayload(data);
  if (!payloads.length) return null;

  const payload = payloads.length === 1 ? payloads[0] : payloads;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
};

export default StructuredData;
