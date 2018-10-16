import { h, Frarment } from 'preact';

const Hr = ({color = "black", width = "100%", margin = 0}) => {

    return (
        <div style={{
            width, 
            backgroundColor: color, 
            height: 2,
            margin: `${margin}px auto`,
        }} />
	)
}

export default Hr;