import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';



const jsonLocalStorage = {
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: (key) => {
		return JSON.parse(localStorage.getItem(key));
	},
};

const fetchCat = async (text) => {
	const OPEN_API_DOMAIN = "https://cataas.com";
	const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
	const responseJson = await response.json();
	return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

console.log("야옹");

// const Title = (props) => {
// 	console.log(props);

// 	if ( props.children === null ) {
// 		return <h1>고양이 가라사대</h1>;
// 	}

// 	return <h1>{props.children}번째 고양이 가라사대</h1>;
// };



const Form = ({ updateMainCat }) => {
	/*
	const counterState = React.useState(1);	//	1은 counterState의 초기값
	
	const counter = counterState[0];	//	counterState 자체
	const setCounter = counterState[1];	//	counter 조작 함수
	//	useState의 두번째 인자를 통해 첫번째 인자를 바꾼다.
	*/
	const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

	const [value, setValue] = React.useState('');

	const [errorMessage, setErrorMessage] = React.useState('');

	function handleInputChange(e) {
		const userValue = e.target.value;
		setErrorMessage('');
		console.log(includesHangul(userValue));

		if (includesHangul(userValue)) {
			setErrorMessage("한글은 입력할 수 없습니다.");
		}

		setValue(userValue.toUpperCase());
	}

	function handleFormSubmit(e) {

		e.preventDefault();

		setErrorMessage('');

		if (value === '') {
			setErrorMessage("빈 값으로 만들 수 없습니다.");
			return;
		}
		updateMainCat(value);
	}

	return (

		<form onSubmit={handleFormSubmit}>
			<input type="text" name="name"
				placeholder="영어 대사를 입력해주세요"
				value={value}
				onChange={handleInputChange} />
			<button type="submit">생성</button>
			<p style={{ color: 'red' }}>{errorMessage}</p>
		</form>
	);
};

// Component는 대문자로 시작
function CatItem(props) {
	console.log(props);
	return (
		<li>
			<img src={props.img} style={{ width: '150px' }} />
		</li>
	);
}

function Favorites({ favorites }) {

	if ( favorites.length === 0 ) {
		return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
	}

	return (
		<ul className="favorites">
			{favorites.map(cat => <CatItem img={cat} key={cat} />)}
		</ul>
	);
}


const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
	
	const heartIcon = alreadyFavorite ? "💖" : "🤍";

	return (
		<div className="main-card">
			<img src={img} alt="고양이" width="400" />
			<button onClick={onHeartClick}>{heartIcon}</button>
		</div>
	);
}

/*
const app = (
	<div>
		<Title>1번째 고양이 가라사대</Title>
		<Form />
		<MainCard img="https://cataas.com/cat/60b73094e04e18001194a309/says/react" />
		<Favorites />
	</div>
);
*/

const App = () => {

	const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
	const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
	const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

	// const [counter, setCounter] = React.useState(
	// 	jsonLocalStorage.getItem('counter')
	// );

	const [counter, setCounter] = React.useState(() => {
		return jsonLocalStorage.getItem('counter')
	});

	//	mainCat 세팅
	const [mainCat, setMainCat] = React.useState(CAT1);

	//	localStorage에서 favorites값 가져와서 favorites에 세팅
	// const [favorites, setFavorites] = React.useState(
	// 	// [CAT1, CAT2]
	// 	jsonLocalStorage.getItem('favorites') || []	//	앞 데이터가 없으면 뒤의 것 사용
	// );

	const [favorites, setFavorites] = React.useState(() => {
		return jsonLocalStorage.getItem('favorites') || [];	//	앞 데이터가 없으면 뒤의 것 사용
	});

	async function setInitialCat() {
		const newCat = await fetchCat('First cat');
		console.log(newCat);
		setMainCat(newCat);
	}

	React.useEffect(() => {
		setInitialCat();
	}, [])

	/**
	 * React 컴포넌트 안에 있는 코드는 UI가 새로 업데이트 될 때마다 호출
	 * 아래는 counter값이 변할 때마다 호출됨
	 * 빈 값일 경우는 한 번만 호출됨
	React.useEffect(() => {
		setInitialCat();
	}, [counter])
	*/

	const alreadyFavorite = favorites.includes(mainCat);

	async function updateMainCat(value) {
		// event.preventDefault();	//	폼 전송 시 화면 refresh 막는다(이벤트의 기본 동작을 막는다)

		const newCat = await fetchCat(value);

		setMainCat(newCat);
		// setCounter(nextCounter);
		setCounter((prev) => {
			const nextCounter = prev + 1;
			jsonLocalStorage.setItem('counter', nextCounter);
			return nextCounter;
		});
	}

	function handleHeartClick() {
		const nextFavorites = [...favorites, mainCat];
		setFavorites(nextFavorites);
		jsonLocalStorage.setItem('favorites', nextFavorites);
	}

	const counterTitle = counter === null ? "" : counter + "번째 ";

	return (
		<div>
			<Title>{counterTitle}고양이 가라사대</Title>
			<Form updateMainCat={updateMainCat} />
			<MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
			<Favorites favorites={favorites} />
		</div>
	);
};

export default App;
