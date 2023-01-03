// get data from api after form submit and set it to local storage
async function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  // queries that are already fetched and stored in local storage
  const queries = window.localStorage.getItem("queries")
    ? JSON.parse(window.localStorage.getItem("queries"))
    : new Map();
  document.getElementById("message-text").innerHTML = "";
  if (!queries[name]) {
    // fetch data from github api
    fetch(`https://api.github.com/users/${name}`)
      .then((response) => response.json())
      .then((data) => {
        // check if user exists
        if (data.message) {
          setInitialHtml();
          document.getElementById("message-text").innerHTML = "User not found";
        } else {
          setHtml(data);
          // maximum cache size is 20
          if (Object.keys(queries).length >= 20) {
            delete queries[Object.keys(queries)[0]];
          }
          queries[name] = data;
          window.localStorage.setItem("queries", JSON.stringify(queries));
        }
      })
      .catch(() => {
        setInitialHtml();
        document.getElementById("message-text").innerHTML = "Network Error";
      });
  } else {
    setHtml(JSON.parse(window.localStorage.getItem("queries"))[name]);
  }
}

// set innerHTML of elements with fetched data
function setHtml(data) {
  document.getElementById("info-col").style.display = "block";
  document.getElementById("username").innerHTML = data.name;
  if (data.avatar_url) {
    document.getElementById("img-container").innerHTML =
      '<img src="' + data.avatar_url + '" alt="avatar" class="avatar"/>';
  } else {
    document.getElementById("img-container").innerHTML = "";
  }
  document.getElementById("blog").innerHTML = data.blog;
  if (data.bio) {
    document
      .querySelector(".info-container")
      .appendChild(document.createElement("div"));

    document.getElementById("bio").innerHTML = "<pre>" + data.bio + "</pre>";
  } else {
    document.getElementById("bio").innerHTML = "";
  }
  document.getElementById("location").innerHTML = data.location;
  if (data.blog === "" && !data.name && !data.location) {
    document.getElementById("info-col").style.display = "none";
  }
}

// set innerHTML of elements to empty string (initial state of webpage)
function setInitialHtml() {
  document.getElementById("username").innerHTML = "";
  document.getElementById("img-container").innerHTML = "";
  document.getElementById("blog").innerHTML = "";
  document.getElementById("bio").innerHTML = "";
  document.getElementById("location").innerHTML = "";
}
