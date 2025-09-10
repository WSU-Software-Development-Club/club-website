import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { neon } from '@neondatabase/serverless';
import { CiCalendar, CiLocationOn, CiClock1 } from 'react-icons/ci'; // used for all our media svg files
import { cn } from '@/lib/utils';
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';

interface Event {
    id?: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    details_url?: string;
    className?: string;
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchEvents = async () => {
            // check if data is cached in the browseer before querying the db
            const cachedData = localStorage.getItem('events');
            const cacheTimestamp = localStorage.getItem('eventsTimestamp');

            const CacheDuration = 1800000; // 30 minutes
            const now = Date.now();

            if(cachedData && cacheTimestamp) {
                const isExpired = now - parseInt(cacheTimestamp) > CacheDuration; // check previous cache age

                if(!isExpired) {
                    setEvents(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                }
            } 
            
            setLoading(true);

            // no cache or expired so retrieve from db and store in browser
            let result = await FetchEvents();
            if(result.success) {
                setEvents(result.events);
                setLoading(false);

                // cache our retrieved data and set the cache timestamp
                localStorage.setItem('events', JSON.stringify(result.events));
                localStorage.setItem('eventsTimestamp', now.toString());
            }
            
        };
        fetchEvents();
    }, []);

    const today = new Date(); // get the current date to sort out our future and past events
    const upcomingEvents = events?.filter(event => new Date(event.date) >= today) || [];
    const pastEvents = events?.filter(event => new Date(event.date) < today) || [];

    return(
        <div>
            {/* Navigation bar at top */}
            <Navbar/>

            <main className='flex-grow mt-27'>
                <section className='text-center container mx-auto max-w-3xl'>
                        <h2 className='text-5xl font-bold text-crimson mb-4'>Events Calendar</h2>
                        <p className='text-xl'>
                            Stay up to date with all SDC events. From technical workshops to industry 
                            speakers, never miss out on an opportunity to develop your skills!
                        </p>
                </section>

                <section className='px-4 mb-10'>
                    <div className='w-full max-w-6xl mx-auto'>
                        {loading ? (
                            <div className='text-center py-12'>
                                <div className='inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-crimson border-r-transparent'/>
                                <p className='mt-4'>Loading events...</p>
                            </div>
                        ) : (
                            <>
                                {/* Upcoming Events */}
                                <Card className='mt-12'>
                                    <CardHeader className='text-center mb-0' >
                                        <CardTitle className='text-3xl font-bold'>Upcoming Events</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {upcomingEvents?.map((event, row) => (
                                        <EventTile 
                                            key={event.id || row}
                                            title={event.title}
                                            date={event.date}
                                            start_time={event.start_time}
                                            end_time={event.end_time}
                                            location={event.location}
                                            details_url={event.details_url}
                                        />
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Past Events */}
                                <Card className='mt-12 bg-gray-100'>
                                    <CardHeader className='text-center' >
                                        <CardTitle className='text-3xl font-bold'>Past Events</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {pastEvents?.map((event, row) => (
                                        <EventTile 
                                            key={event.id || row}
                                            title={event.title}
                                            date={event.date}
                                            start_time={event.start_time}
                                            end_time={event.end_time}
                                            location={event.location}
                                            details_url={event.details_url}
                                            className='bg-gray-50'
                                        />
                                        ))}
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <ClubFooter />
        </div>  
    );
}

function EventTile({ title, date, start_time, end_time, location, details_url, className }: Event) {
    return(
        <Card className={cn('px-6 py-3 my-4 transition-transform duration-150 ease-in-out hover:scale-101 hover:shadow-md', className)}>
            <div className='h-full flex flex-col'>
                <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-xl text-black80 font-bold'>{title}</h2>
                </div>

                <div className='flex items-center gap-2'>
                    <CiCalendar/>
                    <span className='text-black80'>
                        {date}
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <CiClock1/>
                    <span className='text-black80'>
                        {start_time}{end_time ? ` - ${end_time}` : ''}
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <CiLocationOn/>
                    <span className='text-black80'>
                        {location}
                    </span>
                </div>

                <p>{details_url}</p>
            </div>
        </Card>
    );
}

async function FetchEvents() { 
    try {
        const sql = neon(import.meta.env.VITE_DATABASE_URL); // create a sql instance connected to our database through its postrgres url

        const result = await sql`
            SELECT * FROM Events ORDER BY event_date DESC;
        `;

        const formattedData: Event[] = result.map(row => ({
            id: row.event_id,
            title: row.title,
            date: FormatDate(row.event_date),
            start_time: FormatTime(row.start_time),
            end_time: FormatTime(row.end_time),
            location: row.event_loc,
            details_url: row.details_url
        }));

        return {success: true, events: formattedData};
    } catch(error) {
        console.error('Error fetching events from the database:', error);
        return {success: false, events: []};
    }
}

function FormatTime(inputTime: string) {
    if(!inputTime) return ''; // handle the NULL from the database for possible end times

    const [hours, minutes] = inputTime.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'pm' : 'am';
  
    return `${hour12}:${minutes}${ampm}`;
}

function FormatDate(inputDate: string) {
    return new Date(inputDate).toLocaleDateString('en-US', { // format date into 'Month,DD,YYYY'
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}