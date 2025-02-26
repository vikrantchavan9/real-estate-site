import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/properties/${id}`)
      .then((response) => setProperty(response.data))
      .catch((error) => console.error("Error fetching property:", error));
  }, [id]);

  if (!property) {
    return <h2 className="text-red-500">Property not found!</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p>{property.description}</p>
      <p>Price: ${property.price}</p>
      <p>Location: {property.location}</p>

      <div className="mt-4 flex space-x-4">
        {(property.images || []).length > 0 ? (
          property.images.map((image, index) => (
            <img
              key={index}
              src={image.image_url}
              alt={`Property ${property.id}`}
              className="w-48 h-32 object-cover rounded-lg"
            />
          ))
        ) : (
          <img
            src="/default-image.jpg"
            alt="Default Property"
            className="w-48 h-32 object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
