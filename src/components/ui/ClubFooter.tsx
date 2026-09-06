export default function ClubFooter() {
    return(
        <footer className='bg-black90 text-white px-6 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
            {/* Left side of footer */}
            <div>
                <p className='text-md'>© Software Development Club at WSU 2025</p>
                <p className='text-xs'>A student-run organization at Washington State University, Pullman</p>
            </div>

            {/* Right side of footer */}
            <div>
                <p className='text-md'>
                    <span className='font-bold'>Contact Us: </span>
                    <a href='mailto:wsu.software.development.club@gmail.com' className='underline'>
                        wsu.software.development.club@gmail.com
                    </a>
                </p>
            </div>
        </div>
    </footer>
    );
}