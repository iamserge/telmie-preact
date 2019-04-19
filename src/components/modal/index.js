import { h, Component } from 'preact';
import style from './style.scss';

/*
    Example:

    <Modal isVisible={true} 
			title="title"
			okText="OK"
			onOk = {() => {}}
			cancelText = 'cancel'
			onCancel={() => {}}>
		Content
	</Modal>
*/

class Modal extends Component {

    componentWillUnmount(){
        window.removeEventListener('keyup', this.handleKeyUp, false);
    }

    componentWillReceiveProps(nextProps){
        (nextProps.isVisible == true && this.props.isVisible == false) ? (
            window.addEventListener('keyup', this.handleKeyUp, false)
        ) : (
            window.removeEventListener('keyup', this.handleKeyUp, false)
        )
    }
    
    handleKeyUp = (e) => {
        const { onCancel } = this.props;

        e.keyCode === 27 && (
            e.preventDefault(),
            onCancel(),
            window.removeEventListener('keyup', this.handleKeyUp, false)
        )
    }
    
    handleOutsideClick = (e) => {
        const { onCancel } = this.props;

        if (this.node && this.node.contains(e.target)) {
            return;
        }
          
        onCancel();
    }

    render(props){
        const {isVisible, title, okText, onOk, cancelText, onCancel, modalClass=''} = props;

        return isVisible == false ? 
            null 
            : ( 
                <div class={style.backdrop} onClick={this.handleOutsideClick}>
                    <div class={`${style.modal} ${modalClass}`} ref={node => { this.node = node; }}>
                        {title && (<div class={style.title}>
                            {title}
                        </div>)}
                    
                        <div class={style.content}>
                            {props.children}
                        </div>

                        <div class = {style.footer}>
                            {okText && <button class = {style.okBtn} onClick={onOk}>
                                {okText}
                            </button>}
                            
                            {cancelText && <div class = {style.cancelBtn} onClick={onCancel}>
                                {cancelText}
                            </div>}
                        </div>
                        
                    </div>
                </div>
            )
    }
}

export default Modal;