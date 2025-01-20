import React, { useState } from 'react';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import SessionPackForm from './SessionPackForm';
import SessionPackList from './SessionPackList';

const Clients = () => {
    const [editingClient, setEditingClient] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleEdit = (client) => {
        setEditingClient(client);
    };

    const handleSave = () => {
        setEditingClient(null);
        setRefresh(!refresh);
    };

    return (
        <div>
            <ClientList onEdit={handleEdit} onSelect={(client) => setSelectedClient(client)} key={refresh} />
            <ClientForm client={editingClient} onSave={handleSave} />
            {selectedClient && (
                <>
                    <h2>Cliente: {selectedClient.first_name}</h2>
                    <SessionPackList clientId={selectedClient.id} />
                    <SessionPackForm
                        clientId={selectedClient.id}
                        onSave={() => setRefresh(!refresh)} // Recarga la lista
                    />
                    <button onClick={() => setSelectedClient(null)}>Cancelar selección</button>
                </>
            )}
        </div>
    );
};

export default Clients;
