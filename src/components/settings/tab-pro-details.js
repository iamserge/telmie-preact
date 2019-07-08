import { h, Component } from 'preact';
import style from './style.scss';
import Card from "../card"
import Spinner from '../global/spinner'
import SimpleReactValidator from 'simple-react-validator'
import BankItem from '../bank-account'
import { route } from 'preact-router';

import {routes} from '../app'
import { changeDateISOFormat } from '../../utils/index'
import { accountTypes } from '../../utils/proPending'


class ProDetailsTab extends Component {
    constructor(props){
        super(props);
        this.state = {
            routing_number: '',
            account_number: '',

            uploading: false,
            uploadError: '',
            uploadSuccess: false,
        };

        this.validator = new SimpleReactValidator();
    }

    componentDidMount(){
        this.props.getBankAcc();
    }

    componentWillReceiveProps(nextProps){
        const { verificationIdComplete, verificationIdError } = nextProps.bankAccounts;
        const { verificationIdComplete : prevVerifiComplete, verificationIdError : prevVerifError } = this.props;
        
        (verificationIdComplete !== prevVerifiComplete && verificationIdComplete === true) && this.setState({
            uploading: false,
            uploadError: '',
            uploadSuccess: true,
        });

        (verificationIdError !== prevVerifError) && this.setState({
            uploadError: verificationIdError,
            uploading: false,
            uploadSuccess: false,
        });
    }

    componentWillUnmount(){
        this.props.resetVerificationIdStatus();
    }

    onEditPro = () => {
        route(routes.REGISTER_PRO);
    }

    onBankChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    addBankAcc = () => {
        const { pro } = this.props.userData;
        if (this.validator.allValid() && pro) {
            const { routing_number, account_number } = this.state;
            let holder_name = '', holder_type = '';
            pro.company ? (
                holder_type = accountTypes.COMPANY.toLocaleLowerCase(),
                holder_name = pro.company.taxId
            ) : (
                holder_type = accountTypes.INDIVIDUAL.toLocaleLowerCase(),
                holder_name = `${this.props.userData.name} ${this.props.userData.lastName}`
            )

            this.props.addBankAcc(routing_number, account_number, holder_name, holder_type, 
                () => this.setState({
                    routing_number: '',
                    account_number: '',
                }
            ));
		} else {
			this.validator.showMessages();
			this.forceUpdate();
		}
    }

    uploadHandler = (e) => {
        let files = null;
		if (e.dataTransfer) {
            files = e.dataTransfer.files;
		} else if (e.target) {
		    files = e.target.files;
        }
        
        if(files){
            this.setState({ uploading: true, uploadError: '' });
            this.props.uploadVerificationID(this.props.userData.userAuth, files[0]);
            this.fileUpload.value = '';
        }
    }

    render(){
        const {userData = {}, bankAccounts} = this.props;
        const { banks, loading, error, errorMsg } = bankAccounts;
        const { pro = {}, mobile, dateOfBirth, location, name, lastName } = userData;
        const {subCategory, costPerMinute, professionDescription, category, profession} = pro;
    
        const {country, city, line1, postCode} = location ? JSON.parse(location) : {};
    
        const {businessName,
            compHouseNumber,
            compAddress,
            compCity,
            compPostCode,
            compCountry} = userData;
        
    
        return (
            <div class={style.contentContainer}>
                <Card headerText = 'Pro details' headerBtnText = 'Edit' onHeadetBtnClick = {this.onEditPro}>
                    {(businessName || compHouseNumber || compAddress || compCity || compPostCode || compCountry)
                        && [
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Business name:</div>
                                    <div class={style.value}>{businessName}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Companies House registration number:</div>
                                    <div class={style.value}>{compHouseNumber}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Company address:</div>
                                    <div class={style.value}>{compAddress}</div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.doubleItems}>
                                    <div class={style.singleItem}>
                                        <div class={style.key}>City:</div>
                                        <div class={style.value}>{compCity}</div>
                                    </div>
                                    <div class={style.singleItem}>
                                        <div class={style.key}>Post Code:</div>
                                        <div class={style.value}>{compPostCode}</div>
                                    </div>
                                </div>
                            </div>),
                            (<div class = {style.proDetailsContent}>
                                <div class={style.singleItem}>
                                    <div class={style.key}>Country:</div>
                                    <div class={style.value}>{compCountry}</div>
                                </div>
                            </div>),
                        ]}
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Personal address:</div>
                            <div class={style.value}>{line1}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.doubleItems}>
                            <div class={style.singleItem}>
                                <div class={style.key}>City:</div>
                                <div class={style.value}>{city}</div>
                            </div>
                            <div class={style.singleItem}>
                                <div class={style.key}>Post Code:</div>
                                <div class={style.value}>{postCode}</div>
                            </div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Country:</div>
                            <div class={style.value}>{country}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Date of birth:</div>
                            <div class={style.value}>{changeDateISOFormat(dateOfBirth)}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service name:</div>
                            <div class={style.value}>{profession}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service category:</div>
                            <div class={style.value}>{category}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service sub-category:</div>
                            <div class={style.value}>{subCategory}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Service description:</div>
                            <div class={style.value}>{professionDescription}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Rate:</div>
                            <div class={style.value}>£ {costPerMinute} / min</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Mobile:</div>
                            <div class={style.value}>{mobile}</div>
                        </div>
                    </div>
                </Card>
    
                <Card headerText="Bank account">
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Name:</div>
                            <div class={style.value}>{name} {lastName}</div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Entity:</div>
                            <div class={style.value}></div>
                        </div>
                    </div>
                    <div class = {style.proDetailsContent}>
                        <div class={style.singleItem}>
                            <div class={style.key}>Address:</div>
                            <div class={style.value}>{line1}, {city}, {postCode}, {country}</div>
                        </div>
                    </div>
                    <div class={style.cardInfoText}>
                        Your name, entity and address should match the details of your bank account. To change any of the info above, please submit new Pro application.
                    </div>

                    <div>
                        {loading ? 
                            <div style={{textAlign: "center", padding: "10px 0" }}>Loading accounts</div> 
                            : !error && (
                                banks.map(bank => (<BankItem {...bank} key={bank.token}
                                    deleteBank={this.props.deleteBankAcc} />))
                            )
                        }

                        { errorMsg 
                            && <div style={{textAlign: "center", padding: "10px 0", color: 'red' }}>
                                {errorMsg}
                            </div> }
                    </div>
    
                    <hr/>
                    <div class={style.addNewTitle}>Add new bank account</div>
                    <div className="double-input-container" style={{dosplay: 'flex', justifyContent: 'space-between'}}>
                        <div className="input-container">
                            <label for="routing_number">Sort code</label>
                            <input type="text" name="routing_number" className="uk-input" onInput={this.onBankChange}/>
    
                            {this.validator.message('routing_number', this.state.routing_number, 'required|numeric', 'validation-tooltip', {required: 'Please enter sort code'})}
                        </div>
                        <div className="input-container">
                            <label for="account_number">Account number</label>
                            <input type="text" name="account_number" className="uk-input" onInput={this.onBankChange}/>
    
                            {this.validator.message('account_number', this.state.account_number, 'required|numeric', 'validation-tooltip right', {required: 'Please enter account number'})}
                        </div> 
                    </div>
    
                    <div style={{textAlign: 'center'}}>
                        <button className='uk-button' onClick={this.addBankAcc}>
                            Submit
                        </button>
                    </div>

                    { (this.props.stripeBankMsg) && 
                        <div style={{textAlign: "center", padding: "10px 0", color: this.props.stripeBankErr ? 'red' : 'inherit' }}>
                            { this.props.stripeBankMsg }
                        </div>
                    }
                </Card>
    
                    <Card headerText="ID Verification">
                        <div class={style.cardInfoText}>
                            Please upload your ID to lift the £2,000 limit of your payouts. The ID should be either a UK passport or a UK driving licence in the name of {userData.name} {userData.lastName}. 
                        </div>
                        {
                            !this.state.uploading ? [
                                <label for="file-upload" class={style.chooseFileButton}>
                                    Upload
                                </label>,
                                <input id="file-upload" type="file" style={{display: 'none'}} onChange={this.uploadHandler} ref={el => this.fileUpload = el}/>,
                                this.state.uploadError && <div class={!this.state.uploadSuccess && style.errorContainer}>
                                    {this.props.uploadSuccess ? 'Uploaded!' : this.state.uploadError}
                                </div>
                            ] : (
                                <div class={style.spinnerContainer}><Spinner/></div>
                            )
                        }
                        
                    </Card>
                </div>
            )

    }
}

export default ProDetailsTab;