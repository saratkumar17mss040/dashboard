import { getResources, deleteResource } from '../js/index.js';
const chartsRightCards = document.querySelector('.charts__right__cards');
const logout = document.getElementById('logout');

let postForCurrentUser = [];
// const userGivenIdValue = +location.href.slice(location.href.indexOf('?') + 1);
const userGivenIdValue = +localStorage.getItem('id');

function findAndDisplayStats() {
	const url = 'https://jsonplaceholder.typicode.com/';
	const resources = ['posts', 'comments', 'todos'];
	const promises = [];

	resources.map((resource) => {
		let fullUrl = `${url}${resource}`;
		promises.push(getResources(fullUrl));
	});

	const allData = Promise.all(promises);

	allData
		.then((data) => {
			postForCurrentUser = data[0].filter(
				({ userId }) => userId === userGivenIdValue
			);
			const postsLen = data[0].filter(
				({ userId }) => userId === userGivenIdValue
			).length;
			const commentsLen = data[1].filter(
				({ postId }) => postId === userGivenIdValue
			).length;
			const todosLen = data[2].filter(
				({ userId }) => userId === userGivenIdValue
			).length;

			const chartsRightCards = document.querySelector('.charts__right__cards');

			const htmlPost = document.getElementById('posts');
			const htmlComments = document.getElementById('comments');
			const htmlTodos = document.getElementById('todos');

			let postCounter = 1;

			postForCurrentUser.map(({ id, title, userId }) => {
				let card = document.createElement('div');
				let cardBody = document.createElement('div');
				let cardBodyDiv = document.createElement('div');
				let h1 = document.createElement('h1');
				let p = document.createElement('p');
				let buttonGroupDiv = document.createElement('div');
				let getBtn = document.createElement('button');
				let deleteBtn = document.createElement('button');
				let getBtnLink = document.createElement('a');
				card.className = 'card1';
				cardBody.className = 'card1__body';
				buttonGroupDiv.className = 'card1__button__group';
				getBtn.className = 'card1__button__get';
				deleteBtn.className = 'card1__button__delete';
				card.appendChild(cardBody);
				cardBody.appendChild(cardBodyDiv);
				cardBody.appendChild(buttonGroupDiv);
				cardBodyDiv.appendChild(h1);
				cardBodyDiv.appendChild(p);
				buttonGroupDiv.appendChild(getBtn);
				getBtn.appendChild(getBtnLink);
				getBtn.addEventListener('click', gotoDetailsPage);
				deleteBtn.addEventListener('click', deletePostInfo);
				getBtnLink.textContent = 'GET';
				getBtnLink.href = '#';
				buttonGroupDiv.appendChild(deleteBtn);
				deleteBtn.textContent = 'DELETE';
				h1.textContent = `Post ${postCounter}`;
				postCounter++;
				p.textContent = `${title}`;
				chartsRightCards.appendChild(card);
			});

			htmlPost.textContent = postsLen;
			htmlComments.textContent = commentsLen;
			htmlTodos.textContent = todosLen;
		})
		.catch((err) => {
			console.error('Error in fetching data: ', err.message);
		});
}

findAndDisplayStats();

function gotoDetailsPage(event) {
	let div = event.target.parentElement.parentElement.previousSibling;
	let currentTitle = div.lastChild.textContent;
	let postInfo = postForCurrentUser.filter(({ title }) => {
		return currentTitle === title;
	});

	location.href = `../pages/detail.html?&id=${postInfo[0].id}`;
}

function deletePostInfo(event) {
	let div = event.target.parentElement.parentElement.firstChild.lastChild;
	let currentTitle = div.textContent;
	let postInfo = postForCurrentUser.filter(({ title }) => {
		return currentTitle === title;
	});
	deleteResource(
		`https://jsonplaceholder.typicode.com/posts/id=${postInfo[0].id}`
	)
		.then((data) => {
			if (Object.keys(data).length === 0) {
				event.target.parentElement.parentElement.parentElement.remove();
			}
		})
		.catch((err) => {
			console.error('Error in fetching data: ', err.message);
		});
}

if (logout) {
	logout.addEventListener('click', removeInfo);
}

function removeInfo() {
	localStorage.removeItem('id');
	localStorage.removeItem('postInfo');
}
