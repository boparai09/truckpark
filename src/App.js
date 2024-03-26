import { useEffect, useState } from "react";
import TruckDetailsPage from "./components/TruckDetailsPage"
import axios from 'axios';
import "./App.css"
import { async } from "q";

function App() {
  const [trucks, setTrucks] = useState([]);
  const [truckData, setTruckData] = useState({
    model: '',
    year: '',
    price: '',
    description: ''
  });

  const [truckdeleteID, setTruckdeleteID] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/trucks');
      setTrucks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTruckData({ ...truckData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/trucks', {...truckData, sub_type_id: 2, vendor_id: 2}); // sub_type_id and vendor_id ID are being manually added yet
      console.log('Truck entry added successfully!');
      // Reset the form after submission
      setTruckData({
        model: '',
        year: '',
        price: '',
        description: ''
      });
      await fetchData();
    } catch (error) {
      console.error('Error adding truck entry:', error);
      // Optionally, you can handle error, e.g., display an error message to the user
    }
  };

  const handleDeleteChange = (e) => {
    setTruckdeleteID(e.target.value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/truck/${truckdeleteID}`); // sub_type_id and vendor_id ID are being manually added yet
      console.log('Truck entry deleted successfully!');
      // Reset the form after submission
      setTruckdeleteID();
      await fetchData();
    } catch (error) {
      console.error('Error adding truck entry:', error);
      // Optionally, you can handle error, e.g., display an error message to the user
    }
  };


  useEffect(() => {
    fetchData();
  }, [])


  return (
    <div>
      <h1>Current Trucks</h1>
      <div className="blocky">{trucks && <TruckDetailsPage truckDetails={trucks} />}</div>
      <h1>Add a truck</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Model:
          <input type="text" name="model" value={truckData.model} onChange={handleChange} />
        </label>
        <label>
          Year:
          <input type="text" name="year" value={truckData.year} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="text" name="price" value={truckData.price} onChange={handleChange} />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={truckData.description} onChange={handleChange} />
        </label>
        <button type="submit">Add Truck</button>
      </form>
      <h1>Remove a truck by ID</h1>
      <form onSubmit={handleDeleteSubmit}>
        <label>
          ID:
          <input type="text" name="id" value={truckdeleteID} onChange={handleDeleteChange} />
        </label>
        <button type="submit">Delete Truck</button>
      </form>
    </div>
  );
}

export default App;
