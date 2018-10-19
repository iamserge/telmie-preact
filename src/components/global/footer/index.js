import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { routes } from '../../app'

const socialNetworksArr = ['facebook','linkedin','twitter','instagram'/*,'medium'*/,'youtube'];
const socialNetworks = {
	facebook: {
		icon: '/assets/icons/f-19x19.png',
		link: 'https://www.facebook.com/telmie.pro/',
	},
	linkedin: {
		icon: '/assets/icons/in-19x19.png',
		link: 'https://www.linkedin.com/company/telmie',
	},
	twitter: {
		icon: '/assets/icons/tw-38×32.png',
		link: 'https://twitter.com/TelmieUK',
	},
	instagram: {
		icon: '/assets/icons/inst-20x20.png',
		link: 'https://www.instagram.com/telmieuk/',
	},
	/*medium: {
		icon: '/assets/icons/m-40×28.png',
		link: '',
	},*/
	youtube: {
		icon: '/assets/icons/yt-46×34.png',
		link: 'https://www.youtube.com/channel/UCwphxwpZoBIT6Eg7_FFVzQQ',
	},
}

export default class Footer extends Component {
	onIconClick = (e) => {
		const {alt} = e.target;
		alt && window.open(socialNetworks[alt].link);
	}
	render() {
		return (
			<footer id={style.footer} className='uk-navbar uk-navbar-container'>
				<div className="uk-navbar-left" id={style.left}>
					<Link href={routes.HOME} id={style.logo}>
						<img src="/assets/logo.png" alt="Telmie App" />
					</Link>
					<div class={style.copyright}>Copyright &copy;2018 TELMIE UK LTD., London, UK</div>
				</div>
				<div className="uk-navbar-right"  id={style.right}>
					<nav id={style.footerLinks}>
						<ul className="uk-navbar-nav" >
							<li><Link href={routes.HOME}>Home</Link></li>
							{/*<li><Link href={routes.ABOUT_US}>Company</Link></li>*/}
							{/*<li><Link href={''}>Testimonials</Link></li>*/}
							<li><Link href={routes.CONTACT_US_LINK}>Contact</Link></li>
							{/*<li><Link href={''}>Blog</Link></li>*/}
							<li><Link href={routes.TERMS}>Terms</Link></li>
							{/*<li><Link href={''}>Help</Link></li>*/}
							<li><Link href={routes.PRIVACY}>Privacy Policy</Link></li>
							<li><Link href={routes.FAQ}>FAQ</Link></li>
						</ul>
					</nav>
					<div class={style.socialIcons}>
						{socialNetworksArr.map(el => (
							<img src={socialNetworks[el].icon} key={el} onClick={this.onIconClick} alt={el}/>
						))}
					</div>
				</div>
			</footer>
		);
	}
}
