import React, { useState } from 'react';
import PilatesCalendar from './PilatesCalendar';
import SessionForm from './SessionForm';

const Sessions = () => {
    const [refresh, setRefresh] = useState(false);

    const handleSave = () => {
        setRefresh(!refresh); // Recarga el calendario
    };

    return (
        <div>
            <SessionForm onSave={handleSave} />
            <PilatesCalendar key={refresh} />
        </div>
    );
};

export default Sessions;
