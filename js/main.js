/********************************************************************************
 * BTI425 – Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Leonardo de la Mora Caceres Student ID: 152877205 Date: Jan-27-2025
 *
 ********************************************************************************/

let page = 1,
  perPage = 10,
  searchName = null

function loadListingsData() {
  let url = `https://listings-api-eight.vercel.app/api/listings?page=${page}&perPage=${perPage}`

  if (searchName !== null) {
    url += `&name=${searchName}`
  }

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status)
    })
    .then((data) => {
      const listingsTable = document.querySelector('#listingsTable')
      if (data.length) {
        listingsTable.innerHTML = toHtmlRow(data)
        document.querySelector('#current-page').innerHTML = page
      } else {
        console.log('empty array, no listings available')

        if (page > 1) {
          page--
          loadListingsData()
        } else {
          listingsTable.innerHTML =
            '<tr><td colspan="4">No data available</td></tr>'
        }
      }
    })
    .catch((err) => {
      console.log({ msg: 'no listings available', error: err })
    })
}

function toHtmlRow(data) {
  let html_listings = []

  data.forEach((e) => {
    const summary = e.summary ? e.summary : 'No summary available'

    const new_lisitng = `<tr data-id="${e._id}">
    <td>${e.name}</td>
    <td>${e.room_type}</td>
    <td>${e.address.street}</td>
    <td>${summary}<br><br>
        <strong>Accomodates:</strong>${e.accommodates}<br>
        <strong>Rating:</strong>${e.review_scores.review_scores_rating} (${e.number_of_reviews} Reviews)
    </td>
    </tr>`

    html_listings.push(new_lisitng)
  })

  return html_listings
}

loadListingsData()

console.log('main.js is connected!')
