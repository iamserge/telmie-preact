import { h, Component } from 'preact';
import style from './style.scss';


class Call extends Component {

    componentDidMount() {
		this.socket = new WebSocket("ws://sr461.2dayhost.com:5280/websocket");

		this.socket.onopen = () => {
			console.log("Соединение установлено.");
			console.log(this.socket);
		  };
		  
		  this.socket.onclose = function(event) {
			if (event.wasClean) {
			  console.log('Соединение закрыто чисто');
			} else {
			  console.log('Обрыв соединения'); // например, "убит" процесс сервера
			}
			console.log('Код: ' + event.code + ' причина: ', event);
		  };
		  
		  this.socket.onmessage = function(event) {
			console.log("Получены данные ", event.data);
		  };
		  
		  this.socket.onerror = function(error) {
			console.log("Ошибка ", error.message);
		  };
	}
    
    render(){

        document.body.classList.add("home");

        return (<div class={style.callArea}>
            Call
        </div>)
    }
}

export default Call;