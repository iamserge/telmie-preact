import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card'

const PhotoCards = ({cards = [], styles = {}}) =>  {

	return (
		<div class={`uk-container uk-container-small uk-container-inner ${style.photoCardsContainer}`}
			style={styles}>
			{ cards.map(user => <PhotoCard key={user.id} {...user}/>)}
        </div>
    )
}


export default PhotoCards;