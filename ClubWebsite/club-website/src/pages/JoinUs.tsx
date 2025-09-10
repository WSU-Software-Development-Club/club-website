import { FaDiscord } from 'react-icons/fa'; // used for all our media svg files
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';

export default function JoinUs() {
    return(
        <div>
            <Navbar/>
    
            <main className='flex-grow mt-25'>
                <section className='flex justify-center px-4 mb-10'>
                    <div className='w-full max-w-6xl'>
                        <Card className='max-w-6xl mb-4 shadow-md'>
                            <CardContent>
                                <h1 className='text-2xl font-bold mb-4 text-black80'> What do we do? </h1>
                                <ul className='text-lg text-black80 pl-16 list-disc'>
                                    <li>
                                        <strong>Team projects: </strong> 
                                        Develop large-scale,semester-long software projects. 
                                        We offer a range of project difficulties so members of 
                                        all skill levels can contribute to projects that match their 
                                        interests and skill levels.
                                    </li>
                                    <li>
                                        <strong>Workshops & demos: </strong>  
                                        Host weekly workshop sessions that allow members to learn about
                                        and gain hands-on experience with industry tools and technologies
                                        that may not typically be covered in class.
                                    </li>
                                    <li>
                                        <strong>Project showcases: </strong>  
                                        End of semester presentations in which completed projects are showcased to the club and invited guests.
                                    </li>
                                </ul>

                                <h1 className='text-2xl font-bold m-4 text-black80'> Why Join? </h1>
                                <ul className='text-lg text-black80 pl-16 list-disc'>
                                    <li>
                                        Learn and grow as a software developer through hands-on experience.
                                    </li>
                                    <li>
                                        Build a portfolio with large scale, real-world projects.
                                    </li>
                                    <li>
                                        Collaborate with fellow members and learn professional development workflows.
                                    </li>
                                    <li>
                                        Network with fellow students and alumni in the software community.
                                    </li>
                                </ul>

                                <h1 className='text-2xl font-bold m-4 text-black80'> Meeting Information </h1>
                                <ul className='text-lg text-black80 pl-16 list-disc'>
                                    <li>
                                        <strong>When: </strong> 
                                        Every Tuesday, 5:30 PM - 6:30 PM
                                    </li>
                                    <li>
                                        <strong>Where: </strong>  
                                        Meetings are usually held in Spark 212 but locations may change so stay updated for changes
                                    </li>
                                    <li>
                                        <strong>What: </strong> 
                                        Mix of workshops, project meetings, and presentations.
                                    </li>
                                    <li>
                                        <strong>Stay updated: </strong> 
                                        Join our <a href='https://discord.com/invite/ZmcwBPUj9B' 
                                            target='_blank'
                                            rel='noopener noreferrer' 
                                            className='text-crimson font-semibold hover:underline'>
                                                Discord
                                            </a> for weekly announcements regarding meeting locations and format.
                                    </li>
                                </ul>

                                <h1 className='text-2xl font-bold m-4 text-black80'> Who Can Join? </h1>
                                <ul className='text-lg text-black80 pl-16 list-disc'>
                                    <li>
                                        <strong>All skill levels are welcome: </strong> 
                                        From beginner to experienced developers, there is a always place for you to contribute!
                                    </li>
                                    <li>
                                        <strong>Any major: </strong> 
                                        Students of all majors are welcome!
                                    </li>
                                    <li>
                                        <strong>Any level of commitment: </strong> 
                                        Pick up or add features to projects as your shedule allows!
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className='max-w-6xl shadow-md'>
                            <CardContent className='text-center'>
                                <h2 className='text-4xl font-bold text-crimson mb-4'>Ready to Join Us?</h2>
                                <p className='text-lg text-black80'>
                                    Become part of one of WSU's newest programming clubs. 
                                    Connect with like-minded students and grow as a software 
                                    developer by working on large-scale projects!
                                </p>
                                <button 
                                    className='bg-black90 text-white hover:bg-black80 px-4 py-2 rounded-md cursor-pointer mt-4' 
                                    onClick={() => window.open('https://discord.com/invite/ZmcwBPUj9B', '_blank')}>  
                                    Join our Discord
                                </button>
                            </CardContent>
                         </Card>
                    </div>
                </section>
            </main>

            <ClubFooter />
        </div>
    );
}