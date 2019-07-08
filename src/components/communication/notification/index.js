import { h } from 'preact';
import style from './style.scss';

const Call = ({ isShown, onClick }) => {
    
    return isShown && (<div class={style.notification} onClick={onClick}>
        Call will be finished automatically in 60 sec.
    </div>)
};

export default Call;