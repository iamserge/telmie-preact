import { h, Component } from 'preact';
import style from './style.scss';
import UserVerticalInfo from './user-vertical-info';
import ProTopInfo from './pro-top-info';
import PriceInfo from './price-info';
import YouTube from 'react-youtube';
import Collapse from 'rc-collapse'
import 'rc-collapse/assets/index.css';

export default class Pro extends Component {
	
	render({person, isPro}) {
		const { pro = {} } = person;

		return (
			<div class={style.person}>
				<UserVerticalInfo {...this.props} />

				<div className={style.info}>
					<ProTopInfo person={person} pro={pro} isPro={isPro}/>

					<Collapse accordion={false} defaultActiveKey = {['info', 'call-history']} className={style.description}>
						{ isPro && <Collapse.Panel header={'Info'} key='info'>
							{pro.professionDescription}
							{pro.video && pro.video.length > 0 && (
								<div class={style.videoContainer}>
									<YouTube videoId={ pro.video } />
								</div>
							)}
						</Collapse.Panel> }
						<Collapse.Panel header={'Call history'} key='call-history'>
							Call history
						</Collapse.Panel>
					</Collapse>
				</div>

				{ isPro && <PriceInfo pro={pro} isPro={isPro} {...this.props}/> }
				
			</div>
		)
	}
}
