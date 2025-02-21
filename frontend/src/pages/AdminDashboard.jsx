import { useEffect, useState } from "react";
import axios from "axios";
import ImageForm from "../components/ImageForm";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/properties"
      );
      const propertiesWithImages = await Promise.all(
        response.data.map(async (property) => {
          const imagesResponse = await axios.get(
            `http://localhost:5000/api/admin/properties/${property.id}/images`
          );
          return { ...property, images: imagesResponse.data };
        })
      );
      setProperties(propertiesWithImages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:5000/images/${imageId}`);
      alert("Image deleted successfully!");
      fetchProperties(); // Refresh the property list
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
      <button>Logout</button>
      <div className="flex space-y-4">
        {properties.map((property) => (
          <div key={property.id} className=" p-4 border rounded-lg shadow-md">
            <div className="flex space-x-4">
              {property.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.image_url}
                    alt={`Property ${property.id} Image ${image.id}`}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p>{property.description}</p>
            <p>Price: ${property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Status: {property.status}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Images</h3>
            </div>
            <div className="flex">
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Upload Image</h3>
                <ImageForm
                  propertyId={property.id}
                  onImageUploaded={fetchProperties}
                  onImageAdded={fetchProperties}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
