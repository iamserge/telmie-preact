import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Carousel from 'nuka-carousel';
import FeaturedPro from '../featured-pro';


export default class FeaturedPros extends Component {
	constructor(props) {
		super(props);
		this.state = {
			youtubePlayerStop: []
		}
		super(props);
		this.videoStarted = this.videoStarted.bind(this);
	}
	videoStarted(player){
		if (this.state.youtubePlayerStop.length > 0) {
			this.state.youtubePlayerStop[0]();
		}
		
		this.setState({
			youtubePlayerStop: [player]
		})
	}
	extractProInfo(pro){
		let proInfo = pro.name_profession_videoid_userid.split('_');
		return {
			name: proInfo[0],
			profession: proInfo[1],
			videoId: proInfo[2],
			userId: proInfo[3]
		}
	}


	render() {
		return (
			<div className={style.featuredPros}>
				<div  className="uk-container uk-container-small uk-container-inner" >
					<h2>Featured Pros</h2>
				</div>
				<div  className="uk-container uk-container-full uk-container-inner" >
					<Carousel slidesToShow={window.innerWidth > 880 ? 5 : 2} initialSlideHeight ={300} >
						{ this.props.pros.map((pro) => (
							<FeaturedPro pro = { this.extractProInfo(pro) } videoStarted = { this.videoStarted }/>
						))}
					</Carousel>
				</div>

			</div>
		)
	}
}
