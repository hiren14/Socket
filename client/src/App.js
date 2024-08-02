// src/App.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const ENDPOINT = 'https://socket-virid.vercel.app/';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const socket = io(ENDPOINT, {
            withCredentials: true
        });

        socket.on('refreshData', (updatedData) => {
            setData(updatedData);
        });

        // Initial data fetch
        fetch(`${ENDPOINT}/api/data`)
            .then(response => response.json())
            .then(newData => setData(newData));

        // Cleanup on component unmount
        return () => socket.disconnect();
    }, []);

    const addItem = (name) => {
        fetch(`${ENDPOINT}/api/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        }).then(() => {
            // Fetch new data from your API
            fetch(`${ENDPOINT}/api/data`)
                .then(response => response.json())
                .then(newData => setData(newData));
        });
    };

    const updateItem = (id, name) => {
        fetch(`${ENDPOINT}/api/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name }),
        });
    };

    const handleAddClick = () => {
        const name = prompt('Enter new item name:');
        if (name) {
            addItem(name);
        }
    };

    const handleUpdateClick = (id) => {
        const name = prompt('Enter new name:');
        if (name) {
            updateItem(id, name);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Data List</h1>
                {data.map(item => (
                    <div key={item.id}>
                        {item.name}
                        <button onClick={() => handleUpdateClick(item.id)}>Update</button>
                    </div>
                ))}
                <button onClick={handleAddClick}>Add New Item</button>
            </header>
        </div>
    );
};

export default App;
