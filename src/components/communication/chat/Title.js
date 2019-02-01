import { h } from 'preact';
import { apiRoot } from '../../../api';
import PriceItem from '../../profile/transactions/balance-item'
import callBtn from '../../../assets/btnCallStart.png'
import style from './style.scss';

const Title = (props) => {
    console.log(props);
    const { name = '', lastName = '', pro, avatar } = props.person;
    const { costPerMinute = '', professionDescription = '' } = pro ? pro : {};
    const fullName = `${name} ${lastName}`;

    return (<div class={style.title}>
        <div class={style.image}>
            { avatar ? (
                <img src={apiRoot + 'image/' + avatar.id} alt={fullName} />
            ) : (
                <img src="/assets/nouserimage.jpg" alt={fullName} />
            )}
        </div>
        <div class={style.info}>
            <div class={style.name}>{fullName}</div>
            <div class={style.profession}>{professionDescription}</div>
            <div></div>
        </div>

        <PriceItem balance={costPerMinute} text='min' className={style.priceItem}/>
        
        <div class={style.callBtn} onClick={() => {}}>
            <img src={callBtn} />
        </div>
    </div>)
};

export default Title;