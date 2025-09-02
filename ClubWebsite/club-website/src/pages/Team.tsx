import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';
import { neon } from '@neondatabase/serverless';
import { Card } from '@/components/ui/card';
import clubPhoto from '../assets/club_group_picture.jpg';
import defualtPfp from '../assets/default_pfp.png';

interface TeamMember {
    id?: number;
    name: string;
    position: string;
    pictureUrl: string;
}

export default function Team() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            let result = await FetchTeamMembers();
            if(result.success) {
                setTeamMembers(result.teamMembers);
            }
            setLoading(false);
        };
        fetchMembers();
    }, []);

    return(
        <div>
            <Navbar/>

            <main className='flex-grow mt-25'>
                <section>
                    {/* Group picture */}
                    <div className='flex justify-center px-4 py-2'>
                        <div className='w-full max-w-6xl'>
                            <Card className='shadow-md p-2'>
                                <div className='w-full rounded-md overflow-hidden'>
                                    <img
                                    src={clubPhoto}
                                    alt='Group Picture'
                                    className='w-full h-auto rounded-md'
                                    />
                                </div>  
                            </Card>
                        </div>
                    </div>
        
                    {/* Team page description */}
                    <div className='flex justify-center px-4 py-2'>
                        <div className='w-full max-w-6xl'>
                            <h1 className='text-3xl font-bold text-black80'>Our Team</h1>
                        </div>
                    </div>   
                </section>

                {/* Dynamic width listing of all club leaders */}
                {loading ? (
                    <div className='text-center py-12'>
                        <div className='inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-crimson border-r-transparent'/>
                        <p className='mt-4'>Loading team members...</p>
                    </div>
                ) : (
                    <section className='flex justify-center px-4'>
                        <div className='w-full max-w-6xl'>
                            <div className='grid gap-10 grid-cols-[repeat(auto-fit,_minmax(255px,_1fr))]'>
                                {teamMembers?.map((member, row) => (
                                    <MemberProfile 
                                        key={member.id || row}
                                        name={member.name}
                                        position={member.position}
                                        pictureUrl={member.pictureUrl}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <ClubFooter />
        </div>  
    );
}

function MemberProfile({ name, position, pictureUrl }: TeamMember) {
    return(
        <Card className='shadow flex flex-col items-center max-w-[255px] gap-0 mb-5'>
            <img src={pictureUrl || defualtPfp} className='w-36 h-36 rounded-full object-cover mb-6' />   
            <h2 className='font-bold text-2xl text-gray-800'>{name}</h2>
            <p className='text-lg text-gray-700'>{position}</p>
        </Card>
    );
}

async function FetchTeamMembers() {
    try {
        const sql = neon(import.meta.env.VITE_DATABASE_URL); // create a sql instance connected to our database through its postrgres url

        const result = await sql`
            SELECT 
                tm.member_id,
                CONCAT(tm.first_name, ' ', tm.last_name) name,
                cp.title,
                tm.picture_url
            FROM team tm 
            JOIN club_positions cp ON tm.position_id = cp.position_id
            ORDER BY tm.position_id ASC;
        `;

        const formattedData: TeamMember[] = result.map(row => ({
            id: row.member_id,
            name: row.name,
            position: row.title,
            pictureUrl: row.picture_url,
        }));

        return {success: true, teamMembers: formattedData};
    } catch(error) {
        console.error('Error fetching team memvers from the database:', error);
        return {success: false, teamMembers: []};
    }
}
