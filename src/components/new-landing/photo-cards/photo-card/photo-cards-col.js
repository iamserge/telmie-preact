import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './index.js';

const PhotoCardsCol = ({cards = [], cardStyle = {}}) =>  {

	return (
		<div class={style.photoCardCol} style={cardStyle}>
			{cards.map(card => [<PhotoCard key={card.id} {...card}/>, <br/>])}
        </div>
    )
}


export default PhotoCardsCol;