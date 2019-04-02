import { h, Component } from 'preact';
import Modal from '../../modal';
import Spinner from '../../global/spinner';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import style from './style.scss';
import { bytesToSize } from '../../../utils'

export default class ImageUpload extends Component {

    constructor(props){
        super(props);

        this.state = {
            isVisible: false,
            file: '',
            cropResult: null,
            loading: false,
            error: "",
        }
    }

    componentWillReceiveProps(nextProps){
        (nextProps.avatarID !== this.props.avatarID) && this.resetState();

        (nextProps.uploadFailure != this.props.uploadFailure) && (
            this.setState({
                loading: false,
                error: nextProps.uploadFailure,
            }),
            this.fileUpload.value = ''
        );
    }

    resetState = () => (
        this.setState({
            isVisible: false,
            file: '',
            cropResult: null,
            loading: false,
            error: "",
        }),
        this.fileUpload.value = ''
    );

    onImgChange = (e) => {
		let files;
		if (e.dataTransfer) {
            files = e.dataTransfer.files;
		} else if (e.target) {
		    files = e.target.files;
        }

        if(files[0].size < this.props.maxFileSize 
            && this.props.imgExtension.some(el => (files[0].type.indexOf(el) + 1))){
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ file: reader.result, isVisible: true });
            };
            reader.readAsDataURL(files[0]);
        }
    }
    
    onCancel = () => {
        this.props.clearuploadPhotoStatus();
        this.resetState();
    };

    onOk = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        this.setState({ isVisible: true, loading: true, error: '' });
        this.cropper.getCroppedCanvas().toBlob(blob => {
            this.props.onDrop(blob);
        });
    }

    render(){

        return (
            <div>
                <p style={{fontSize: 12, textAlign: 'center'}}>
                    Max file size: {bytesToSize(this.props.maxFileSize)}, accepted: {this.props.imgExtension.join('|')}
                </p>
                <label for="file-upload" class={style.chooseFileButton}>
					Upload new
				</label>
				<input id="file-upload" type="file" style={{display: 'none'}} onChange={this.onImgChange} ref={el => this.fileUpload = el}/>

                <Modal isVisible= {this.state.isVisible}
                    modalClass={style.modal}
                    onCancel={() => {}}>
                    <div class={style.test}>
                    <div class={style.cropperWrapper}>
                            <Cropper
                                ref={el => this.cropper = el}
                                src={this.state.file}
                                preview=".img-preview"
                                guides={false}
                                style={{ width: 'auto', height: 'auto', maxHeight: 500, minWidth: 200}}
                                zoomable={false}
                                aspectRatio={1 / 1} />
                    </div>
                    <div class={style.preview}>
                        <div className={`img-preview ${style.imgPreview}`}
                            ref={el => this.preview = el}/>
                        {
                            !this.state.loading ? (
                                <div class={style.btnsWrapper}>
                                    <button onClick={this.onOk} class='red-btn'>OK</button>
                                    <button onClick={this.onCancel}>Cancel</button>
                                    {this.state.error && <div class={style.errorContainer}>{this.state.error}</div> }
                                </div>
                            ) : (
                                <div class={style.spinnerContainer}><Spinner /></div>
                            )
                        }
                    </div>
                    </div>
                </Modal>
            </div>
        )
    }
}