import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api/axios';

const localizer = momentLocalizer(moment);

const PilatesCalendar = ({ clientId }) => {
    const [sessions, setSessions] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchSessions();
    }, [clientId]);

    const fetchSessions = async () => {
        try {
            const response = await api.get('/sessions/');
            const filteredSessions = clientId
                ? response.data.filter((session) => session.clients.includes(clientId))
                : response.data;

            setSessions(filteredSessions);

            // Convert sessions to calendar events
            const calendarEvents = filteredSessions.map((session) => ({
                title: `${session.session_type === 'group' ? 'Grupal' : 'Privada'}: ${
                    session.clients.length
                } cliente(s)`,
                start: new Date(session.date),
                end: new Date(session.date), // Assumes 1-hour duration
                allDay: false,
            }));

            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    return (
        <div>
            <h2>{clientId ? 'Calendario Individual' : 'Calendario Global'}</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default PilatesCalendar;
