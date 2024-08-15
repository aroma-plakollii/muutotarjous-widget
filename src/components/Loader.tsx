import * as React from 'react';
interface ILoaderProps {
    className?: string,
    color?: string,
    width?: number
}

export default function (props: ILoaderProps) {
    return (
        <div style={{ width: props.width || 25, height: props.width || 25 }} className={"loader " + (props.className || '')}>
            <svg className="loader__circular" viewBox="25 25 50 50">
                <circle style={{ stroke: props.color || 'white' }} className="loader__path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
            </svg>
        </div>
    )
}
