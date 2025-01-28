import { useEffect, useState } from "react";
import axios from "axios";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  // Fetch properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/properties");
        setProperties(response.data); // Update state with fetched properties
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p>{property.description}</p>
            <p>Price: ${property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Status: {property.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
