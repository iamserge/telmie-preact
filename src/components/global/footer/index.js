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
					<span>Copyright &copy;2017 Grandier Developments Ltd, London, UK</span>
				</div>
				<div className="uk-navbar-right"  id={style.right}>
					<nav>
						<ul className="uk-navbar-nav" id={style.footerLinks}>
							<li><Link href={routes.HOME}>Home</Link></li>
							<li><Link href={routes.ABOUT_US}>About us</Link></li>
							<li><Link href={routes.FAQ}>FAQ</Link></li>
							<li><Link href={routes.TERMS}>Terms</Link></li>
							<li><Link href={routes.PRIVACY}>Privacy</Link></li>
							<li><Link href={routes.CONTACT_US}>Contacts</Link></li>
						</ul>
					</nav>
				</div>
			</footer>
		);
	}
}
