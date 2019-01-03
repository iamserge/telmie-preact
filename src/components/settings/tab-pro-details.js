import { h, Component } from 'preact';
import style from './style.scss';
import Card from "../card"
import { route } from 'preact-router';

import {routes} from '../app'
import { changeDateISOFormat } from '../../utils/index'


const ProDetailsTab = props => {

    const {userData = {}} = props;
    const { pro = {}, mobile, dateOfBirth, location, name, lastName } = userData;
    const {subCategory, costPerMinute, professionDescription, category, profession} = pro;

    const {country, city, line1, postCode} = location ? JSON.parse(location) : {};

    const {businessName,
		compHouseNumber,
		compAddress,
		compCity,
		compPostCode,
        compCountry} = userData;
    
    const onEditPro = () => {
        route(routes.REGISTER_PRO);
    }

    return (
        <div class={style.contentContainer}>
            <Card headerText = 'Pro details' headerBtnText = 'Edit' onHeadetBtnClick = {onEditPro}>
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

                <div className="double-input-container" style={{dosplay: 'flex', justifyContent: 'space-between'}}>
                    <div className="input-container">
                        <label for="sortCode">Sort code</label>
                        <input type="text" name="sortCode" className="uk-input"/>

                        {/*this.validator.message('city', city, 'required', 'validation-tooltip', {required: 'Please enter city'})*/}
                    </div>
                    <div className="input-container">
                        <label for="accountNumber">Account number</label>
                        <input type="text" name="accountNumber" className="uk-input" />

                        {/*this.validator.message('postCode', postCode, 'required', 'validation-tooltip right', {required: 'Please enter post code'})*/}
                    </div> 
                </div>

                <div style={{textAlign: 'center'}}>
                    <button className='uk-button' onClick={() => {}}>
                        Submit
                    </button>
                </div>
            </Card>

                <Card headerText="ID Verification">
                    <div class={style.cardInfoText}>
                        Please upload your ID to lift the £2,000 limit of your payouts. The ID should be either a UK passport or a UK driving licence in the name of Mykola Adeyev. 
                    </div>
                    <button className='uk-button' onClick={() => {}}>
                        Upload
                    </button>
                </Card>
            </div>
        )
}

export default ProDetailsTab;