import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card';
import PhotoCardsCol from './photo-card/photo-cards-col'

class PhotoCards extends Component{

	componentWillMount(){
		this.randomArr = [0, 129, 78, 0];

		/*for (let i = 0; i < 4; i++){
			this.randomArr = [...this.randomArr, Math.floor(Math.random() * 440 - 220)]
		}*/
	}

	renderCards = (cards) => (
		cards.map((card, index) => (
			Array.isArray(card) ? 
				<PhotoCardsCol cards={card} cardStyle={{marginTop: this.randomArr[index]}}/> 
				: <PhotoCard key={card.id} {...card} cardStyle={{marginTop: this.randomArr[index]}}/>
		))
	)

	render(){
		const {cards = {}, styles = {}} = this.props;
		const {side1 = [], side2 =[]} = cards;

		return (
			<div class={style.photoCardsContainer}
				style={styles}>
				{ this.renderCards(side1) }
				<div class={style.videoWrapper}>
					<div class={style.videoContainer}>
						<video class={style.video} autoPlay loop muted>
							{/*<source src="http://sr461.2dayhost.com/IMG_3531.TRIM.MOV" type="video/mp4"/>*/}
							<source src='https://r3---sn-4g5e6nsd.c.youtube.com/videoplayback?cp=U0pSTllQUl9OTkNQMl9RSlZJOm1zZ2hoNzlreGhj&gir=yes&lmt=1539933230387789&sc=yes&expire=1539954894&ratebypass=yes&ipbits=0&clen=1012618&sparams=clen%2Ccp%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csc%2Csource%2Cexpire&requiressl=yes&mime=video%2Fmp4&txp=2211222&initcwndbps=6152500&c=WEB&fvip=3&itag=18&dur=20.526&source=youtube&pl=24&ei=boTJW-r8HoGK-gaXhZywBQ&id=o-AIJMBT_jrHwXGzKBdjzersSk2JQuTvsOtJpkAxtANOW7&ms=nxu%2Conr&mt=1539933161&mv=m&mm=30%2C26&signature=971A57C8D3F8F5F4708164D3E337B164753FB67E.85BD2948D6E06127B01921B2F5D9B1250E915CE9&mn=sn-4g5e6nsd%2Csn-2gb7sn7s&key=yt6&ip=93.171.161.205&cpn=g4i-oGQBlxOUATew&cver=2.20181017&ptk=youtube_none&pltype=contentugc' type="video/mp4"/>
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
				{ this.renderCards(side2) }
			</div>
		)
	}
}

export default PhotoCards;