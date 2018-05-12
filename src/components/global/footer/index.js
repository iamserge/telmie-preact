import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

export default class Footer extends Component {
	render() {
		return (
			<footer id={style.footer} className='uk-navbar uk-navbar-container'>
				<div className="uk-navbar-left" id={style.left}>
					<Link href="/" id={style.logo}>
						<img src="/assets/logo.png" alt="Telmie App" />
					</Link>
					<span>Copyright &copy;2017 Grandier Developments Ltd, London, UK</span>
				</div>
				<div className="uk-navbar-right"  id={style.right}>
					<nav>
						<ul className="uk-navbar-nav" id={style.footerLinks}>
							<li><Link href="/">Home</Link></li>
							<li><Link href="/about-us">About us</Link></li>
							<li><Link href="/faq">FAQ</Link></li>
							<li><Link href="/terms">Terms</Link></li>
							<li><Link href="/privacy">Privacy</Link></li>
							<li><Link href="/contacts">Contacts</Link></li>
						</ul>
					</nav>
				</div>
			</footer>
		);
	}
}
