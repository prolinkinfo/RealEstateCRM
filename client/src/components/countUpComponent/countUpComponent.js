import React, { useState, useEffect } from 'react';

function CountUpComponent({ targetNumber }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (count < targetNumber) {
                setCount(prevCount => prevCount + 1);
            }
        }, targetNumber > 500 ? 0 : 20); // Change the interval duration as needed (in milliseconds)

        return () => {
            clearInterval(interval);
        };
    }, [count, targetNumber]);

    return <span>{typeof targetNumber === "number" ? count : targetNumber}</span>
}

export default CountUpComponent;
