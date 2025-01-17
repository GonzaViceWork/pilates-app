import React, { useState } from 'react';
import ClientList from './ClientList';
import ClientForm from './ClientForm';

const Clients = () => {
    const [editingClient, setEditingClient] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const handleEdit = (client) => {
        setEditingClient(client);
    };

    const handleSave = () => {
        setEditingClient(null);
        setRefresh(!refresh);
    };

    return (
        <div>
            <ClientList onEdit={handleEdit} key={refresh} />
            <ClientForm client={editingClient} onSave={handleSave} />
        </div>
    );
};

export default Clients;
