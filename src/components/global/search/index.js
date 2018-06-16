import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import Modal from 'react-uikit-modal';
import FontAwesome from 'react-fontawesome';
import velocity from 'velocity-animate';
import Autosuggest from 'react-autosuggest';
import $ from 'jquery';
import { route } from 'preact-router';



const professions = [
   {
      "name":"Language Tutor"
   },
   {
      "name":"Language Practice"
   },
   {
      "name":"Exam Preparation"
   },
   {
      "name":"Science"
   },
   {
      "name":"Business Studies"
   },
   {
      "name":"Social Science"
   },
   {
      "name":"Drawing"
   },
   {
      "name":"Music"
   },
   {
      "name":"Dance"
   },
   {
      "name":"Interpreter"
   },
   {
      "name":"Negotiator/Mediator"
   },
   {
      "name":"Therapist"
   },
   {
      "name":"Listener"
   },
   {
      "name":"Speech Therapist"
   },
   {
      "name":"Fortune Teller"
   },
   {
      "name":"Astrologist"
   },
   {
      "name":"Personal Assistant"
   },
   {
      "name":"Career Coach"
   },
   {
      "name":"Architect"
   },
   {
      "name":"Interior Designer"
   },
   {
      "name":"Legal"
   },
   {
      "name":"Medical"
   },
   {
      "name":"Business"
   },
   {
      "name":"Family"
   },
   {
      "name":"Investment"
   },
   {
      "name":"Tech Support "
   },
   {
      "name":"Beautician"
   },
   {
      "name":"Personal Trainer"
   },
   {
      "name":"Yoga Instructor"
   },
   {
      "name":"Meditation Instructor"
   },
   {
      "name":"Dietologist"
   },
   {
      "name":"Fitness Professional"
   },
   {
      "name":"Spiritual Coach"
   }
]

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : professions.filter(profession =>
    profession.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);



export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			searchValue: '',
			searchSuggestions: [],
      expanded: false
		}
		this.closeModal = this.closeModal.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onFocus = this.onFocus.bind(this);
	}
	animateIn (modal, dialog) {
    this.setState({showModal: true});
    document.getElementById('searchInput').focus();
    document.getElementById('searchInput').setSelectionRange(0, this.state.searchValue.length)
    //velocity(modal,  {scale: 1}, {display: 'block'}, 20);
    //setTimeout(()=>{velocity(dialog, {scale: 1}, {display: 'block'}, 20)},200);
  }

	onSearchChange = (event, { newValue }) => {
    this.setState({
      searchValue: newValue
    });

  };
  componentWillReceiveProps(nextProps){
    if (nextProps.hiddenSearchBox) {
      this.setState({showModal: false, expanded: false})
    }
  }
  animateOut (modal, dialog) {
    this.setState({showModal: false, expanded: false});
		$(modal).remove();
    //velocity(modal,  {scale: 0.3}, { display: 'none' }, 20);
		//velocity(dialog, {scale: 0.95},{display: 'none'}, 20);
  }

	closeModal(){
		this.setState({showModal: false, expanded: false})
	}

  onSuggestionsFetchRequested = ({ value }) => {
	  this.setState({
	    searchSuggestions: getSuggestions(value)
	  });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      searchSuggestions: []
    });
  }

  handleKeyPress =  (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.closeModal();
      let searchTerm = (this.state.searchValue.length > 0) ? this.state.searchValue : " ";
      route('/search/' + searchTerm);
    }
  }
  performSearch(e){
    e.stopPropagation();
    if (!this.state.expanded) {
      this.setState({
        expanded: true,
        showModal: true
      })
    } else {
      this.closeModal();
      route('/search/' + this.state.searchValue);
    }

  }

  onFocus(){
    this.setState({
      expanded: true,
      showModal: true
    })
  }

	render() {
		const inputProps = {
      placeholder: 'Find a pro',
      value: this.state.searchValue,
			className: 'uk-search-input',
      onChange: this.onSearchChange,
      onKeyPress: this.handleKeyPress,
			id: 'searchInput',
      onFocus: this.onFocus
    };
		return (
			<div id={style.searchContainer} className={(!this.state.expanded && style.collapsed) + " " + (this.props.home && style.home)}>
				{this.state.showModal && (<a onClick={this.closeModal} className="uk-modal-close uk-close" id="closeModal"></a>)}
				<Modal
					id={style.searchModal}
		      close
		      show={this.state.showModal}
					className={style.visible + ' uk-modal-full'}
          trigger={{
		        body: 'Find pro',
						animate: {
          		'in': (modal, dialog) => this.animateIn(modal, dialog),
          		out: (modal, dialog) => this.animateOut(modal, dialog)
        		}

		      }}
		    >
					 <form className="uk-search uk-search-large">
					 		<Autosuggest
				        suggestions={this.state.searchSuggestions}
				        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				        getSuggestionValue={getSuggestionValue}
				        renderSuggestion={renderSuggestion}
				        inputProps={inputProps}
				      />
							<a href="#" className="withIcon" onClick={this.performSearch} >
								<span class="icon-magnifying-glass"></span>
							</a>

	         </form>
				</Modal>

			</div>
		);
	}
}
