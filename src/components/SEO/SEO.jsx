import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
    title,
    description,
    canonical,
    type = 'website',
    name = 'Markify',
    image = 'https://assets.markify.tech/assets/markify%20og%20image.png',
    structuredData
}) => {
    const siteUrl = 'https://www.markify.tech';
    const fullTitle = `${title} | ${name}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical || siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical || siteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonical || siteUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    canonical: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    structuredData: PropTypes.object
};

export default SEO;
