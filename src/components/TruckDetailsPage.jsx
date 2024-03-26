import React from 'react';

const TruckDetailsPage = ({ truckDetails }) => {
  return (
    <div>
      <h1>Truck Details</h1>
      <div className="truck-list">
        {truckDetails.map((truck, index) => (
          <div key={index} className="truck-card">
            <h2>{truck.model} Id: {truck.id}</h2>
            <p>Year: {truck.year}</p>
            <p>Price: {truck.price}</p>
            <p>Description: {truck.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruckDetailsPage;
