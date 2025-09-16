import { FaDiscord, FaGithub, FaInstagram } from 'react-icons/fa'; // used for all our media svg files
import homepageBanner from '../assets/home_banner.jpeg';
import Navbar from '@/components/ui/Navbar';
import ClubFooter from '@/components/ui/ClubFooter';

export default function Home() {

    const mailchimpUrl = 'https://mailchi.mp/554b66026425/subscribe-wsu-sdc-newsletter';

    const openNewsletterUrl = () => {
        window.open(mailchimpUrl, '_blank', 'noopener,noreferrer')
    }

    return(
        <div>
            {/* Navigation bar at top */}
            <Navbar/>

            {/* Main content */}
            <main className='flex-grow'>
                {/* Banner image TODO: could become some sort of reactive / animation thay fits a little better with the style*/}
                <section className='relative py-0 overflow-hidden'>
                        <img 
                            src={homepageBanner} 
                            style={{ width: '100%', height: '375px', objectFit: 'cover', objectPosition: 'center top' }}
                            alt='Software Development Club logo' 
                        />
                </section>

                {/* Short club description + platforms */}
                <section className='py-16 px-6'>
                    <div className='container mx-auto max-w-3xl'>
                        <h1 className='text-2xl font-bold text-center mb-5 text-black80'>
                            Connecting students with real-world software experience
                        </h1>
                        <p className='text-lg text-center text-black80'>
                            The Software Development Club at Washington State University is a growing 
                            student organization focused on developing software applications in a 
                            collaborative environment that mirros real-world development teams. Our goal
                            is to equip students with relevant tools, technologies, and skills widely used 
                            in the software industry through weekly workshops and large-scale team projects.
                            Our weekly meetings are open to everyone, regardless of major or experience!
                        </p>
                    </div>
                    
                    {/* platforms */}
                    <div className='container mx-auto flex justify-center space-x-6 py-6'>
                        <a href='https://discord.com/invite/ZmcwBPUj9B' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-crimson hover:text-black80 transition-colors'>
                            <FaDiscord size={40} />
                        </a>
                        <a  href='https://github.com/WSU-Software-Development-Club' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-crimson hover:text-black80 transition-colors'>
                            <FaGithub size={40} />
                        </a>
                        <a href='https://www.instagram.com/sdc.wsu/' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-crimson hover:text-black80 transition-colors'>
                            <FaInstagram size={40} />
                        </a>
                    </div>
                </section>

                {/* Newsletter sign up banner */}
                <section className='bg-crimson w-full flex flex-col sm:flex-row justify-center 
                    items-center space-y-4 sm:space-y-0 sm:space-x-6 py-6 mt-[-2rem]'>
                    <span className='text-white text-2xl font-semibold mx-5 text-center sm:text-left'>
                        Want to stay updated on our current projects?
                    </span>
                    <button 
                        className='bg-black90 text-white hover:bg-black80 px-4 py-2 rounded-md cursor-pointer mx-5' 
                        onClick={openNewsletterUrl}>
                        Join our Mailing List
                    </button>
                </section>
            </main>
            
            <ClubFooter />
        </div>
    );
}
