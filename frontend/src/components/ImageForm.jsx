import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ImageForm = ({ propertyId, onImageUploaded }) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(""); // Clear URL input if a file is chosen
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setFile(null); // Clear file input if a URL is provided
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !imageUrl) {
      alert("Please provide an image file or URL.");
      return;
    }

    try {
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("property_id", propertyId);
        formData.append("is_primary", isPrimary);

        const response = await axios.post(
          "http://localhost:5000/images/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Image uploaded:", response.data);
      } else {
        const response = await axios.post("http://localhost:5000/images", {
          property_id: propertyId,
          image_url: imageUrl,
          is_primary: isPrimary,
        });
        console.log("Image added:", response.data);
      }
      alert("Image successfully added!");
      onImageUploaded();
    } catch (error) {
      console.error("Error uploading/adding image:", error);
      alert("Failed to add image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          disabled={!!imageUrl}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={handleUrlChange}
          className="w-full p-2 border rounded"
          disabled={!!file}
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
        />
        <span>Is Primary Image?</span>
      </label>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Submit Image
      </button>
    </form>
  );
};

ImageForm.propTypes = {
  propertyId: PropTypes.number.isRequired,
  onImageUploaded: PropTypes.func.isRequired,
};

export default ImageForm;
