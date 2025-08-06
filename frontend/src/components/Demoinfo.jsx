import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Demoinfo = () => {
    const [demoData, setDemoData] = React.useState(null);
    const { id } = useParams();
    function fetchDemoData() {

        axios.get(`https://file-sharing-nb09.onrender.com/api/file-info/${id}`)
            .then(response => {
                // Handle the response data
                setDemoData(response.data);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error fetching demo data:', error);
                setDemoData(null);
            });
    }

    // Fetch demo data based on the id
    useEffect(() => {
        fetchDemoData();
    }, [id]);

    if (!demoData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Demo Information</h1>
            <p>This is a demo component.</p>

            <div>
                <iframe src={demoData.cloudinaryUrl} frameborder="0"></iframe>
            </div>
        </div>
  )
}


export default Demoinfo
