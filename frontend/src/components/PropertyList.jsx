import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ImageForm from "./ImageForm";
import edit_icon from "../assets/icons/icons8-edit-50.png";
import { Link } from "react-router-dom";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://localhost:5000/properties");
      const propertiesWithImages = await Promise.all(
        response.data.map(async (property) => {
          const imagesResponse = await axios.get(
            `http://localhost:5000/properties/${property.id}/images`
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

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to the rightmost side
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold text-green-600">
        Property Listings
      </h1>
      <div className="flex space-x-4 overflow-x-auto scroll-smooth">
        {properties.map((property) => (
          <div key={property.id} className="p-4 border rounded-lg shadow-md ">
            <div className="flex space-x-4 overflow-x-auto scroll-smooth">
              {property.images.map((image) => (
                <div key={image.id} className="relative flex-none w-64">
                  <img
                    src={image.image_url}
                    alt={`Property ${property.id} Image ${image.id}`}
                    className="object-cover rounded-lg"
                  />
                  <img
                    src={edit_icon}
                    className="absolute top-0 right-0 h-10 p-1 px-3 bg-white rounded"
                    onClick={() => handleDeleteImage(image.id)}
                    alt=""
                  />
                  {/* <button
                    onClick={() => handleDeleteImage(image.id)}
                    src={delete_icon}
                    className="absolute bottom-0 right-0 p-1 px-3 text-white bg-red-500 rounded"
                  >
                    Delete Image
                  </button> */}
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
              <Link
                to={`/properties/${property.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
              <h3 className="text-lg font-semibold">Images</h3>
              {/* Link to the property details page */}
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

export default PropertyList;
