/* eslint-disable react/prop-types */
const normalizePayload = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  return [data];
};

const stripContext = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const { "@context": _context, ...rest } = value;
  return rest;
};

const toGraphItems = (payloads) =>
  payloads.flatMap((payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload.filter(Boolean).map(stripContext);
    if (typeof payload === "object" && Array.isArray(payload["@graph"])) {
      return payload["@graph"].filter(Boolean).map(stripContext);
    }
    return [stripContext(payload)];
  });

const StructuredData = ({ data }) => {
  const payloads = normalizePayload(data);
  if (!payloads.length) return null;

  const payload =
    payloads.length === 1
      ? payloads[0]
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@graph": toGraphItems(payloads),
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
};

export default StructuredData;
