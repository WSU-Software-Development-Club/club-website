interface  StatusIndicatorProps{
    completed: boolean;
}

// Status indicator used on the progects tiles to indicate its current state (currenly only allows two states)
export default function StatusIndicator({completed}: StatusIndicatorProps) {
    return(
        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0 ${completed ? 'bg-wsu_red/70' : 'bg-gray/50'}`}>
            <span className={`w-2 h-2 rounded-full ${completed ? 'bg-wsu_red' : 'bg-gray animate-pulse'}`}/>
            <span className='text-white text-xs font-semibold'>
                {completed ? 'Complete' : 'In Progress'}
            </span>
        </div>
    );
}
