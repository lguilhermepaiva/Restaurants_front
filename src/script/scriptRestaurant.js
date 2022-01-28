function toggleCards() {
  document.getElementById("tableRestaurants").classList.toggle("d-none");
  document.getElementById("searchRestaurants").classList.toggle("d-none");
  document.getElementById("infoRestaurant").classList.toggle("d-none");
  document.getElementById("tablePlates").classList.toggle("d-none");
  document.getElementById("backButton").classList.toggle("d-none");
}

const formatPrice = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const requestHeader = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token_jwt"),
  },
  method: "GET",
};

function maskedBrazilPhone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\s)(\d{4})(\d)/, "$1$2-$3")
    .replace(/(\s)(\d)(\d{3})-(\d)(\d{4})/, "$1$2 $3$4-$5")
    .replace(/(\d)(\s)(\d{3})(\d{1})-(\d{3})$/, "$1$3-$4$5")
    .replace(/(-\d{4})(\d+?$)/g, "$1");
}

async function getPlates(restaurantId) {
  try {
    const responsePlates = await fetch(
      `http://localhost:3333/plates/${restaurantId}`,
      requestHeader
    );
    const responseDataRestaurant = await fetch(
      `http://localhost:3333/restaurants/id/${restaurantId}`,
      requestHeader
    );
    const plates = await responsePlates.json();
    const dataRestaurant = await responseDataRestaurant.json();
    showPlates(dataRestaurant, plates);
  } catch (error) {
    console.error(error);
  }
}

function showPlates(restaurant, plates) {
  const htmlInfoRestaurant = `<tr><th colspan=3>${restaurant.Name}</th></tr>
  <tr><td>${restaurant.Culinary}</td><td>${restaurant.StreetAddress}, ${
    restaurant.NumberAddress
  } - ${restaurant.District}</td><td>${maskedBrazilPhone(
    restaurant.Phone
  )}</td></tr>`;

  document.getElementById("infoRestaurant").innerHTML = htmlInfoRestaurant;

  let output = `
        <tr>
          <th>Nome do Prato</th>
          <th>Descrição</th>
          <th>Preço</th>
        </tr>
    `;
  for (let plate of plates) {
    output += `
      <tr>
        <td>${plate.Name}</td>
        <td>${plate.Description}</td>
        <td>${formatPrice.format(plate.Price)} </td>
      </tr>`;
  }

  if (!document.getElementById("cleanSearch").classList.contains("d-none")) {
    document.getElementById("cleanSearch").classList.toggle("d-none");
  }
  document.getElementById("tablePlates").innerHTML = output;
  toggleCards();
}

function showRestaurants(restaurants) {
  let output = "";

  if (restaurants.length === 0) {
    output += `<div class="alert alert-danger" role="alert">
    Sua busca não retornou resultado.
  </div>`;
  } else {
    for (let restaurant of restaurants) {
      output += `
      <div class="col col-lg-4 col-xs-12 col-sm-12 my-2" >
      <div class="card h-100" style="width: 18rem;">
      <img src="${restaurant.UrlImage}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${restaurant.Name} - ${restaurant.Culinary}</h5>
        <button onclick="getPlates('${restaurant.Id}')" class="btn btn-primary">Ver cardápio</button>
      </div>
    </div></div>
    `;
    }
  }

  document.getElementById("tableRestaurants").innerHTML = output;
}

async function getRestaurants() {
  try {
    const response = await fetch(
      "http://localhost:3333/restaurants",
      requestHeader
    );
    const restaurants = await response.json();
    showRestaurants(restaurants);
  } catch (error) {
    console.error(error);
  }
}

async function searchRestaurantsByName() {
  const partName = document.getElementById("nameRestaurant").value;

  if (!partName && partName === "") {
    return false;
  }
  const option = document.createElement("option");
  option.value = partName;
  document.getElementById("datalistOptions").append(option);
  document.getElementById("cleanSearch").classList.toggle("d-none");
  try {
    const response = await fetch(
      `http://localhost:3333/restaurants/${partName}`,
      requestHeader
    );
    const restaurants = await response.json();
    showRestaurants(restaurants);
  } catch (error) {
    console.error(error);
  }
}

async function backButton() {
  await getRestaurants();
  toggleCards();
}

async function cleanSearch() {
  await getRestaurants();
  document.getElementById("cleanSearch").classList.toggle("d-none");
  document.getElementById("nameRestaurant").value = "";
}
