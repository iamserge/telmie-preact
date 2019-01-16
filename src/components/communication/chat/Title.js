import { h } from 'preact';
import { apiRoot } from '../../../api';
import PriceItem from '../../profile/transactions/balance-item'
import callBtn from '../../../assets/callButton.png'
import style from './style.scss';

const Title = (props) => {
    const { name = '', lastName = '', pro = {}, avatar } = props.person;
    const { costPerMinute = '', professionDescription = '' } = pro;

    return (<div class={style.title}>
        <div class={style.image}>
            { (avatar != null) ? (
                <img src={apiRoot + 'image/' + avatar.id} alt={name + ' ' + lastName} />
            ) : (
                <img src="/assets/nouserimage.jpg" alt={name + ' ' + lastName} />
            )}
        </div>
        <div class={style.info}>
            <div class={style.name}>{`${name} ${lastName}`}</div>
            <div class={style.profession}>{professionDescription}</div>
            <div></div>
        </div>
        <PriceItem balance={costPerMinute} text='min' className={style.priceItem}/>
        <div class={style.callBtn}>
            <img src={callBtn} />
        </div>
    </div>)
};

export default Title;