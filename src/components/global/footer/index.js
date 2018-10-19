import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { routes } from '../../app'

export default class Footer extends Component {
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
						<img src='/assets/icons/f-19x19.png' alt='facebook'/>
						<img src='/assets/icons/in-19x19.png' alt='linkedin'/>
						<img src='/assets/icons/tw-38×32.png' alt='twitter'/>
						<img src='/assets/icons/inst-20x20.png' alt='instagram'/>
						<img src='/assets/icons/m-40×28.png' alt='medium'/>
						<img src='/assets/icons/yt-46×34.png' alt='youtube'/>
					</div>
				</div>
			</footer>
		);
	}
}
