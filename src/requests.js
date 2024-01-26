class User {
	constructor(name) {
		this.username = name;
		this.contributions = 0;
	}

	async fetchContributions() {
		try {
			const contributions = await fetchContributions(this.username);
			this.contributions = contributions;
		} catch (error) {
			console.error(error);
		}
	}
}

async function fetchAllContributions(users) {
	await Promise.all(users.map((user) => user.fetchContributions()));
}

async function getTopThreeUsers(users) {
	await fetchAllContributions(users);
	users.sort((a, b) => b.contributions - a.contributions);
	return users.slice(0, 3);
}

async function fetchContributions(username) {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = parseInt(String(today.getMonth() + 1), 10);
	let yyyy = today.getFullYear();

	const url = `https://corsproxy.io/?https://github.com/users/${username}/contributions?to=${yyyy}-${mm}-${dd}`;

	try {
		const response = await fetch(url);
		const html = await response.text();

		let parser = new DOMParser();
		let doc = parser.parseFromString(html, "text/html");
		let element = doc.querySelector(".position-relative h2");
		let text = element.textContent || element.innerText;
		let numericValue = text.match(/\d+/)[0];

		return numericValue;
	} catch (error) {
		console.error(error);
	}
}

let users = [
	new User("KovD3v"),
	new User("DuPont9029"),
	new User("metoncode"),
	new User("Mattiarotelli"),
];

users.forEach((user) => {
	user.fetchContributions();
});

getTopThreeUsers(users).then((topThreeUsers) => {
	users.forEach((user) => {
		setElementTextContent(user.username, user.contributions);
	});

	setInterval(() => {
		const bars = document.querySelectorAll(".bar");

		bars.forEach((bar, index) => {
			bar.style.height = `${[140, 90, 40][index]}px`;
		});

		setElementTextContent("1", topThreeUsers[0].username);
		setElementTextContent("2", topThreeUsers[1].username);
		setElementTextContent("3", topThreeUsers[2].username);
	}, 250);
});

function setElementTextContent(id, textContent) {
	document.getElementById(id).textContent = textContent;
	console.log(`document.getElementById(${id}).textContent = ${textContent};`);
}
