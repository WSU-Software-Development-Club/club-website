import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { neon } from '@neondatabase/serverless';
import { FaGithub, FaDocker } from 'react-icons/fa'; // used for all our media svg files
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';
import StatusIndicator from '@/components/ui/StatusIndicator';

interface Project {
    id?: number;
    name: string;
    summary: string;
    description: string;
    repoUrl: string;
    dockerUrl: string;
    completed: boolean;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            let result = await FetchProjects();
            if(result.success) {
                setProjects(result.projects);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    return(
        <div>
            {/* Navigation bar at top */}
            <Navbar/>

            <main className='flex-grow mt-15'>

                {/* Tile layout of clubs projects */}   
                {/* TODO: Add a loading animation while projects are being fetched */}   
                <section className='flex justify-center px-4 mb-10'>
                    <div className='w-full max-w-6xl'>
                        {loading ? (
                            <div className='text-center py-12'>
                                <div className='inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-crimson border-r-transparent'/>
                                <p className='mt-4'>Loading projects...</p>
                            </div>
                        ) : (
                            <div className='mt-12 grid grid-cols-1 gap-4 md:grid-cols-2'>
                                {projects?.map((project, row) => (
                                    <ProjectTile 
                                        key={project.id || row}
                                        name={project.name}
                                        summary={project.summary}
                                        description={project.description}
                                        repoUrl={project.repoUrl}
                                        dockerUrl={project.dockerUrl}
                                        completed={project.completed}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <ClubFooter />
        </div>  
    );
}

function ProjectTile({ name, summary, description, repoUrl, dockerUrl, completed }: Project) {
    return(
        <Card className='px-6'>
            <div className='h-full flex flex-col'>
                <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-xl text-black80 font-bold'>{name}</h2>
                    <StatusIndicator completed={completed}/>
                </div>
                
                <p className='text-crimson'>{summary}</p>
                <p className='text-black80 grow mt-4'>{description}</p>
                {repoUrl && (
                    <button 
                        className='bg-black90 text-white hover:bg-black80 py-2 rounded-md cursor-pointer mt-4'
                        onClick={() => window.open(repoUrl, '_blank')}
                    >
                        <FaGithub size={23} className='inline-block mr-2'/>
                        View GitHub Repository
                    </button>
                )}
                {dockerUrl && (
                    <button 
                        className='bg-black90 text-white hover:bg-black80 py-2 rounded-md cursor-pointer mt-4'
                        onClick={() => window.open(dockerUrl, '_blank')}
                    >
                        <FaDocker size={23} className='inline-block mr-2'/>
                        View on Docker Hub
                    </button>
                )}
            </div>
        </Card>
    );
}

async function FetchProjects() { 
    try {
        const sql = neon(import.meta.env.VITE_DATABASE_URL); // create a sql instance connected to our database through its postrgres url

        const result = await sql`
            SELECT project_id, name, summary, description, repo_url, docker_url, (end_date IS NOT NULL) AS complete
            FROM Projects
            ORDER BY complete ASC, start_date DESC;
        `;

        const formattedData: Project[] = result.map(row => ({
            id: row.project_id,
            name: row.name,
            summary: row.summary,
            description: row.description,
            repoUrl: row.repo_url,
            dockerUrl: row.docker_url,
            completed: row.complete
        }));

        return {success: true, projects: formattedData};
    } catch(error) {
        console.error('Error fetching projects from the database:', error);
        return {success: false, projects: []};
    }
}