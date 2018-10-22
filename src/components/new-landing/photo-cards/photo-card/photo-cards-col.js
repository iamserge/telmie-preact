import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './index.js';

const PhotoCardsCol = ({cards = []}) =>  {

	return (
		<div class={style.photoCardCol}>
			{cards.map(card => [<PhotoCard key={card.id} {...card}/>, <br/>])}
        </div>
    )
}


export default PhotoCardsCol;