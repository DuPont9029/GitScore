function User(name) {
    this.username = name;
    this.contributions = 0;

    this.fetchContribs = async function() {
        try {
            const contributions = await fetchContributions(this.username);
            this.contributions = contributions;
        } catch (error) {
            console.error(error);
        }
    }
}




async function fetchAllContribs(users) {
    for (let i = 0; i < users.length; i++) {
        await users[i].fetchContribs();
    }
}




async function getTopThreeUsers(users) {
    await fetchAllContribs(users);
    users.sort((a, b) => b.contributions - a.contributions);
    return users.slice(0, 3);
}

async function fetchContributions(username) { //! its scrapiing time
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = parseInt(String(today.getMonth() + 1), 10); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const url = 'https://corsproxy.io/?' + `https://github.com/users/${username}/contributions?to=${today}`; 

    try {
        const response = await fetch(url);
        const html = await response.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        var h2Element = doc.querySelector('.position-relative h2');
        var h2Text = h2Element.textContent || h2Element.innerText;
        var numericValue = h2Text.match(/\d+/)[0];
        
        return numericValue;
    } catch (error) {
        console.error(error);
    }
}

let users = [ //! PART WHERE YOU NEED TO ADD USERS
    new User('KovD3v'), 
    new User('DuPont9029'), 
    new User('metoncode'), 
    new User('Mattiarotelli')
];


//users[0].fetchContribs().then(()=> console.log(`${users[0].username} ha ${users[0].contributions} contributions`))


for (let i = 0; i < users.length; i++) {
    users[i].fetchContribs();
}

getTopThreeUsers(users).then(topThreeUsers => {



    for (let i = 0; i < users.length; i++) {
        document.getElementById(users[i].username).textContent = users[i].contributions;
        console.log(`document.getElementById(${users[i].username}).textContent = ${users[i].contributions};`)
    }

    setInterval(() => { 
       
        const numbers = [topThreeUsers[0].contributions, topThreeUsers[1].contributions, topThreeUsers[2].contributions]; // replace with your own numbers
        const fixedncontr = [140, 90, 40];
        //const scale = 1.7; // fattore di scala per aumentare l'altezza delle barre  4
        const scale = 0.5;
        const sortedNumbers = numbers.map(number => number * scale).sort((a, b) => b - a);

        const bars = document.querySelectorAll('.bar');

        bars.forEach((bar, index) => {
            bar.style.height = `${fixedncontr[index]}px`;
        });


        document.getElementById("1").textContent = topThreeUsers[0].username;
        document.getElementById("2").textContent = topThreeUsers[1].username;
        document.getElementById("3").textContent = topThreeUsers[2].username;

        }, 1000);


});
