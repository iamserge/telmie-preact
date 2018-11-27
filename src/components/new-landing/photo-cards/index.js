import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card';
import PhotoCardsCol from './photo-card/photo-cards-col'
import FontAwesome from 'react-fontawesome';

class PhotoCards extends Component{

	componentWillMount(){
		this.randomArr = [0, 129, 78, 0];

		/*for (let i = 0; i < 4; i++){
			this.randomArr = [...this.randomArr, Math.floor(Math.random() * 440 - 220)]
		}*/
	}

	renderCards = (cards, startIndex = 0) => (
		cards.map((card, index) => (
			Array.isArray(card) ? 
				<PhotoCardsCol cards={card} cardStyle={{marginTop: this.randomArr[index + startIndex]}}/> 
				: <PhotoCard key={card.id} {...card} cardStyle={{marginTop: this.randomArr[index + startIndex]}}/>
		))
	)

	render(){
		const {cards = {}, styles = {}} = this.props;
		const {side1 = [], side2 =[]} = cards;

		return (
			<div class={`${style.photoCardsWrapper}`}>
				<div class={`${style.photoCardsContainer}`}
					style={styles}>
					{ this.renderCards(side1) }
					<div class={style.videoWrapper}>
						<img src='assets/new-landing-page/group2.png' class={style.settingsBtns}/>
						<img src='assets/new-landing-page/callButton.png' class={style.callBtn}/>
						<div class={style.videoContainer}>
							<video class={style.video} playsinline autoPlay loop muted poster='https://pp.userapi.com/c847121/v847121092/10d341/XfReogvSWv4.jpg'>
								<source src='/video/new_video.mp4' type="video/mp4"/>
								Your browser does not support the video tag.
							</video>
						</div>
					</div>
					{ this.renderCards(side2, 2) }
				</div>
			</div>
		)
	}
}

export default PhotoCards;