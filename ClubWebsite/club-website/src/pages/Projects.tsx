import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { neon } from '@neondatabase/serverless';
import { FaGithub } from 'react-icons/fa'; // used for all our media svg files
import Navbar from '@/components/ui/Navbar';
import StatusIndicator from '@/components/ui/StatusIndicator';

interface Project {
    id?: number;
    name: string;
    summary: string;
    description: string;
    repoUrl: string;
    completed: boolean;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>();

    useEffect(() => {
        const fetchProjects = async () => {
            let result = await FetchProjects();
            if(result.success) {
                setProjects(result.projects);
            }
        };
        fetchProjects();
    });

    return(
        <div>
            {/* Navigation bar at top */}
            <Navbar/>

            <main className='flex-grow mt-15'>

                {/* Tile layout of clubs projects */}
                <section className='flex justify-center px-4 mb-10'>
                    <div className='w-full max-w-6xl'>
                        <div className='mt-12 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {projects?.map((project, row) => (
                                <ProjectTile 
                                    key={project.id || row}
                                    name={project.name}
                                    summary={project.summary}
                                    description={project.description}
                                    repoUrl={project.repoUrl}
                                    completed={project.completed}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className='bg-black90 text-center'>
                <p className='text-white'>© Software Development Club at WSU 2025</p>
            </footer>
        </div>  
    );
}

function ProjectTile({ name, summary, description, repoUrl, completed }: Project) {
    return(
        <Card className='px-6'>
            <div className='h-full flex flex-col'>
                <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-xl text-black80 font-bold'>{name}</h2>
                    <StatusIndicator completed={completed}/>
                </div>
                
                <p className='text-crimson'>{summary}</p>
                <p className='text-black80 grow mt-4'>{description}</p>
                <button 
                    className='bg-black90 text-white hover:bg-black80 py-2 rounded-md cursor-pointer mt-4'
                    onClick={() => window.open(repoUrl, '_blank')}
                >
                    <FaGithub size={23} className='inline-block mr-2'/>
                    View GitHub Repository
                </button>
            </div>
        </Card>
    );
}

async function FetchProjects() { 
    try {

        console.log(import.meta.env.DATABASE_URL)

        const sql = neon(import.meta.env.VITE_DATABASE_URL); // create a sql instance connected to our database through its postrgres url

        const result = await sql`
            SELECT id, name, summary, description, repo_url, (end_date IS NOT NULL) AS complete
            FROM Projects
            ORDER BY complete ASC, start_date DESC;
        `;

        const formattedData: Project[] = result.map(row => ({
            id: row.id,
            name: row.name,
            summary: row.summary,
            description: row.description,
            repoUrl: row.repo_url,
            completed: row.complete
        }));

        return {success: true, projects: formattedData};
    } catch(error) {
        console.error('Error fetching projects from the database:', error);
        return {success: false, projects: []};
    }
}