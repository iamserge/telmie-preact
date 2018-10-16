import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card'

const PhotoCards = ({cards = []}) =>  {

	return (
		<div class={`uk-container uk-container-small uk-container-inner ${style.photoCardsContainer}`}>
			{ cards.map(user => <PhotoCard key={user.id} {...user}/>)}
        </div>
    )
}


export default PhotoCards;