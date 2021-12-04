import { getResources, saveResource } from '../js/index.js';

const chartsRightCards = document.querySelector('.charts__right__cards');

function displayInfo() {
	const id = +location.href.slice(location.href.indexOf('=') + 1);
	const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
	getResources(url).then((data) => {
		let card = `<div class="card1">
            <div class="card1__body">
                <div>
                    <h1>${data.title}</h1>
                    <p>${data.body}</p>
                </div>
                <div class="card1__button__group">
                    <button id="saveBtn" class="card1__button__get">save</button>
                </div>
            </div>
        </div>`;
		chartsRightCards.innerHTML = card;
		const saveBtn = document.getElementById('saveBtn');
		saveBtn.addEventListener('click', () => {
			saveResource(url)
				.then((postData) => {
					if (postData) {
						localStorage.setItem('postInfo', JSON.stringify(data));
						console.log('postInfo saved !');
					}
				})
				.catch((err) => {
					console.error('Error in fetching data: ', err.message);
				});
		});
	});
}

displayInfo();
