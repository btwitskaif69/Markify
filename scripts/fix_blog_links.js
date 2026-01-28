
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import blogs from './blog_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to strip specific markdown link but keep text: [Markify](...) -> Markify
function stripMarkifyLinks(text) {
    if (!text) return text;
    // Regex matches [Markify](...) and replaces with just Markify
    return text.replace(/\[Markify\]\(https:\/\/markify\.com\)/g, 'Markify');
}

function fixBlogLinks() {
    console.log("Starting blog link cleanup...");

    const cleanedBlogs = blogs.map(blog => {
        // 1. Clean Title and Excerpt (No links allowed)
        const cleanTitle = stripMarkifyLinks(blog.title);
        const cleanExcerpt = stripMarkifyLinks(blog.excerpt);

        // 2. Clean Content: Remove all links first, then apply ONLY ONE link to the first occurrence
        let cleanContent = stripMarkifyLinks(blog.content);

        // Find the first occurrence of "Markify" that isn't already part of a link or in a header
        // We want to avoid linking headers like "# Markify vs Notion" if possible, but definitely link the first paragraph text.
        // For simplicity and safety: replace the FIRST occurrence of "Markify" bound by word boundaries.

        // We need to be careful not to match inside existing other markdown links (unlikely for "Markify" specifically based on previous context, but good practice)
        // A simple way: find first "Markify" and replace it.

        // Let's try to skip the H1 title in the content if it exists (usually # Title)
        // We can split by newline, process lines, find first valid text line.

        let linksAppliedCount = 0;
        const maxLinks = 3;
        const lines = cleanContent.split('\n');

        const processedLines = lines.map((line, index) => {
            // Skip Headers
            if (line.trim().startsWith('#')) {
                return line;
            }

            if (linksAppliedCount < maxLinks && line.includes('Markify')) {
                // Check if line already has the link (from previous run potentially, but we stripped them earlier so cleanContent shouldn't have them)
                // We use a regex to replace "Markify" that is NOT inside a markdown link
                // But since we stripped them, we can just replace 'Markify' with '[Markify](...)'

                // BE CAREFUL: "Markify" could appear multiple times in one line.
                // We want to replace as many as needed to reach maxLinks.

                // Simple approach: Replace one by one and increment counter
                let tempLine = line;
                // Regex: find Markify (word boundary)
                const regex = /\bMarkify\b/g;

                // We can't easily use replace global with a counter in one go for multiple lines logic distributed
                // Let's do it manually for the line

                let matches = [...tempLine.matchAll(regex)];
                if (matches.length > 0) {
                    // Rebuild line
                    let newLine = "";
                    let lastIndex = 0;

                    for (const match of matches) {
                        // Add text before match
                        newLine += tempLine.substring(lastIndex, match.index);

                        if (linksAppliedCount < maxLinks) {
                            newLine += "[Markify](https://markify.com)";
                            linksAppliedCount++;
                        } else {
                            newLine += "Markify";
                        }

                        lastIndex = match.index + match[0].length;
                    }
                    // Add remaining text
                    newLine += tempLine.substring(lastIndex);
                    return newLine;
                }
            }
            return line;
        });

        cleanContent = processedLines.join('\n');

        return {
            ...blog,
            title: cleanTitle,
            excerpt: cleanExcerpt,
            content: cleanContent
        };
    });

    // Write updated data back to blog_data.js
    const fileContent = `
const blogs = ${JSON.stringify(cleanedBlogs, null, 4)};

export default blogs;
`;

    fs.writeFileSync(path.join(__dirname, 'blog_data.js'), fileContent);
    console.log("Successfully cleaned up blog links.");
}

fixBlogLinks();
