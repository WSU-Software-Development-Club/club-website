import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';
import { Card } from '@/components/ui/card';
import clubPhoto from '../assets/club_group_picture.jpg';
import defualtPfp from '../assets/default_pfp.png';


export default function Team() {

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

                {/* Dynamic width listing of all leaders */}
                <section className='flex justify-center px-4'>
                    <div className='w-full max-w-6xl'>
                        <div className="grid gap-10 grid-cols-[repeat(auto-fit,_minmax(255px,_1fr))]">
                            <MemberProfile/>
                            <MemberProfile/>
                            <MemberProfile/>
                            <MemberProfile/>
                        </div>
                    </div>
                </section>
            </main>

            <ClubFooter />
        </div>  
    );
}

function MemberProfile() {

    return(
        <Card className='shadow flex flex-col items-center max-w-[255px] gap-0 mb-5'>
            <img src={defualtPfp} className='w-36 h-36 rounded-full object-cover mb-6' />   
            <h2 className='font-bold text-2xl text-gray-800'>First Last</h2>
            <p className='text-lg text-gray-700'>Position</p>
        </Card>
    );
}