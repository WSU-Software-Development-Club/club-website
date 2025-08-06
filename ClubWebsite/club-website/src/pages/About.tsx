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
                            <h1 className='text-2xl font-bold mb-5 text-black80'> What do we do? </h1>
                            <p className='text-lg text-black80 pl-8'>Hello</p>
                            <ul className='text-lg text-black80 pl-16 list-disc'>
                                <li>
                                    Milk
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