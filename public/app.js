let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

//
const garmentApi = document.querySelector('.garmentApi')
const loginInfo = document.querySelector('.loginInfo')
const register = document.querySelector('.register')
const login = document.querySelector('.login')
const username = document.querySelector('.username')
const errMessage = document.querySelector('.errorMessage')

//
if (localStorage.getItem('token')) {
	garmentApi.classList.remove('hidden');
	loginInfo.classList.add('hidden')
}
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

register.addEventListener('click', function () {
	if (username.value) {
		axios
			.post('/api/login/', { username: username.value })
			.then(function (result) {
				const { token } = result.data;

				localStorage.setItem('token', token);

				axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
			});
		register.classList.add('hidden')
		login.classList.remove('hidden')

	}
	else if (!username.value) {
		errMessage.innerHTML = ('enter your github username')
		setTimeout(function () { errMessage.innerHTML = ('') }, 2000);
	}
})

login.addEventListener('click', function () {
		const url = `/api/garments`;
		axios
			.get(url)
			.then(function () {
				filterData()
				garmentApi.classList.remove('hidden');
				loginInfo.classList.add('hidden')
			})

})
seasonOptions.addEventListener('click', function (evt) {
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function (evt) {
	genderFilter = evt.target.value;
	filterData();
});

function filterData() {

	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
			axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
		});
}

priceRangeElem.addEventListener('change', function (evt) {
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
});

filterData();
