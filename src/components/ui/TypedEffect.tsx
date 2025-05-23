import { useEffect, useState } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number; // milliseconds
    blinkDuration?: number; // milliseconds
}

export default function TypingEffect({ text, speed = 50, blinkDuration = 5000 }: TypingEffectProps) {
    const [outputText, setOutputText] = useState('');
    const [solidCursor, setSolidCursor] = useState(true);
    const [blinkingCursor, setBlinkingCursor] = useState(false);
    
    useEffect(() => {
        setOutputText('');
        setSolidCursor(true);

        let index = -1;

        const interval = setInterval(() => { // update our text every x ms
            index++;
            setOutputText(text.substring(0, index));
            if(index >= text.length) {
                setBlinkingCursor(true)
                setSolidCursor(false);
                clearInterval(interval); 
                setTimeout(() => setBlinkingCursor(false), blinkDuration); // duration of blinking '▯'
            }
        }, speed);

        return () => { clearInterval(interval);};
    }, [text]);
    return (
        <p>
            {outputText}
            {(solidCursor) && (<span>▯</span>)}
            {(blinkingCursor) && (<span className='animate-blink'>▯</span>) }
        </p>

    );
}