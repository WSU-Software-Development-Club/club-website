import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';

export default function About() {

    return(
        <div>
            <Navbar/>
    
            <main className='flex-grow mt-25'>
                {/* Description + Smaller image */}
                <section>

                </section>

                {/* More in depth description / list */}
                <section>
                    <div className='flex justify-center px-4 py-2'>
                        <Card className='w-6xl shadow-md'>
                        <CardContent>
                            <h1 className='text-2xl font-bold mb-4 text-black80'> What do we do? </h1>
                            <p className='text-lg text-black80 pl-8'>
            
                            </p>
                            <ul className='text-lg text-black80 pl-16 list-disc'>
                                <li>
                                    <strong>Team Projects: </strong> 
                                    Develop large-scale,semester-long software projects. 
                                    We offer a range of project difficulties so members of 
                                    all skill levels can contribute that matches both their 
                                    interests and skills.
                                </li>
                                <li>
                                    <strong>Workshops & Demos: </strong>  
                                    Host weekly workshop sessions that allow members to learn
                                    and gain hands-on experience with industry tools and technologies
                                    that may not typically be covered in class.
                                </li>
                            </ul>

                        </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <ClubFooter />
        </div>  
    );
}