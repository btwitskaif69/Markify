
const { uploadImage } = require('../services/r2.service');

exports.uploadFile = async (req, res) => {
    try {
        const { image, folder } = req.body;

        if (!image) {
            return res.status(400).json({ message: "No image provided." });
        }

        const userId = req.user.id;
        // Generate a unique identifier
        const uniqueId = `${userId}-${Date.now()}`;
        // Use provided folder or default to 'uploads'
        const targetFolder = folder || 'uploads';

        const url = await uploadImage(image, uniqueId, targetFolder);

        res.status(200).json({
            success: true,
            url,
            message: "Image uploaded successfully."
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Failed to upload image." });
    }
};
