const sidebar = document.getElementById('sidebar');
const toggleSidebarIcon = document.getElementById('toggleSidebar');
const closeSidebarIcon = document.getElementById('closeSidebar');
const loginBtn = document.getElementById('loginBtn');
const userIdInput = document.getElementById('userId');
const loader = document.querySelector('.loader');
const loginContainer = document.querySelector('.login__container');

let sidebarOpen = false;
const url = 'https://jsonplaceholder.typicode.com/';

// const loginLink = document.querySelector('.loginLink');
// const sidebarCloseIcon = document.getElementById('sidebarIcon');

function toggleSidebar() {
	if (!sidebarOpen) {
		sidebar.classList.add('sidebar_responsive');
		sidebarOpen = true;
	}
}

function closeSidebar() {
	if (sidebarOpen) {
		sidebar.classList.remove('sidebar_responsive');
		sidebarOpen = false;
	}
}

export function getResources(url) {
	return fetch(url).then((response) => response.json());
}

export function deleteResource(
	url,
	config = {
		method: 'delete',
	}
) {
	return fetch(url, config).then((response) => response.json());
}

export function saveResource(
	url,
	config = {
		method: 'post',
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}
) {
	return fetch(url, config).then((response) => response.json());
}

function isLoginSuccessOrFail(event) {
	event.preventDefault();
	loader.style.visibility = 'visible';
	if (userIdInput.value == '') {
		loader.style.visibility = 'hidden';
		alert('please enter an id !');
	} else {
		getResources(`${url}posts`)
			.then((data) => {
				loader.style.visibility = 'hidden';
				const enteredId = parseInt(userIdInput.value, 10);
				userIdInput.value = '';
				const userLen = data.filter(
					({ userId }) => userId === enteredId
				).length;
				const isLoginSuccess = userLen >= 1;
				if (isLoginSuccess) {
					createToast(isLoginSuccess);
					if (localStorage.getItem('id')) {
						localStorage.removeItem('id');
					}
					if (localStorage.getItem('postInfo')) {
						localStorage.removeItem('postInfo');
					}
					localStorage.setItem('id', enteredId);
				} else {
					createToast(isLoginSuccess);
				}
			})
			.catch((err) => {
				console.error('Error in fetching data: ', err.message);
			});
	}
}

function directToLogin(event) {
	// 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		event.preventDefault();
		loginBtn.click();
	}
}

function createToast(isLoginSuccess) {
	let toast = document.getElementById('toast');
	toast.className = 'show';
	setTimeout(() => {
		if (isLoginSuccess) {
			toast.textContent = 'Login successful !';
			toast.style.backgroundColor = '#35a4ba';
			toast.className.replace('show', '');
			location.href =
				'https://saratkumar17mss040.github.io/dashboard/pages/dashboard.html';
			loginBtn.removeEventListener('click', isLoginSuccessOrFail);
		} else {
			toast.textContent = 'Login failed !';
			toast.style.backgroundColor = '#eb364b';
			toast.className.replace('show', '');
		}
	}, 1000);
}

if (loginBtn) {
	loginBtn.addEventListener('click', isLoginSuccessOrFail);
}

if (toggleSidebarIcon) {
	toggleSidebarIcon.addEventListener('click', toggleSidebar);
}

if (closeSidebarIcon) {
	closeSidebarIcon.addEventListener('click', closeSidebar);
}

if (userIdInput) {
	userIdInput.addEventListener('keypress', directToLogin);
}
