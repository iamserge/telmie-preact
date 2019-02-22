import { h, Component } from 'preact';
import style from './style.scss';
import Card from "../card"
import FontAwesome from 'react-fontawesome';
import AccSettings from "./accaunt-settings";
import CreditCard from "../credit-card";
import { route } from "preact-router";
import { apiRoot } from "../../api";
import { changeDateISOFormat } from '../../utils/index'
import { routes } from '../app';

class GeneralTab extends Component{
    constructor(props){
        super(props);

        this.state = {
            switched: true,
            loadingSettings: false,
        }
    }

    componentDidMount(){
        this.props.getCards();
    }

    componentWillReceiveProps(nextProps){
        this.setState({ loadingSettings: false, })
    }

    onEdit = () => route(routes.EDIT_PROFILE);

    onSwitchEmail = () => {
		this.setState({loadingSettings: true});
		this.props.switchEmailNotif();
	}
	onSwitchWorkPro = () => {
		this.setState({loadingSettings: true});
		this.props.switchWorkingPro();
    }

    renderGeneralInfo = () => {
        const {userData = {}} = this.props;
        const {name, lastName, email, dateOfBirth, location } = userData;
        const {city, line1, postCode, country} = location ? JSON.parse(location) : {};

        return (
            <div class = {style.userInfo}>
                <div>
                    <span className={style.key}>Name:</span>
                    <span className={style.value}>{name}</span>
                </div>
                <div>
                    <span className={style.key}>Last name:</span>
                    <span className={style.value}>{lastName}</span>
                </div>
                <div>
                    <span className={style.key}>Email:</span>
                    <span className={style.value}>{email}</span>
                </div>
                <div>
                    <span className={style.key}>Date of birth:</span>
                    <span className={style.value}>{ dateOfBirth ? changeDateISOFormat(dateOfBirth) : 'TBC' }</span>
                </div>

                <div>
                    <span className={style.key}>Address</span>
					<span className={style.value}>{(line1 != null) ? line1 : 'TBC'}</span>
				</div>

				<div>
                    <span className={style.key}>City</span>
					<span className={style.value}>{(city != null) ? city : 'TBC'}</span>
				</div>
				<div>
                    <span className={style.key}>Post Code</span>
					<span className={style.value}>{(postCode != null) ? postCode : 'TBC'}</span>
				</div>
            </div>
        )
    }

    render(){
        const {userData = {}, creditCards = {}} = this.props;
        const {name, lastName, avatar } = userData;
        const {loading, cards, error, errorMsg} = creditCards;

    
        return (
            <div class={style.contentContainer}>
                <Card class= {style.userInfoCard}>
                    <div class={style.editBtn} onClick={this.onEdit}>
                        Edit <FontAwesome name="pencil" />
                    </div>
                    <div className={style.userAvatar}>
                        <div className={style.image}>
                            { (avatar != null) ? (
                                <img src={apiRoot + 'image/' + avatar.id} alt={name + ' ' + lastName} />
                            ) : (
                                <img src="/assets/nouserimage.jpg" alt={name + ' ' + lastName} />
                            )}
                        </div>
                    </div>
    
                    {this.renderGeneralInfo()}
                </Card>

                <Card headerText='Credit card'>
                    {loading ? 
                        <div class={style.noCards}>Loading cards</div> 
                        : !error && (
                            cards.length ? 
                                cards.map(card => (<CreditCard {...card} key={card.token}
                                    addCard={this.props.addCard} 
                                    deleteCard={this.props.deleteCard}/>))
                                : <div class={style.noCards}>
                                    No cards. <span onClick={this.props.addCard}>Add a card</span>
                                </div>
                        )
                    }

                    { errorMsg && <div>{errorMsg}</div> }
                </Card>

                <AccSettings userData = { userData } 
					isLoading = {this.state.loadingSettings} 
					switchEmailNotif={this.onSwitchEmail} 
					switchWorkingPro = {this.onSwitchWorkPro}/>
            </div>
        )
    }
    
}


export default GeneralTab;